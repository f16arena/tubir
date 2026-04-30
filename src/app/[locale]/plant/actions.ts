"use server";

import { createClient } from "@/lib/supabase/server";
import { plantRequestSchema, type PlantRequestInput } from "@/lib/validation/plant";

export type PlantActionResult =
  | { ok: true }
  | { ok: false; error: string };

function isPlaceholderEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return !url || url.includes("your-project") || url.includes("example");
}

export async function submitPlantRequest(
  input: PlantRequestInput,
): Promise<PlantActionResult> {
  const parsed = plantRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }
  const data = parsed.data;

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
      return { ok: false, error: "db" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[plant] unexpected error:", err);
    return { ok: false, error: "unknown" };
  }
}
