import { Star, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ContributorStats } from "@/lib/types";

export const revalidate = 300;

export default async function ContributorsPage() {
  const [{ data: stats }, { data: departments }] = await Promise.all([
    supabase
      .from("contributor_stats")
      .select("*")
      .gt("uploads_count", 0)
      .order("downloads_total", { ascending: false })
      .limit(50),
    supabase.from("departments").select("id, school_id, schools(name)"),
  ]);
  const contributors = (stats as ContributorStats[] | null) ?? [];

  // Work out the top contributor within each school, so we can badge them.
  const deptToSchool = new Map<string, string>();
  (departments ?? []).forEach((d: any) => deptToSchool.set(d.id, d.schools?.name ?? ""));

  const topPerSchool = new Map<string, string>(); // school name -> contributor id
  contributors.forEach((c) => {
    const schoolName = c.department_id ? deptToSchool.get(c.department_id) : undefined;
    if (!schoolName) return;
    if (!topPerSchool.has(schoolName)) topPerSchool.set(schoolName, c.id);
  });

  const schoolByContributor = new Map<string, string>();
  topPerSchool.forEach((contributorId, schoolName) => schoolByContributor.set(contributorId, schoolName));

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-2">Top Contributors</h1>
      <p className="text-paper/50 text-sm mb-8 max-w-lg">
        Ranked by total downloads across everything they've uploaded. Verified badges are
        granted by admins for consistently good, correctly-labeled material.
      </p>

      <div className="space-y-2 max-w-2xl">
        {contributors.map((c, i) => {
          const topSchool = schoolByContributor.get(c.id);
          return (
            <div key={c.id} className="flex items-center gap-4 bg-paper text-ink rounded-sm px-4 py-3">
              <span className="font-mono text-lg text-blueprint/40 w-6 shrink-0 text-right">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{c.full_name ?? "Anonymous"}</span>
                  {c.verified && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-semibold text-tape">
                      <Star size={11} className="fill-tape" /> Verified
                    </span>
                  )}
                  {topSchool && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-semibold text-blueprint">
                      <Trophy size={11} /> Top · {topSchool}
                    </span>
                  )}
                </div>
                <div className="text-xs text-ink/40 font-mono mt-0.5">
                  {c.uploads_count} upload{c.uploads_count === 1 ? "" : "s"}
                </div>
              </div>
              <span className="font-mono text-sm text-blueprint shrink-0">↓ {c.downloads_total.toLocaleString()}</span>
            </div>
          );
        })}
        {!contributors.length && <p className="text-paper/50 text-sm">No contributors yet — be the first to upload something.</p>}
      </div>
    </div>
  );
}
