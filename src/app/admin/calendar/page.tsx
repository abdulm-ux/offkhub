"use client";

import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import { supabase } from "@/lib/supabase";
import type { CalendarEvent, CalendarCategory } from "@/lib/types";

const CATEGORIES: CalendarCategory[] = ["academic", "exam", "registration", "holiday", "other"];

function CalendarForm() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CalendarCategory>("academic");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving">("idle");

  async function load() {
    const { data } = await supabase
      .from("calendar_events")
      .select("id, title, description, category, start_date, end_date")
      .order("start_date");
    setEvents(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("academic");
    setStartDate("");
    setEndDate("");
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startDate) return;
    setStatus("saving");
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      category,
      start_date: startDate,
      end_date: endDate || null,
    };

    if (editingId) {
      await supabase.from("calendar_events").update(payload).eq("id", editingId);
    } else {
      await supabase.from("calendar_events").insert(payload);
    }
    setStatus("idle");
    resetForm();
    load();
  }

  function startEdit(ev: CalendarEvent) {
    setEditingId(ev.id);
    setTitle(ev.title);
    setDescription(ev.description ?? "");
    setCategory(ev.category);
    setStartDate(ev.start_date);
    setEndDate(ev.end_date ?? "");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this calendar event?")) return;
    await supabase.from("calendar_events").delete().eq("id", id);
    load();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-paper mb-1">
          {editingId ? "Edit event" : "Add calendar event"}
        </h1>
        <p className="text-paper/50 text-sm mb-6">Registration deadlines, exam periods, resumption dates, etc.</p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <Field label="Title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" required />
          </Field>
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value as CalendarCategory)} className="input">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <div className="flex gap-3">
            <Field label="Start date">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" required />
            </Field>
            <Field label="End date (optional)">
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input" />
          </Field>
          <div className="flex gap-2">
            <button
              disabled={status === "saving"}
              className="bg-tape text-blueprint font-medium px-5 py-2.5 rounded-sm hover:opacity-90 disabled:opacity-50"
            >
              {editingId ? "Save changes" : "Add event"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-paper/60 text-sm px-3">Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-paper mb-4">Upcoming</h2>
        <div className="space-y-2">
          {events.map((ev) => (
            <div key={ev.id} className="bg-paper text-ink rounded-sm px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{ev.title}</div>
                <span className="text-[10px] uppercase text-blueprint/70 font-mono">{ev.category}</span>
              </div>
              <div className="font-mono text-xs text-ink/50 mt-1">
                {ev.start_date}{ev.end_date ? ` → ${ev.end_date}` : ""}
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => startEdit(ev)} className="text-xs font-medium text-blueprint">Edit</button>
                <button onClick={() => handleDelete(ev.id)} className="text-xs font-medium text-pending">Delete</button>
              </div>
            </div>
          ))}
          {!events.length && <p className="text-paper/40 text-sm">No events yet.</p>}
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
    <label className="block flex-1">
      <span className="block text-xs uppercase tracking-wide text-paper/50 mb-1">{label}</span>
      {children}
    </label>
  );
}

export default function AdminCalendarPage() {
  return (
    <AdminGate>
      <CalendarForm />
    </AdminGate>
  );
}
