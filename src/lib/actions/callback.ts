"use server";

import { createClient } from "@/lib/supabase/server";
import { callbackSchema, type CallbackInput } from "@/lib/validation/callback";
import { notifyCallbackRequest } from "@/lib/notifications";
import { checkSubmissionGuard } from "@/lib/security/submissions";

export type CallbackError =
  | "validation"
  | "spam"
  | "rate_limited"
  | "db_schema"
  | "db_policy"
  | "db"
  | "unknown";

export type CallbackResult = { ok: true } | { ok: false; error: CallbackError };

function isPlaceholderEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return !url || url.includes("your-project") || url.includes("example");
}

function mapSupabaseError(error: { code?: string; message?: string }): CallbackError {
  if (error.code === "PGRST205" || error.message?.includes("schema cache")) {
    return "db_schema";
  }
  if (error.code === "42501" || error.message?.includes("row-level security")) {
    return "db_policy";
  }
  return "db";
}

export async function submitCallback(input: CallbackInput): Promise<CallbackResult> {
  const parsed = callbackSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation" };
  const data = parsed.data;

  const guard = checkSubmissionGuard({
    bucket: "callback",
    identity: data.phone,
    honeypot: data.website,
    startedAt: data.startedAt,
    maxAttempts: 4,
  });
  if (!guard.ok) {
    return { ok: false, error: guard.error };
  }

  if (isPlaceholderEnv()) {
    console.log("[callback] dev-mode submission:", data);
    return { ok: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("callback_requests").insert({
      name: data.name,
      phone: data.phone,
      locale: data.locale,
      source_page: data.source ?? null,
    });
    if (error) {
      console.error("[callback] supabase insert error:", error);
      return { ok: false, error: mapSupabaseError(error) };
    }
    await notifyCallbackRequest(data);
    return { ok: true };
  } catch (err) {
    console.error("[callback] unexpected error:", err);
    return { ok: false, error: "unknown" };
  }
}
