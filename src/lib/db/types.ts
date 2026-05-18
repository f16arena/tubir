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

export type CallbackStatus = "pending" | "called" | "missed" | "closed" | "spam";

export type PledgeStatus =
  | "pending"
  | "contacted"
  | "converted"
  | "cancelled"
  | "spam";

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
  user_agent: string | null;
  ip_hash: string | null;
  identity_hash: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export type CallbackRequest = {
  id: string;
  name: string;
  phone: string;
  locale: string;
  source_page: string | null;
  status: CallbackStatus;
  user_agent: string | null;
  ip_hash: string | null;
  identity_hash: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export type Pledge = {
  id: string;
  name: string;
  email: string;
  species_code: SpeciesCode | null;
  locale: string;
  source_page: string | null;
  status: PledgeStatus;
  user_agent: string | null;
  ip_hash: string | null;
  identity_hash: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};
