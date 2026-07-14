"use client";

import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import { supabase } from "@/lib/supabase";
import type { NewsPost } from "@/lib/types";

function NewsForm() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving">("idle");

  async function load() {
    const { data } = await supabase
      .from("news")
      .select("id, title, body, published, created_at")
      .order("created_at", { ascending: false });
    setPosts(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setTitle("");
    setBody("");
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setStatus("saving");
    const payload = { title: title.trim(), body: body.trim() };

    if (editingId) {
      await supabase.from("news").update(payload).eq("id", editingId);
    } else {
      const { data: sessionData } = await supabase.auth.getSession();
      await supabase.from("news").insert({ ...payload, posted_by: sessionData.session?.user.id });
    }
    setStatus("idle");
    resetForm();
    load();
  }

  function startEdit(p: NewsPost) {
    setEditingId(p.id);
    setTitle(p.title);
    setBody(p.body);
  }

  async function togglePublished(p: NewsPost) {
    await supabase.from("news").update({ published: !p.published }).eq("id", p.id);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this news post?")) return;
    await supabase.from("news").delete().eq("id", id);
    load();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-paper mb-1">
          {editingId ? "Edit post" : "Push news"}
        </h1>
        <p className="text-paper/50 text-sm mb-6">Goes live on the homepage and /news immediately.</p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <Field label="Headline">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" required />
          </Field>
          <Field label="Details">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="input" required />
          </Field>
          <div className="flex gap-2">
            <button
              disabled={status === "saving"}
              className="bg-tape text-blueprint font-medium px-5 py-2.5 rounded-sm hover:opacity-90 disabled:opacity-50"
            >
              {editingId ? "Save changes" : "Publish"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-paper/60 text-sm px-3">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-paper mb-4">All posts</h2>
        <div className="space-y-2">
          {posts.map((p) => (
            <div key={p.id} className="bg-paper text-ink rounded-sm px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium">{p.title}</div>
                <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded-sm shrink-0 ${p.published ? "bg-approved text-paper" : "bg-blueprint-line text-paper"}`}>
                  {p.published ? "live" : "draft"}
                </span>
              </div>
              <p className="text-sm text-ink/70 mt-1 line-clamp-2">{p.body}</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => startEdit(p)} className="text-xs font-medium text-blueprint">Edit</button>
                <button onClick={() => togglePublished(p)} className="text-xs font-medium text-blueprint">
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-xs font-medium text-pending">Delete</button>
              </div>
            </div>
          ))}
          {!posts.length && <p className="text-paper/40 text-sm">No news posted yet.</p>}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-paper/50 mb-1">{label}</span>
      {children}
    </label>
  );
}

export default function AdminNewsPage() {
  return (
    <AdminGate>
      <NewsForm />
    </AdminGate>
  );
}
