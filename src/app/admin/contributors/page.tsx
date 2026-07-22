"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import AdminGate from "@/components/AdminGate";
import { supabase } from "@/lib/supabase";
import type { ContributorStats } from "@/lib/types";

function ContributorsAdmin() {
  const [stats, setStats] = useState<ContributorStats[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("contributor_stats")
      .select("*")
      .gt("uploads_count", 0)
      .order("downloads_total", { ascending: false });
    setStats((data as ContributorStats[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleVerified(id: string, current: boolean) {
    await supabase.from("profiles").update({ verified: !current }).eq("id", id);
    setStats((list) => list.map((c) => (c.id === id ? { ...c, verified: !current } : c)));
  }

  if (loading) return <p className="text-paper/50 text-sm">Loading contributors…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper mb-1">Contributors</h1>
      <p className="text-paper/50 text-sm mb-6">
        Grant verified status to consistently good, correctly-labeled uploaders.
      </p>

      <div className="space-y-2 max-w-2xl">
        {stats.map((c) => (
          <div key={c.id} className="flex items-center justify-between bg-paper text-ink rounded-sm px-4 py-3">
            <div>
              <div className="font-medium">{c.full_name ?? "Anonymous"}</div>
              <div className="text-xs text-ink/40 font-mono">
                {c.uploads_count} upload{c.uploads_count === 1 ? "" : "s"} · ↓ {c.downloads_total.toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => toggleVerified(c.id, c.verified)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-sm shrink-0 ${
                c.verified ? "bg-tape text-blueprint" : "bg-blueprint-line text-paper"
              }`}
            >
              <Star size={13} className={c.verified ? "fill-blueprint" : ""} />
              {c.verified ? "Verified" : "Verify"}
            </button>
          </div>
        ))}
        {!stats.length && <p className="text-paper/40 text-sm">No contributors yet.</p>}
      </div>
    </div>
  );
}

export default function AdminContributorsPage() {
  return (
    <AdminGate>
      <ContributorsAdmin />
    </AdminGate>
  );
}
