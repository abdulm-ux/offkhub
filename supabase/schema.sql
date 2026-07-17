-- FUTMinna Digital Archive — Schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)

create extension if not exists "uuid-ossp";

-- ── Core hierarchy ───────────────────────────────────────────
create table schools (
  id uuid primary key default uuid_generate_v4(),
  name text not null,               -- "School of Environmental Technology"
  slug text unique not null,        -- "set"
  created_at timestamptz default now()
);

create table departments (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid references schools(id) on delete cascade,
  name text not null,               -- "Architecture"
  slug text not null,               -- "architecture"
  unique (school_id, slug)
);

create table courses (
  id uuid primary key default uuid_generate_v4(),
  department_id uuid references departments(id) on delete cascade,
  level int not null check (level in (100,200,300,400,500)),
  code text not null,                -- "ARC 401"
  title text not null,               -- "Architectural Design VII"
  unique (department_id, code)
);

-- ── Users ────────────────────────────────────────────────────
-- Mirrors auth.users; created via trigger on signup (see below)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  department_id uuid references departments(id),
  role text not null default 'student' check (role in ('student','contributor','admin')),
  created_at timestamptz default now()
);

-- ── Materials ────────────────────────────────────────────────
-- course_id is nullable because SIWES logs / project archives are often
-- department-wide rather than tied to one course.
create table materials (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id) on delete cascade,
  department_id uuid references departments(id) on delete cascade,
  type text not null check (type in ('lecture_note','past_question','textbook','slide','siwes','project','other')),
  title text not null,
  file_path text not null,           -- path inside the `materials` storage bucket
  file_size_kb int,
  session text,                      -- "2023/2024"
  semester text check (semester in ('first','second')),
  uploaded_by uuid references profiles(id),
  approved boolean not null default false,
  recommended boolean not null default false,
  download_count int not null default 0,
  created_at timestamptz default now(),
  constraint materials_scope check (course_id is not null or department_id is not null)
);

create index idx_materials_course on materials(course_id);
create index idx_materials_department on materials(department_id);
create index idx_materials_approved on materials(approved);

-- ── News ─────────────────────────────────────────────────────
create table news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null,
  posted_by uuid references profiles(id),
  published boolean not null default true,
  created_at timestamptz default now()
);

-- ── Academic calendar ────────────────────────────────────────
create table calendar_events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  category text not null default 'academic' check (category in ('academic','exam','registration','holiday','other')),
  start_date date not null,
  end_date date,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create index idx_calendar_start on calendar_events(start_date);

-- ── Auto-create profile row on signup ─────────────────────────
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Row Level Security ─────────────────────────────────────────
alter table materials enable row level security;
alter table profiles enable row level security;
alter table news enable row level security;
alter table calendar_events enable row level security;
alter table courses enable row level security;
alter table departments enable row level security;

-- Anyone (incl. anonymous) can read approved materials
create policy "Public can view approved materials"
  on materials for select
  using (approved = true);

-- Logged-in users can insert (goes in as unapproved by default)
create policy "Authenticated users can upload"
  on materials for insert
  to authenticated
  with check (uploaded_by = auth.uid());

-- Users can see their own pending uploads
create policy "Users can view own uploads"
  on materials for select
  using (uploaded_by = auth.uid());

-- Admins can do anything to materials (approve/reject/edit/delete)
create policy "Admins can manage materials"
  on materials for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Profiles are viewable by owner"
  on profiles for select
  using (auth.uid() = id);

-- Courses & departments: public read, admin write
create policy "Public can view departments" on departments for select using (true);
create policy "Admins can manage departments" on departments for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Public can view courses" on courses for select using (true);
create policy "Admins can manage courses" on courses for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- News: public reads published posts, admins manage everything
create policy "Public can view published news" on news for select using (published = true);
create policy "Admins can manage news" on news for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Calendar: public read, admin write
create policy "Public can view calendar" on calendar_events for select using (true);
create policy "Admins can manage calendar" on calendar_events for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ── Seed: School of Environmental Technology ───────────────────
insert into schools (name, slug) values ('School of Environmental Technology', 'set');

