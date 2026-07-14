import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Department } from "@/lib/types";

export const revalidate = 3600;

export default async function SetPage() {
  const { data: school } = await supabase.from("schools").select("id").eq("slug", "set").single();

  const { data: departments } = await supabase
    .from("departments")
    .select("id, name, slug")
    .eq("school_id", school?.id)
    .order("name") as { data: Department[] | null };

  return (
    <div>
      <div className="font-mono text-xs text-tape uppercase tracking-widest mb-2">
        School of Environmental Technology
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-8">
        Choose a department
      </h1>

      <div className="grid sm:grid-cols-2 gap-3">
        {departments?.map((d) => (
          <Link
            key={d.id}
            href={`/set/${d.slug}`}
            className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform"
          >
            <div className="font-display font-semibold">{d.name}</div>
          </Link>
        ))}
        {!departments?.length && (
          <p className="text-paper/50 text-sm">
            No departments seeded yet — run <code className="font-mono">supabase/schema.sql</code>.
          </p>
        )}
      </div>
    </div>
  );
}
