"use client";

import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import { supabase } from "@/lib/supabase";

type School = { id: string; name: string };
type DeptRow = { id: string; name: string; slug: string; school_id: string };

function slugify(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function DepartmentsForm() {
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolId, setSchoolId] = useState("");
  const [name, setName] = useState("");
  const [depts, setDepts] = useState<DeptRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  useEffect(() => {
    supabase.from("schools").select("id, name").order("name").then(({ data }) => {
      setSchools(data ?? []);
      if (data?.length) setSchoolId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (schoolId) loadDepts();
  }, [schoolId]);

  async function loadDepts() {
    const { data } = await supabase
      .from("departments")
      .select("id, name, slug, school_id")
      .eq("school_id", schoolId)
      .order("name");
    setDepts(data ?? []);
  }

  function resetForm() {
    setName("");
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setStatus("saving");
    const payload = { school_id: schoolId, name: name.trim(), slug: slugify(name) };

    const { error } = editingId
      ? await supabase.from("departments").update(payload).eq("id", editingId)
      : await supabase.from("departments").insert(payload);

    if (error) {
      setStatus("error");
      return;
    }
    setStatus("idle");
    resetForm();
    loadDepts();
  }

  function startEdit(d: DeptRow) {
    setEditingId(d.id);
    setName(d.name);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this department? Its courses and materials go with it.")) return;
    await supabase.from("departments").delete().eq("id", id);
    loadDepts();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-paper mb-1">
          {editingId ? "Edit department" : "Add a department"}
        </h1>
        <p className="text-paper/50 text-sm mb-6">
          Use this if a school's department list is missing something or has changed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
          <Field label="School">
            <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="input">
              {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Department name">
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" required />
          </Field>
          <div className="flex gap-2">
            <button
              disabled={status === "saving"}
              className="bg-tape text-blueprint font-medium px-5 py-2.5 rounded-sm hover:opacity-90 disabled:opacity-50"
            >
              {editingId ? "Save changes" : "Add department"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-paper/60 text-sm px-3">Cancel</button>
            )}
          </div>
          {status === "error" && (
            <p className="text-pending text-sm">Couldn't save — that name may already exist for this school.</p>
          )}
        </form>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-paper mb-1">
          {schools.find((s) => s.id === schoolId)?.name}
        </h2>
        <p className="text-paper/50 text-sm mb-4">{depts.length} department{depts.length === 1 ? "" : "s"}</p>

        <div className="space-y-2">
          {depts.map((d) => (
            <div key={d.id} className="flex items-center justify-between bg-paper text-ink rounded-sm px-4 py-3">
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="font-mono text-[11px] text-ink/40">/{d.slug}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(d)} className="text-xs font-medium text-blueprint px-2 py-1">Edit</button>
                <button onClick={() => handleDelete(d.id)} className="text-xs font-medium text-pending px-2 py-1">Delete</button>
              </div>
            </div>
          ))}
          {!depts.length && <p className="text-paper/40 text-sm">No departments yet for this school.</p>}
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

export default function AdminDepartmentsPage() {
  return (
    <AdminGate>
      <DepartmentsForm />
    </AdminGate>
  );
}
