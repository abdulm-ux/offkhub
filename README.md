# offkhub — FUTMinna Course Archive (SET)

The name: FUTMinna students call anywhere outside campus "offk" (off campus).
offkhub flips that — everything you used to have to go off campus to sort out
(materials, past questions, SIWES logs) sorted here instead.

Course materials and past questions for the School of Environmental Technology,
built as the pilot for a full FUTMinna archive.

## Design direction
A drafting/blueprint aesthetic: navy grid-paper background, cream "tracing paper"
cards, and a course header modeled directly on an architectural drawing's
**title block** (code, level, department, sheet count) instead of a generic hero.

## Stack
Next.js 14 (App Router) + Supabase (Postgres, Auth, Storage).

## Deploying without a laptop
1. **Supabase — do this yourself, mobile browser is fine.** Create a project at
   supabase.com, paste `supabase/schema.sql` into the SQL editor and run it,
   copy the project URL + anon key.
2. **Everything else — hand the unzipped project to Manus** (or Termux if you'd
   rather keep it local): `npm install`, push to a GitHub repo, then import that
   repo at vercel.com from your phone browser and paste in the two Supabase
   env vars when it asks. Vercel's import flow is a few taps and works fine on mobile.
3. Once deployed, sign in once on the live site, then in Supabase's SQL editor:
   `update profiles set role = 'admin' where id = '<your-auth-uid>';`


## Adding courses
`schema.sql` seeds departments only, not individual courses (there are hundreds
across 5 levels × 6 departments). Add them via the SQL editor, e.g.:

```sql
insert into courses (department_id, level, code, title)
select id, 400, 'ARC 401', 'Architectural Design VII'
from departments where slug = 'architecture';
```

Or build a small admin form later — the `courses` table and RLS are already
in place for it.

## Making yourself an admin
After signing in once (so your `profiles` row exists):

```sql
update profiles set role = 'admin' where id = '<your-auth-uid>';
```

Then visit `/admin/moderation` to approve or reject pending uploads.

## Routes
| Route | Purpose |
|---|---|
| `/` | Live clock + greeting, shuffling study memes, school selector, latest news |
| `/set` | Department list |
| `/set/[department]` | Level picker (100–500) |
| `/set/[department]/[level]` | Courses at that level |
| `/set/[department]/[level]/[course]` | Materials for a course (title-block header) |
| `/siwes` → `/siwes/[department]` | SIWES logbooks/reports, department-wide |
| `/projects` → `/projects/[department]` | Project reports/defense slides, department-wide |
| `/calendar` | Public academic calendar |
| `/news` | Public news feed |
| `/search?q=` | Course code / title search |
| `/upload` | Auth-gated upload form (goes to moderation queue) |
| `/admin` | Redirects to the admin panel |
| `/admin/courses` | **Add/edit/delete courses** — the main content-management form |
| `/admin/moderation` | Approve/reject pending uploads |
| `/admin/news` | Push/edit/unpublish news posts |
| `/admin/calendar` | Add/edit/delete academic calendar events |

## Becoming an admin
All `/admin/*` pages are gated by `AdminGate` (`src/components/AdminGate.tsx`), which
checks you're signed in **and** your `profiles.role = 'admin'`. First sign in once
anywhere on the site (so your profile row exists), then in the Supabase SQL editor:

```sql
update profiles set role = 'admin' where id = '<your-auth-uid>';
```

Find your uid under Authentication → Users in the Supabase dashboard. Once set,
`/admin/courses` is where you'll spend the most time — add a department + level,
then punch in course codes/titles. Everything else (news, calendar) works the
same add/edit/delete pattern.

## Next steps for later schools
Add a row to `schools`, seed its departments, and duplicate the `/set` route
segment (e.g. `/seet`) — the components are already generic.
