-- Túbir — public stats RPC
-- Exposes a single SECURITY DEFINER function that returns aggregate
-- counters anon clients are allowed to see (e.g. total reservations).
-- We don't expose the underlying rows; only summary numbers.

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
    'planted_count', coalesce((
      select sum(current_trees)::int
      from public.projects
      where active = true
    ), 0)
  );
$$;

revoke all on function public.get_public_stats() from public;
grant execute on function public.get_public_stats() to anon, authenticated;
