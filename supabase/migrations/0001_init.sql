-- Túbir — initial schema (Stage 1)
-- Tables: species, projects, tree_requests
-- Stage 2 will add: users (via Supabase Auth), orders, order_items, trees, nominations, user_nominations

create extension if not exists "pgcrypto";

-- ============================================================
-- species: catalogue of tree species offered on the site
-- ============================================================
create table if not exists public.species (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  price_kzt integer,
  years_to_maturity integer,
  co2_kg_per_year integer,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- projects: target restoration projects (e.g. "Semey orman")
-- ============================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  target_trees integer not null default 0,
  current_trees integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- tree_requests: anonymous "plant a tree" requests (Stage 1)
-- No auth yet — anyone can submit; only admins can read.
-- ============================================================
create table if not exists public.tree_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  country text,
  species_code text not null references public.species(code),
  quantity integer not null default 1 check (quantity between 1 and 1000),
  dedication text,
  project_code text not null default 'vko_green' references public.projects(code),
  status text not null default 'pending'
    check (status in ('pending','contacted','paid','planted','cancelled')),
  locale text not null default 'ru',
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists tree_requests_status_idx on public.tree_requests(status);
create index if not exists tree_requests_created_at_idx on public.tree_requests(created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.species enable row level security;
alter table public.projects enable row level security;
alter table public.tree_requests enable row level security;

-- Anyone (anon) can read active species and projects.
drop policy if exists "species_read_active" on public.species;
create policy "species_read_active" on public.species
  for select using (active = true);

drop policy if exists "projects_read_active" on public.projects;
create policy "projects_read_active" on public.projects
  for select using (active = true);

-- Anyone (anon) can insert a request, but cannot read other people's.
drop policy if exists "tree_requests_anon_insert" on public.tree_requests;
create policy "tree_requests_anon_insert" on public.tree_requests
  for insert with check (true);

-- No SELECT policy = anon cannot read; only service_role (admin / dashboard) can.
