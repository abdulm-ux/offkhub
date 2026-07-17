-- Run after schema.sql + migration_02. Safe to re-run.
alter table materials add column if not exists recommended boolean not null default false;
create index if not exists idx_materials_recommended on materials(recommended);
