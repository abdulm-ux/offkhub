import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

export default async function ProjectsPage() {
  const { data: departments } = await supabase.from("departments").select("id, name, slug").order("name");

  return (
    <div>
      <div className="font-mono text-xs text-tape uppercase tracking-widest mb-2">SET</div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-2">Project Resources</h1>
      <p className="text-paper/50 text-sm mb-8">Final year and mini-projects, reports, and defense slides — pick your department.</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {departments?.map((d) => (
          <Link key={d.id} href={`/projects/${d.slug}`} className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform">
            <div className="font-display font-semibold">{d.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
