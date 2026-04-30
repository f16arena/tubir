"use server";

import { createClient } from "@/lib/supabase/server";
import { callbackSchema, type CallbackInput } from "@/lib/validation/callback";

export type CallbackResult = { ok: true } | { ok: false; error: string };

function isPlaceholderEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return !url || url.includes("your-project") || url.includes("example");
}

export async function submitCallback(input: CallbackInput): Promise<CallbackResult> {
  const parsed = callbackSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation" };
  const data = parsed.data;

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
      return { ok: false, error: "db" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[callback] unexpected error:", err);
    return { ok: false, error: "unknown" };
  }
}
