import { SPECIES, type SpeciesStatic } from "@/lib/data/species";
import type { SpeciesCode } from "@/lib/db/types";

export type ProjectProgress = {
  code: string;
  target_trees: number;
  current_trees: number;
};

const FALLBACK_PROGRESS: ProjectProgress = {
  code: "vko_green",
  target_trees: 100_000,
  current_trees: 0,
};

const speciesCodes = new Set<SpeciesCode>(SPECIES.map((item) => item.code));

type SpeciesRow = {
  code?: string | null;
  price_kzt?: number | null;
  years_to_maturity?: number | null;
  co2_kg_per_year?: number | null;
};

function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your-project") || url.includes("example")) {
    return null;
  }
  return { url: url.replace(/\/$/, ""), key };
}

async function fetchPublicRows<T>(table: string, query: URLSearchParams): Promise<T[] | null> {
  const config = getPublicSupabaseConfig();
  if (!config) return null;

  try {
    const response = await fetch(
      `${config.url}/rest/v1/${table}?${query.toString()}`,
      {
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
        },
        next: { revalidate: 60 * 30 },
      },
    );

    if (!response.ok) {
      console.warn(`[supabase-public] ${table} returned ${response.status}`);
      return null;
    }

    return (await response.json()) as T[];
  } catch (err) {
    console.warn(`[supabase-public] ${table} fetch failed:`, err);
    return null;
  }
}

export async function getSpeciesCatalog(): Promise<SpeciesStatic[]> {
  const query = new URLSearchParams({
    select: "code,price_kzt,years_to_maturity,co2_kg_per_year",
    active: "eq.true",
  });

  const rows = await fetchPublicRows<SpeciesRow>("species", query);
  if (!rows?.length) return SPECIES;

  const byCode = new Map<SpeciesCode, Partial<SpeciesStatic>>();
  for (const row of rows) {
    if (typeof row.code !== "string" || !speciesCodes.has(row.code as SpeciesCode)) {
      continue;
    }
    const code = row.code as SpeciesCode;
    byCode.set(code, {
      code,
      ...(typeof row.price_kzt === "number" ? { price_kzt: row.price_kzt } : {}),
      ...(typeof row.years_to_maturity === "number"
        ? { years_to_maturity: row.years_to_maturity }
        : {}),
      ...(typeof row.co2_kg_per_year === "number"
        ? { co2_kg_per_year: row.co2_kg_per_year }
        : {}),
    });
  }

  return SPECIES.map((fallback) => ({
    ...fallback,
    ...byCode.get(fallback.code),
  }));
}

export async function getProjectProgress(code = "vko_green"): Promise<ProjectProgress> {
  const query = new URLSearchParams({
    select: "code,target_trees,current_trees",
    code: `eq.${code}`,
    active: "eq.true",
    limit: "1",
  });

  const rows = await fetchPublicRows<ProjectProgress>("projects", query);
  return rows?.[0] ?? FALLBACK_PROGRESS;
}
