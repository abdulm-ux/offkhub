-- Run this AFTER schema.sql if your Supabase project already exists
-- (i.e. you deployed before this update). Safe to re-run.

insert into schools (name, slug) values
  ('School of Engineering and Engineering Technology', 'seet'),
  ('School of Physical Sciences', 'sps'),
  ('School of Life Sciences', 'sls'),
  ('School of Information and Communication Technology', 'sict'),
  ('School of Agriculture and Agricultural Technology', 'saat')
on conflict (slug) do nothing;

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
where schools.slug = 'seet'
on conflict (school_id, slug) do nothing;

insert into departments (school_id, name, slug)
select id, d.name, d.slug from schools, (values
  ('Physics', 'physics'),
  ('Industrial Chemistry', 'industrial-chemistry'),
  ('Mathematics', 'mathematics'),
  ('Statistics', 'statistics'),
  ('Geology', 'geology'),
  ('Geography', 'geography')
) as d(name, slug)
where schools.slug = 'sps'
on conflict (school_id, slug) do nothing;

insert into departments (school_id, name, slug)
select id, d.name, d.slug from schools, (values
  ('Biochemistry', 'biochemistry'),
  ('Microbiology', 'microbiology'),
  ('Plant Biology', 'plant-biology'),
  ('Animal Biology', 'animal-biology'),
  ('Biotechnology', 'biotechnology')
) as d(name, slug)
where schools.slug = 'sls'
on conflict (school_id, slug) do nothing;

insert into departments (school_id, name, slug)
select id, d.name, d.slug from schools, (values
  ('Computer Science', 'computer-science'),
  ('Information and Media Technology', 'information-media-technology'),
  ('Cyber Security Science', 'cyber-security-science'),
  ('Software Engineering', 'software-engineering'),
  ('Information Technology and Communications', 'information-technology-communications')
) as d(name, slug)
where schools.slug = 'sict'
on conflict (school_id, slug) do nothing;

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
where schools.slug = 'saat'
on conflict (school_id, slug) do nothing;