insert into departments (school_id, name, slug)
select id, d.name, d.slug from schools, (values
  ('Architecture', 'architecture'),
  ('Building', 'building'),
  ('Estate Management', 'estate-management'),
  ('Surveying and Geoinformatics', 'surveying-geoinformatics'),
  ('Urban and Regional Planning', 'urban-regional-planning'),
  ('Quantity Surveying', 'quantity-surveying')
) as d(name, slug)
where schools.slug = 'set';

-- ── Seed: remaining schools ──────────────────────────────────
-- NOTE: FUTMinna has restructured some schools recently (e.g. SAAT splitting,
-- a new Architecture-focused school spinning out of SET). The list below
-- reflects the long-standing structure. Verify against the current student
-- handbook and adjust via /admin/schools + /admin/departments if anything
-- has moved — that's exactly what those pages are for.
insert into schools (name, slug) values
  ('School of Engineering and Engineering Technology', 'seet'),
  ('School of Physical Sciences', 'sps'),
  ('School of Life Sciences', 'sls'),
  ('School of Information and Communication Technology', 'sict'),
  ('School of Agriculture and Agricultural Technology', 'saat');

insert into departments (school_id, name, slug)
select id, d.name, d.slug from schools, (values
  ('Electrical and Electronics Engineering', 'electrical-electronics-engineering'),
  ('Mechanical Engineering', 'mechanical-engineering'),
  ('Civil Engineering', 'civil-engineering'),
  ('Chemical Engineering', 'chemical-engineering'),
  ('Mechatronics Engineering', 'mechatronics-engineering'),
  ('Computer Engineering', 'computer-engineering'),
  ('Telecommunications Engineering', 'telecommunications-engineering'),
  ('Agricultural and Bioresources Engineering', 'agricultural-bioresources-engineering')
) as d(name, slug)
where schools.slug = 'seet';

insert into departments (school_id, name, slug)
select id, d.name, d.slug from schools, (values
  ('Physics', 'physics'),
  ('Industrial Chemistry', 'industrial-chemistry'),
  ('Mathematics', 'mathematics'),
  ('Statistics', 'statistics'),
  ('Geology', 'geology'),
  ('Geography', 'geography')
) as d(name, slug)
where schools.slug = 'sps';

insert into departments (school_id, name, slug)
select id, d.name, d.slug from schools, (values
  ('Biochemistry', 'biochemistry'),
  ('Microbiology', 'microbiology'),
  ('Plant Biology', 'plant-biology'),
  ('Animal Biology', 'animal-biology'),
  ('Biotechnology', 'biotechnology')
) as d(name, slug)
where schools.slug = 'sls';

insert into departments (school_id, name, slug)
select id, d.name, d.slug from schools, (values
  ('Computer Science', 'computer-science'),
  ('Information and Media Technology', 'information-media-technology'),
  ('Cyber Security Science', 'cyber-security-science'),
  ('Software Engineering', 'software-engineering'),
  ('Information Technology and Communications', 'information-technology-communications')
) as d(name, slug)
where schools.slug = 'sict';

insert into departments (school_id, name, slug)
select id, d.name, d.slug from schools, (values
  ('Agricultural Economics and Farm Management', 'agricultural-economics-farm-management'),
  ('Animal Production', 'animal-production'),
  ('Crop Production', 'crop-production'),
  ('Agricultural Extension and Rural Development', 'agricultural-extension-rural-development'),
  ('Fisheries and Aquaculture', 'fisheries-aquaculture'),
  ('Forestry and Wildlife Management', 'forestry-wildlife-management'),
  ('Soil Science', 'soil-science')
) as d(name, slug)
where schools.slug = 'saat';

-- ── Storage bucket for files ────────────────────────────────────
insert into storage.buckets (id, name, public) values ('materials', 'materials', true)
on conflict do nothing;

create policy "Public read on materials bucket"
  on storage.objects for select
  using (bucket_id = 'materials');

create policy "Authenticated upload to materials bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'materials');
