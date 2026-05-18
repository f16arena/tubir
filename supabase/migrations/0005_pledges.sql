-- Túbir — Founders Circle pledges
-- Lightweight intent capture: name + email, no commitment.
-- Distinct from tree_requests (the booking funnel) and from
-- callback_requests (phone-based intent). RLS allows anon to insert
-- only through trusted server code; admins read via service_role.

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
  status text not null default 'pending'
    check (status in ('pending','contacted','converted','cancelled','spam')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists pledges_email_unique
  on public.pledges (lower(email));

create index if not exists pledges_created_at_idx
  on public.pledges (created_at desc);

create index if not exists pledges_status_idx
  on public.pledges (status);

create index if not exists pledges_identity_hash_idx
  on public.pledges (identity_hash);

alter table public.pledges enable row level security;
revoke insert, update, delete on public.pledges from anon, authenticated;
-- No SELECT policy = anon cannot read pledges. service_role only.

-- Trigger: keep updated_at fresh on UPDATE. Uses set_updated_at()
-- function defined in 0003_security_admin.sql.
drop trigger if exists pledges_set_updated_at on public.pledges;
create trigger pledges_set_updated_at
  before update on public.pledges
  for each row
  execute function public.set_updated_at();

-- Allow the submission_events table to track pledge bucket too.
-- Drop and recreate the bucket check to include 'pledge'.
do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'submission_events_bucket_check'
  ) then
    alter table public.submission_events
      drop constraint submission_events_bucket_check;
  end if;
end $$;

alter table public.submission_events
  add constraint submission_events_bucket_check
  check (bucket in ('plant','callback','pledge'));

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
      where status <> 'cancelled' and status <> 'spam'
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
