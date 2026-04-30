export type SpeciesCode =
  | "pine"
  | "birch"
  | "spruce"
  | "oak"
  | "apple"
  | "apricot";

export type RequestStatus =
  | "pending"
  | "contacted"
  | "paid"
  | "planted"
  | "cancelled";

export type Species = {
  id: string;
  code: SpeciesCode;
  price_kzt: number | null;
  years_to_maturity: number | null;
  co2_kg_per_year: number | null;
  active: boolean;
};

export type Project = {
  id: string;
  code: string;
  target_trees: number;
  current_trees: number;
};

export type TreeRequest = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  species_code: SpeciesCode;
  quantity: number;
  dedication: string | null;
  project_code: string;
  status: RequestStatus;
  locale: string;
  created_at: string;
};
