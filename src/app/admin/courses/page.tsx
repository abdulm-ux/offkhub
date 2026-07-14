"use client";

import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import { supabase } from "@/lib/supabase";

type Dept = { id: string; name: string; slug: string };
type CourseRow = { id: string; code: string; title: string; level: number; department_id: string };

const LEVELS = [100, 200, 300, 400, 500];

function CoursesForm() {
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [level, setLevel] = useState(100);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  useEffect(() => {
    supabase
      .from("departments")
      .select("id, name, slug")
      .order("name")
      .then(({ data }) => {
        setDepartments(data ?? []);
        if (data?.length) setDepartmentId(data[0].id);
      });
  }, []);

  useEffect(() => {
    if (!departmentId) return;
    loadCourses();
  }, [departmentId, level]);

  async function loadCourses() {
    const { data } = await supabase
      .from("courses")
      .select("id, code, title, level, department_id")
      .eq("department_id", departmentId)
      .eq("level", level)
      .order("code");
    setCourses(data ?? []);
  }

  function resetForm() {
    setCode("");
    setTitle("");
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;
    setStatus("saving");

    const payload = { department_id: departmentId, level, code: code.trim().toUpperCase(), title: title.trim() };

    const { error } = editingId
      ? await supabase.from("courses").update(payload).eq("id", editingId)
      : await supabase.from("courses").insert(payload);

    if (error) {
      setStatus("error");
      return;
    }
    setStatus("idle");
    resetForm();
    loadCourses();
  }

  function startEdit(c: CourseRow) {
    setEditingId(c.id);
    setCode(c.code);
    setTitle(c.title);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this course? Any materials attached to it will also be removed.")) return;
    await supabase.from("courses").delete().eq("id", id);
    loadCourses();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-paper mb-1">
          {editingId ? "Edit course" : "Add a course"}
        </h1>
        <p className="text-paper/50 text-sm mb-6">
          Courses are scoped to a department and level — pick both first.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
          <Field label="Department">
            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="input">
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Level">
            <select value={level} onChange={(e) => setLevel(Number(e.target.value))} className="input">
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}L</option>
              ))}
            </select>
          </Field>

          <Field label="Course code (e.g. ARC 401)">
            <input value={code} onChange={(e) => setCode(e.target.value)} className="input" required />
          </Field>

          <Field label="Course title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" required />
          </Field>

          <div className="flex gap-2">
            <button
              disabled={status === "saving"}
              className="bg-tape text-blueprint font-medium px-5 py-2.5 rounded-sm hover:opacity-90 disabled:opacity-50"
            >
              {editingId ? "Save changes" : "Add course"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-paper/60 text-sm px-3">
                Cancel
              </button>
            )}
          </div>
          {status === "error" && (
            <p className="text-pending text-sm">
              Couldn't save — that course code may already exist for this department/level.
            </p>
          )}
        </form>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-paper mb-1">
          {departments.find((d) => d.id === departmentId)?.name} · {level}L
        </h2>
        <p className="text-paper/50 text-sm mb-4">{courses.length} course{courses.length === 1 ? "" : "s"}</p>

        <div className="space-y-2">
          {courses.map((c) => (
            <div key={c.id} className="flex items-center justify-between bg-paper text-ink rounded-sm px-4 py-3">
              <div>
                <div className="font-mono text-xs text-blueprint/70">{c.code}</div>
                <div className="font-medium">{c.title}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(c)} className="text-xs font-medium text-blueprint px-2 py-1">
                  Edit
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-xs font-medium text-pending px-2 py-1">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!courses.length && <p className="text-paper/40 text-sm">No courses yet at this level.</p>}
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

export default function AdminCoursesPage() {
  return (
    <AdminGate>
      <CoursesForm />
    </AdminGate>
  );
}
