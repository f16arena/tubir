-- Túbir — allow authenticated users to read their own records.
-- Used by the /me dashboard. Users sign in with a magic link; Supabase
-- exposes their email via auth.email(). RLS limits visible rows to
-- records where the email matches (case-insensitive).

grant select on public.tree_requests to authenticated;
grant select on public.pledges to authenticated;

drop policy if exists "tree_requests_user_own_select" on public.tree_requests;
create policy "tree_requests_user_own_select" on public.tree_requests
  for select to authenticated
  using (lower(email) = lower(coalesce(auth.email(), '')));

drop policy if exists "pledges_user_own_select" on public.pledges;
create policy "pledges_user_own_select" on public.pledges
  for select to authenticated
  using (lower(email) = lower(coalesce(auth.email(), '')));
