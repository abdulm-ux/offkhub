"use client";

import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import { supabase } from "@/lib/supabase";
import type { Material } from "@/lib/types";

function Queue() {
  const [pending, setPending] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = (await supabase
      .from("materials")
      .select("*")
      .eq("approved", false)
      .order("created_at", { ascending: true })) as { data: Material[] | null };
    setPending(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    await supabase.from("materials").update({ approved: true }).eq("id", id);
    setPending((p) => p.filter((m) => m.id !== id));
  }

  async function reject(id: string, filePath: string) {
    await supabase.storage.from("materials").remove([filePath]);
    await supabase.from("materials").delete().eq("id", id);
    setPending((p) => p.filter((m) => m.id !== id));
  }

  if (loading) return <p className="text-paper/50 text-sm">Loading queue…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper mb-1">Moderation queue</h1>
      <p className="text-paper/50 text-sm mb-6">{pending.length} pending upload{pending.length === 1 ? "" : "s"}</p>

      <div className="space-y-2">
        {pending.map((m) => (
          <div key={m.id} className="flex items-center justify-between bg-paper text-ink rounded-sm px-4 py-3">
            <div>
              <div className="font-mono text-[11px] text-blueprint/70 uppercase">{m.type}</div>
              <div className="font-medium">{m.title}</div>
              <div className="text-xs text-ink/40">{m.session} · {m.semester} semester</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => approve(m.id)} className="bg-approved text-paper text-sm px-3 py-1.5 rounded-sm">
                Approve
              </button>
              <button onClick={() => reject(m.id, m.file_path)} className="bg-pending text-paper text-sm px-3 py-1.5 rounded-sm">
                Reject
              </button>
            </div>
          </div>
        ))}
        {!pending.length && <p className="text-paper/50 text-sm">Queue is empty.</p>}
      </div>
    </div>
  );
}

export default function ModerationPage() {
  return (
    <AdminGate>
      <Queue />
    </AdminGate>
  );
}
