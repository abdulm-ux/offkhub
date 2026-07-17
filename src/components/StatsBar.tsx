import { supabase } from "@/lib/supabase";
import { BookMarked, Download, Layers } from "lucide-react";

export default async function StatsBar() {
  const [{ count: materialsCount }, { data: downloadsData }, { count: coursesCount }] = await Promise.all([
    supabase.from("materials").select("id", { count: "exact", head: true }).eq("approved", true),
    supabase.from("materials").select("download_count").eq("approved", true),
    supabase.from("courses").select("id", { count: "exact", head: true }),
  ]);

  const totalDownloads = (downloadsData ?? []).reduce((sum, m) => sum + (m.download_count ?? 0), 0);

  const stats = [
    { icon: <BookMarked size={16} />, label: "Materials", value: materialsCount ?? 0 },
    { icon: <Layers size={16} />, label: "Courses covered", value: coursesCount ?? 0 },
    { icon: <Download size={16} />, label: "Downloads", value: totalDownloads },
  ];

  return (
    <div className="flex flex-wrap gap-4 sm:gap-6 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-2 text-paper/70">
          <span className="text-tape">{s.icon}</span>
          <span className="font-display font-semibold text-paper">{s.value.toLocaleString()}+</span>
          <span className="text-xs text-paper/50">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
