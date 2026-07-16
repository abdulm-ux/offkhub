import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { MATERIAL_TYPE_LABELS } from "@/lib/types";

export const revalidate = 120;

export default async function LatestPage() {
  const { data: materials } = await supabase
    .from("materials")
    .select("id, title, type, download_count, created_at, course_id, department_id, courses(code, departments(slug, schools(slug))), departments(name, slug, schools(slug))")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(40);

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-2">🆕 Latest</h1>
      <p className="text-paper/50 text-sm mb-8">Freshest uploads across every school.</p>

      <div className="space-y-2 max-w-2xl">
        {materials?.map((m: any, i) => {
          const school = m.courses?.departments?.schools?.slug ?? m.departments?.schools?.slug;
          const dept = m.courses?.departments?.slug ?? m.departments?.slug;
          const href = `/${school}/${dept}`;
          return (
            <Link key={m.id} href={href} className="flex items-center gap-4 bg-paper text-ink rounded-sm px-4 py-3 hover:bg-paper/90 transition-colors">
              <span className="font-mono text-[10px] text-blueprint/50 w-14 shrink-0">
                {new Date(m.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10px] uppercase text-tape">{MATERIAL_TYPE_LABELS[m.type as keyof typeof MATERIAL_TYPE_LABELS]}</div>
                <div className="font-medium truncate">{m.title}</div>
                {m.courses?.code && <div className="text-xs text-ink/40 font-mono">{m.courses.code}</div>}
              </div>
              <span className="font-mono text-xs text-blueprint shrink-0">↓ {m.download_count}</span>
            </Link>
          );
        })}
        {!materials?.length && <p className="text-paper/50 text-sm">Nothing approved yet — check back soon.</p>}
      </div>
    </div>
  );
}
