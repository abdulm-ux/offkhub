import { supabase } from "@/lib/supabase";
import { BookMarked, Download, Layers } from "lucide-react";

export default async function StatsBar() {
  const [{ count: materialsCount }, { data: downloadsData }, { count: coursesCount }, { count: studentsCount }] = await Promise.all([
    supabase.from("materials").select("id", { count: "exact", head: true }).eq("approved", true),
    supabase.from("materials").select("download_count").eq("approved", true),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const totalDownloads = (downloadsData ?? []).reduce((sum, m) => sum + (m.download_count ?? 0), 0);

  const stats = [
    { icon: "📚", label: "Materials", value: materialsCount ?? 0 },
    { icon: "👨‍🎓", label: "Students", value: studentsCount ?? 0 },
    { icon: "📥", label: "Downloads", value: totalDownloads },
  ];

  return (
    <div className="bg-tape/10 border-l-2 border-tape p-4 mb-8 flex items-center justify-between">
      <div className="flex gap-4 sm:gap-12">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="text-lg">{s.icon}</span>
            <div>
              <div className="font-display font-bold text-paper text-sm leading-none">{s.value.toLocaleString()}+</div>
              <div className="text-[10px] text-paper/40 uppercase tracking-tighter mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden lg:block text-[10px] text-tape font-mono uppercase tracking-widest">
        Real-time FUTMinna Archive
      </div>
    </div>
  );
}
