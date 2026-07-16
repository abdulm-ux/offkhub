import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

export default async function DepartmentPage({
  params,
}: {
  params: { school: string; department: string };
}) {
  const { data: dept } = await supabase
    .from("departments")
    .select("id, name, slug")
    .eq("slug", params.department)
    .single();

  const levels = [100, 200, 300, 400, 500];

  return (
    <div>
      <div className="font-mono text-xs text-tape uppercase tracking-widest mb-2">
        {params.school.toUpperCase()} / {dept?.name ?? params.department}
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-8">Choose a level</h1>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {levels.map((lvl) => (
          <Link
            key={lvl}
            href={`/${params.school}/${params.department}/${lvl}`}
            className="crop-marks bg-paper text-ink rounded-sm p-6 text-center hover:-translate-y-0.5 transition-transform"
          >
            <div className="font-mono text-2xl font-semibold">{lvl}</div>
            <div className="text-xs text-ink/50 mt-1">Level</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
