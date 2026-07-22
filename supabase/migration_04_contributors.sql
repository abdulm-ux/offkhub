-- Run after schema.sql + migration_02 + migration_03. Safe to re-run.

alter table profiles add column if not exists verified boolean not null default false;

-- Profiles need to be publicly readable for the contributor leaderboard to work
-- (name + verified badge are meant to be public recognition, by design of this feature).
drop policy if exists "Profiles are viewable by owner" on profiles;
drop policy if exists "Public can view profiles" on profiles;
create policy "Public can view profiles" on profiles for select using (true);

-- Aggregate stats per contributor. security_invoker means it respects the RLS
-- policies of whoever queries it (so it only ever counts approved materials
-- via the filter clause below, regardless of who's asking).
drop view if exists contributor_stats;
create view contributor_stats
with (security_invoker = true) as
select
  p.id,
  p.full_name,
  p.verified,
  p.department_id,
  count(m.id) filter (where m.approved) as uploads_count,
  coalesce(sum(m.download_count) filter (where m.approved), 0) as downloads_total
from profiles p
left join materials m on m.uploaded_by = p.id
group by p.id, p.full_name, p.verified, p.department_id;
