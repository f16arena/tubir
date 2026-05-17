-- Túbir — Founders Circle pledges
-- Lightweight intent capture: name + email, no commitment.
-- Distinct from tree_requests (which is the booking funnel) and from
-- callback_requests (phone-based intent). RLS allows anon to insert,
-- only service_role can read.

create table if not exists public.pledges (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 120),
  email text not null check (length(email) between 3 and 200),
  species_code text references public.species(code),
  locale text not null default 'ru',
  source_page text,
  user_agent text,
  ip_hash text,
  identity_hash text,
  created_at timestamptz not null default now()
);

create unique index if not exists pledges_email_unique
  on public.pledges (lower(email));

create index if not exists pledges_created_at_idx
  on public.pledges (created_at desc);

alter table public.pledges enable row level security;

drop policy if exists "pledges_anon_insert" on public.pledges;
create policy "pledges_anon_insert" on public.pledges
  for insert with check (true);

-- No SELECT policy = anon cannot read pledges. service_role only.

-- ============================================================
-- Update public stats RPC to count both bookings and pledges
-- ============================================================
create or replace function public.get_public_stats()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'bookings_count', coalesce((
      select sum(quantity)::int
      from public.tree_requests
      where status <> 'cancelled'
    ), 0),
    'pledges_count', coalesce((
      select count(*)::int from public.pledges
    ), 0),
    'planted_count', coalesce((
      select sum(current_trees)::int
      from public.projects
      where active = true
    ), 0)
  );
$$;

revoke all on function public.get_public_stats() from public;
grant execute on function public.get_public_stats() to anon, authenticated;
