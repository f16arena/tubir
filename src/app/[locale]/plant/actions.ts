"use server";

import { createClient } from "@/lib/supabase/server";
import { plantRequestSchema, type PlantRequestInput } from "@/lib/validation/plant";
import { notifyPlantRequest } from "@/lib/notifications";
import { checkSubmissionGuard } from "@/lib/security/submissions";

export type PlantActionError =
  | "validation"
  | "spam"
  | "rate_limited"
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

  const guard = checkSubmissionGuard({
    bucket: "plant",
    identity: data.email,
    honeypot: data.website,
    startedAt: data.startedAt,
    maxAttempts: 3,
  });
  if (!guard.ok) {
    return { ok: false, error: guard.error };
  }

  // Dev mode: env not configured yet — log and treat as success for UI testing.
  if (isPlaceholderEnv()) {
    console.log("[plant] dev-mode submission (no Supabase configured):", data);
    return { ok: true };
  }

  try {
    const supabase = await createClient();
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
    });
    if (error) {
      console.error("[plant] supabase insert error:", error);
      return { ok: false, error: mapSupabaseError(error) };
    }
    await notifyPlantRequest(data);
    return { ok: true };
  } catch (err) {
    console.error("[plant] unexpected error:", err);
    return { ok: false, error: "unknown" };
  }
}
