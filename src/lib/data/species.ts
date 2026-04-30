import type { SpeciesCode } from "@/lib/db/types";

export type SpeciesStatic = {
  code: SpeciesCode;
  price_kzt: number;
  years_to_maturity: number;
  co2_kg_per_year: number;
};

// Stage 1: hard-coded catalogue. Stage 2 will fetch from Supabase.
// Numbers are placeholders; replace with real costs after sourcing.
export const SPECIES: SpeciesStatic[] = [
  { code: "pine",    price_kzt: 5000, years_to_maturity: 30, co2_kg_per_year: 22 },
  { code: "birch",   price_kzt: 4500, years_to_maturity: 20, co2_kg_per_year: 18 },
  { code: "spruce",  price_kzt: 6000, years_to_maturity: 40, co2_kg_per_year: 24 },
  { code: "oak",     price_kzt: 7000, years_to_maturity: 60, co2_kg_per_year: 28 },
  { code: "apple",   price_kzt: 5500, years_to_maturity: 10, co2_kg_per_year: 15 },
  { code: "apricot", price_kzt: 5500, years_to_maturity: 10, co2_kg_per_year: 14 },
];

export const SPECIES_BY_CODE: Record<SpeciesCode, SpeciesStatic> = Object.fromEntries(
  SPECIES.map((s) => [s.code, s]),
) as Record<SpeciesCode, SpeciesStatic>;

export function formatKzt(amount: number, locale: string): string {
  const map: Record<string, string> = { ru: "ru-RU", kz: "kk-KZ", en: "en-US" };
  return new Intl.NumberFormat(map[locale] ?? "ru-RU").format(amount) + " ₸";
}
