"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Newspaper, FileCheck2, Download, BookOpen, Star } from "lucide-react";
import AdminGate from "@/components/AdminGate";
import { supabase } from "@/lib/supabase";
import type { Material } from "@/lib/types";

type Stats = {
  pending: number;
  totalMaterials: number;
  totalCourses: number;
  totalDownloads: number;
};

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<Material[]>([]);
  const [recentApproved, setRecentApproved] = useState<Material[]>([]);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  async function loadAll() {
    const [{ count: pendingCount }, { count: materialsCount }, { count: coursesCount }, { data: downloadsData }, { data: pendingData }, { data: approvedData }] =
      await Promise.all([
        supabase.from("materials").select("id", { count: "exact", head: true }).eq("approved", false),
        supabase.from("materials").select("id", { count: "exact", head: true }).eq("approved", true),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("materials").select("download_count").eq("approved", true),
        supabase
          .from("materials")
          .select("*")
          .eq("approved", false)
          .order("created_at", { ascending: true })
          .limit(6),
        supabase
          .from("materials")
          .select("*")
          .eq("approved", true)
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

    setStats({
      pending: pendingCount ?? 0,
      totalMaterials: materialsCount ?? 0,
      totalCourses: coursesCount ?? 0,
      totalDownloads: (downloadsData ?? []).reduce((sum, m) => sum + (m.download_count ?? 0), 0),
    });
    setPending((pendingData as Material[]) ?? []);
    setRecentApproved((approvedData as Material[]) ?? []);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function approve(id: string) {
    await supabase.from("materials").update({ approved: true }).eq("id", id);
    setPending((p) => p.filter((m) => m.id !== id));
    setStats((s) => (s ? { ...s, pending: s.pending - 1, totalMaterials: s.totalMaterials + 1 } : s));
  }

  async function reject(id: string, filePath: string) {
    await supabase.storage.from("materials").remove([filePath]);
    await supabase.from("materials").delete().eq("id", id);
    setPending((p) => p.filter((m) => m.id !== id));
    setStats((s) => (s ? { ...s, pending: s.pending - 1 } : s));
  }

  async function toggleRecommended(id: string, current: boolean) {
    await supabase.from("materials").update({ recommended: !current }).eq("id", id);
    setRecentApproved((list) => list.map((m) => (m.id === id ? { ...m, recommended: !current } : m)));
  }

  async function pushNews(e: React.FormEvent) {
    e.preventDefault();
    if (!newsTitle.trim() || !newsBody.trim()) return;
    setPosting(true);
    const { data: sessionData } = await supabase.auth.getSession();
    await supabase.from("news").insert({
      title: newsTitle.trim(),
      body: newsBody.trim(),
      posted_by: sessionData.session?.user.id,
    });
    setPosting(false);
    setPosted(true);
    setNewsTitle("");
    setNewsBody("");
    setTimeout(() => setPosted(false), 2500);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper mb-1">Control room</h1>
      <p className="text-paper/50 text-sm mb-6">Everything that needs your attention, in one place.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard icon={<FileCheck2 size={16} />} label="Pending review" value={stats?.pending} urgent={!!stats?.pending} />
        <StatCard icon={<BookOpen size={16} />} label="Live materials" value={stats?.totalMaterials} />
        <StatCard icon={<BookOpen size={16} />} label="Courses" value={stats?.totalCourses} />
        <StatCard icon={<Download size={16} />} label="Total downloads" value={stats?.totalDownloads} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick news push */}
        <div>
          <h2 className="font-display text-lg font-semibold text-paper mb-1 flex items-center gap-2">
            <Newspaper size={18} className="text-tape" /> Push news
          </h2>
          <p className="text-paper/50 text-sm mb-4">Goes live on the homepage the second you hit publish.</p>
          <form onSubmit={pushNews} className="space-y-3 max-w-md">
            <input
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
              placeholder="Headline"
              className="input"
              required
            />
            <textarea
              value={newsBody}
              onChange={(e) => setNewsBody(e.target.value)}
              placeholder="What's happening…"
              rows={4}
              className="input"
              required
            />
            <button
              disabled={posting}
              className="bg-tape text-blueprint font-semibold px-5 py-2.5 rounded-sm hover:opacity-90 disabled:opacity-50"
            >
              {posting ? "Publishing…" : "Publish now"}
            </button>
            {posted && <span className="text-approved text-sm ml-3">Live ✓</span>}
          </form>
          <Link href="/admin/news" className="text-tape text-xs mt-3 inline-block hover:underline">
            Manage all posts →
          </Link>
        </div>

        {/* Pending moderation feed */}
        <div>
          <h2 className="font-display text-lg font-semibold text-paper mb-1 flex items-center gap-2">
            <FileCheck2 size={18} className="text-tape" /> Needs review
          </h2>
          <p className="text-paper/50 text-sm mb-4">
            {stats?.pending ? `${stats.pending} waiting` : "Nothing waiting"} — preview before you approve.
          </p>
          <div className="space-y-2">
            {pending.map((m) => {
              const { data } = supabase.storage.from("materials").getPublicUrl(m.file_path);
              return (
                <div key={m.id} className="bg-paper text-ink rounded-sm px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase text-blueprint/60">{m.type}</div>
                      <div className="font-medium truncate">{m.title}</div>
                      <div className="text-xs text-ink/40">
                        {m.session ?? "—"} {m.semester ? `· ${m.semester} semester` : ""} · {m.file_size_kb ? `${Math.round(m.file_size_kb / 1024)} MB` : ""}
                      </div>
                    </div>
                    <a
                      href={data.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1 text-xs font-medium text-blueprint"
                    >
                      Preview <ExternalLink size={12} />
                    </a>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => approve(m.id)} className="bg-approved text-paper text-xs px-3 py-1.5 rounded-sm">
                      Approve
                    </button>
                    <button onClick={() => reject(m.id, m.file_path)} className="bg-pending text-paper text-xs px-3 py-1.5 rounded-sm">
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
            {!pending.length && <p className="text-paper/40 text-sm">Queue is empty — nice.</p>}
          </div>
          {(stats?.pending ?? 0) > pending.length && (
            <Link href="/admin/moderation" className="text-tape text-xs mt-3 inline-block hover:underline">
              See all {stats?.pending} pending →
            </Link>
          )}
        </div>
      </div>

      {/* Recommend from recently approved */}
      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-paper mb-1 flex items-center gap-2">
          <Star size={18} className="text-tape" /> Mark as lecturer recommended
        </h2>
        <p className="text-paper/50 text-sm mb-4">Starred materials show up in the homepage's recommended row.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {recentApproved.map((m) => (
            <button
              key={m.id}
              onClick={() => toggleRecommended(m.id, m.recommended)}
              className={`text-left rounded-sm px-4 py-3 border transition-colors ${
                m.recommended ? "bg-tape/20 border-tape" : "bg-paper text-ink border-transparent"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className={`font-medium text-sm truncate ${m.recommended ? "text-paper" : ""}`}>{m.title}</div>
                <Star size={14} className={m.recommended ? "fill-tape text-tape" : "text-ink/30"} />
              </div>
            </button>
          ))}
          {!recentApproved.length && <p className="text-paper/40 text-sm">Nothing approved yet.</p>}
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          background: rgba(39, 75, 122, 0.4);
          border: 1px solid #1b3a6b;
          border-radius: 2px;
          padding: 0.5rem 0.75rem;
          color: #f5f3ee;
        }
      `}</style>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  urgent,
}: {
  icon: React.ReactNode;
  label: string;
  value?: number;
  urgent?: boolean;
}) {
  return (
    <div className={`rounded-sm px-4 py-3 border ${urgent ? "border-tape bg-tape/10" : "border-blueprint-line bg-blueprint-light/20"}`}>
      <div className={`flex items-center gap-1.5 text-xs ${urgent ? "text-tape" : "text-paper/50"}`}>
        {icon} {label}
      </div>
      <div className="font-display text-2xl font-semibold text-paper mt-1">
        {value ?? "—"}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGate>
      <Dashboard />
    </AdminGate>
  );
}
