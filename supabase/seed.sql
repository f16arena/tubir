-- Túbir — seed data (Stage 1)
-- Replace placeholder prices once real costs are calculated.

insert into public.projects (code, target_trees, current_trees) values
  ('vko_green', 100000, 0)
on conflict (code) do nothing;

insert into public.species (code, price_kzt, years_to_maturity, co2_kg_per_year) values
  ('pine',    5000, 30, 22),
  ('birch',   4500, 20, 18),
  ('spruce',  6000, 40, 24),
  ('oak',     7000, 60, 28),
  ('apple',   5500, 10, 15),
  ('apricot', 5500, 10, 14)
on conflict (code) do nothing;
