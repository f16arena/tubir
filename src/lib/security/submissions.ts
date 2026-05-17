import "server-only";

import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

type SubmissionBucket = "plant" | "callback" | "pledge";

type SubmissionGuardInput = {
  supabase: SupabaseClient;
  bucket: SubmissionBucket;
  identity: string;
  ip?: string | null;
  userAgent?: string | null;
  honeypot?: string;
  startedAt?: number;
  maxAttempts?: number;
  windowMs?: number;
  minDelayMs?: number;
};

export type SubmissionGuardError =
  | "spam"
  | "rate_limited"
  | "security_config"
  | "db_schema"
  | "db";
export type SubmissionGuardResult =
  | { ok: true; identityHash: string; ipHash: string | null; userAgentHash: string | null }
  | { ok: false; error: SubmissionGuardError };

function normalizeIdentity(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function getHashSalt(): string | null {
  const salt = process.env.SUBMISSION_HASH_SALT;
  if (salt) return salt;
  return process.env.NODE_ENV === "production" ? null : "dev-submission-salt";
}

function hashValue(scope: string, value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  const salt = getHashSalt();
  if (!salt) return null;

  return createHash("sha256")
    .update(`${salt}:${scope}:${normalized}`)
    .digest("hex");
}

function mapEventError(error: { code?: string; message?: string }): SubmissionGuardError {
  if (error.code === "PGRST205" || error.message?.includes("schema cache")) {
    return "db_schema";
  }
  return "db";
}

async function countRecentEvents(
  supabase: SupabaseClient,
  bucket: SubmissionBucket,
  column: "identity_hash" | "ip_hash",
  value: string,
  since: string,
): Promise<{ count: number } | { error: SubmissionGuardError }> {
  const { count, error } = await supabase
    .from("submission_events")
    .select("id", { count: "exact", head: true })
    .eq("bucket", bucket)
    .eq(column, value)
    .gte("created_at", since);

  if (error) {
    return { error: mapEventError(error) };
  }

  return { count: count ?? 0 };
}

async function recordSubmissionEvent({
  supabase,
  bucket,
  identityHash,
  ipHash,
  userAgentHash,
  accepted,
  reason,
}: {
  supabase: SupabaseClient;
  bucket: SubmissionBucket;
  identityHash: string;
  ipHash: string | null;
  userAgentHash: string | null;
  accepted: boolean;
  reason: string;
}): Promise<SubmissionGuardError | null> {
  const { error } = await supabase.from("submission_events").insert({
    bucket,
    identity_hash: identityHash,
    ip_hash: ipHash,
    user_agent_hash: userAgentHash,
    accepted,
    reason,
  });

  return error ? mapEventError(error) : null;
}

export async function checkSubmissionGuard({
  supabase,
  bucket,
  identity,
  ip,
  userAgent,
  honeypot,
  startedAt,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000,
  minDelayMs = 1800,
}: SubmissionGuardInput): Promise<SubmissionGuardResult> {
  if (honeypot?.trim()) {
    return { ok: false, error: "spam" };
  }

  const now = Date.now();
  if (startedAt && now - startedAt < minDelayMs) {
    return { ok: false, error: "spam" };
  }

  const identityHash = hashValue("identity", normalizeIdentity(identity) || "anonymous");
  const ipHash = hashValue("ip", ip);
  const userAgentHash = hashValue("user_agent", userAgent);
  if (!identityHash) {
    return { ok: false, error: "security_config" };
  }

  const since = new Date(now - windowMs).toISOString();
  const identityCount = await countRecentEvents(
    supabase,
    bucket,
    "identity_hash",
    identityHash,
    since,
  );
  if ("error" in identityCount) {
    return { ok: false, error: identityCount.error };
  }

  const ipCount = ipHash
    ? await countRecentEvents(supabase, bucket, "ip_hash", ipHash, since)
    : { count: 0 };
  if ("error" in ipCount) {
    return { ok: false, error: ipCount.error };
  }

  if (identityCount.count >= maxAttempts || ipCount.count >= maxAttempts) {
    await recordSubmissionEvent({
      supabase,
      bucket,
      identityHash,
      ipHash,
      userAgentHash,
      accepted: false,
      reason: "rate_limited",
    });
    return { ok: false, error: "rate_limited" };
  }

  const eventError = await recordSubmissionEvent({
    supabase,
    bucket,
    identityHash,
    ipHash,
    userAgentHash,
    accepted: true,
    reason: "accepted",
  });
  if (eventError) {
    return { ok: false, error: eventError };
  }

  return { ok: true, identityHash, ipHash, userAgentHash };
}
