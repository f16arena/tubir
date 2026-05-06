"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { plantRequestSchema, type PlantRequestInput } from "@/lib/validation/plant";
import { notifyPlantRequest } from "@/lib/notifications";
import { checkSubmissionGuard } from "@/lib/security/submissions";
import { getSubmissionRequestContext } from "@/lib/security/request-context";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export type PlantActionError =
  | "validation"
  | "spam"
  | "rate_limited"
  | "turnstile"
  | "turnstile_config"
  | "security_config"
  | "db_schema"
  | "db_relation"
  | "db_policy"
  | "db"
  | "unknown";

export type PlantActionResult =
  | { ok: true }
  | { ok: false; error: PlantActionError };

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

function mapSupabaseError(error: { code?: string; message?: string }): PlantActionError {
  if (error.code === "PGRST205" || error.message?.includes("schema cache")) {
    return "db_schema";
  }
  if (error.code === "23503") {
    return "db_relation";
  }
  if (error.code === "42501" || error.message?.includes("row-level security")) {
    return "db_policy";
  }
  return "db";
}

export async function submitPlantRequest(
  input: PlantRequestInput,
): Promise<PlantActionResult> {
  const parsed = plantRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }
  const data = parsed.data;
  const context = await getSubmissionRequestContext();

  const turnstile = await verifyTurnstileToken(data.turnstileToken, context.ip);
  if (!turnstile.ok) {
    return { ok: false, error: turnstile.error };
  }

  if (shouldBypassBackendInDev()) {
    console.log("[plant] dev-mode submission (no Supabase admin configured):", {
      ...data,
      turnstileToken: data.turnstileToken ? "[present]" : "",
    });
    return { ok: true };
  }

  try {
    const supabase = createAdminClient();
    const guard = await checkSubmissionGuard({
      supabase,
      bucket: "plant",
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

    const { error } = await supabase.from("tree_requests").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      country: data.country || null,
      species_code: data.species,
      quantity: data.quantity,
      dedication: data.dedication || null,
      project_code: "vko_green",
      status: "pending",
      locale: data.locale,
      user_agent: context.userAgent,
      ip_hash: guard.ipHash,
      identity_hash: guard.identityHash,
    });
    if (error) {
      console.error("[plant] supabase insert error:", error);
      return { ok: false, error: mapSupabaseError(error) };
    }
    await notifyPlantRequest(data);
    return { ok: true };
  } catch (err) {
    console.error("[plant] unexpected error:", err);
    return { ok: false, error: "security_config" };
  }
}
