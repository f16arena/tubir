-- Túbir — callback requests (Stage 1.1)
-- Anonymous "call me back" widget used on every page.

create table if not exists public.callback_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  locale text not null default 'ru',
  source_page text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists callback_requests_created_at_idx
  on public.callback_requests(created_at desc);

alter table public.callback_requests enable row level security;

drop policy if exists "callback_anon_insert" on public.callback_requests;
create policy "callback_anon_insert" on public.callback_requests
  for insert with check (true);
-- No SELECT policy — anon cannot read; only service_role / dashboard can.
