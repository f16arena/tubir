-- Tubir - security hardening and admin metadata
-- Run after 0001_init.sql, 0002_callback.sql, and seed.sql.

create extension if not exists "pgcrypto";

-- Requests are accepted only through trusted server code now.
drop policy if exists "tree_requests_anon_insert" on public.tree_requests;
drop policy if exists "callback_anon_insert" on public.callback_requests;

revoke insert, update, delete on public.tree_requests from anon, authenticated;
revoke insert, update, delete on public.callback_requests from anon, authenticated;

grant select on public.species to anon, authenticated;
grant select on public.projects to anon, authenticated;

alter table public.tree_requests
  add column if not exists ip_hash text,
  add column if not exists identity_hash text,
  add column if not exists admin_note text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.callback_requests
  add column if not exists status text not null default 'pending',
  add column if not exists ip_hash text,
  add column if not exists identity_hash text,
  add column if not exists admin_note text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.callback_requests
  alter column status set default 'pending';

update public.callback_requests
set status = 'pending'
where status is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'callback_requests_status_check'
  ) then
    alter table public.callback_requests
      add constraint callback_requests_status_check
      check (status in ('pending','called','missed','closed','spam'));
  end if;
end $$;

create index if not exists tree_requests_identity_hash_idx
  on public.tree_requests(identity_hash);
create index if not exists tree_requests_ip_hash_idx
  on public.tree_requests(ip_hash);
create index if not exists tree_requests_updated_at_idx
  on public.tree_requests(updated_at desc);

create index if not exists callback_requests_status_idx
  on public.callback_requests(status);
create index if not exists callback_requests_identity_hash_idx
  on public.callback_requests(identity_hash);
create index if not exists callback_requests_ip_hash_idx
  on public.callback_requests(ip_hash);
create index if not exists callback_requests_updated_at_idx
  on public.callback_requests(updated_at desc);

create table if not exists public.submission_events (
  id uuid primary key default gen_random_uuid(),
  bucket text not null check (bucket in ('plant','callback')),
  identity_hash text not null,
  ip_hash text,
  user_agent_hash text,
  accepted boolean not null default false,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists submission_events_identity_window_idx
  on public.submission_events(bucket, identity_hash, created_at desc);
create index if not exists submission_events_ip_window_idx
  on public.submission_events(bucket, ip_hash, created_at desc)
  where ip_hash is not null;
create index if not exists submission_events_created_at_idx
  on public.submission_events(created_at desc);

alter table public.submission_events enable row level security;
revoke all on public.submission_events from anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tree_requests_set_updated_at on public.tree_requests;
create trigger tree_requests_set_updated_at
  before update on public.tree_requests
  for each row
  execute function public.set_updated_at();

drop trigger if exists callback_requests_set_updated_at on public.callback_requests;
create trigger callback_requests_set_updated_at
  before update on public.callback_requests
  for each row
  execute function public.set_updated_at();
