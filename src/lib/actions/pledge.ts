"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { pledgeSchema, type PledgeInput } from "@/lib/validation/pledge";
import { notifyPledge } from "@/lib/notifications";
import { checkSubmissionGuard } from "@/lib/security/submissions";
import { getSubmissionRequestContext } from "@/lib/security/request-context";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export type PledgeError =
  | "validation"
  | "spam"
  | "rate_limited"
  | "turnstile"
  | "turnstile_config"
  | "security_config"
  | "db_schema"
  | "db_policy"
  | "db_duplicate"
  | "db"
  | "unknown";

export type PledgeResult = { ok: true } | { ok: false; error: PledgeError };

function isPlaceholderEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return !url || url.includes("your-project") || url.includes("example");
}

function shouldBypassBackendInDev(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    (isPlaceholderEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

function mapSupabaseError(error: { code?: string; message?: string }): PledgeError {
  if (error.code === "23505" || error.message?.includes("duplicate")) {
    return "db_duplicate";
  }
  if (error.code === "PGRST205" || error.message?.includes("schema cache")) {
    return "db_schema";
  }
  if (error.code === "42501" || error.message?.includes("row-level security")) {
    return "db_policy";
  }
  return "db";
}

export async function submitPledge(input: PledgeInput): Promise<PledgeResult> {
  const parsed = pledgeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation" };

  const data = parsed.data;
  const context = await getSubmissionRequestContext();

  const turnstile = await verifyTurnstileToken(data.turnstileToken, context.ip);
  if (!turnstile.ok) {
    return { ok: false, error: turnstile.error };
  }

  if (shouldBypassBackendInDev()) {
    console.log("[pledge] dev-mode submission:", {
      ...data,
      turnstileToken: data.turnstileToken ? "[present]" : "",
    });
    return { ok: true };
  }

  try {
    const supabase = createAdminClient();
    const guard = await checkSubmissionGuard({
      supabase,
      bucket: "pledge",
      identity: data.email,
      ip: context.ip,
      userAgent: context.userAgent,
      honeypot: data.website,
      startedAt: data.startedAt,
      maxAttempts: 3,
    });
    if (!guard.ok) {
      return { ok: false, error: guard.error };
    }

    const { error } = await supabase.from("pledges").insert({
      name: data.name,
      email: data.email,
      species_code: data.speciesCode || null,
      locale: data.locale,
      source_page: data.source ?? null,
      user_agent: context.userAgent,
      ip_hash: guard.ipHash,
      identity_hash: guard.identityHash,
    });
    if (error) {
      console.error("[pledge] supabase insert error:", error);
      return { ok: false, error: mapSupabaseError(error) };
    }
    await notifyPledge(data);
    return { ok: true };
  } catch (err) {
    console.error("[pledge] unexpected error:", err);
    return { ok: false, error: "security_config" };
  }
}
