"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type Dept = { id: string; name: string };

const DEPARTMENT_WIDE_TYPES = ["siwes", "project"];

export default function UploadPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [type, setType] = useState("lecture_note");
  const [courseCode, setCourseCode] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [title, setTitle] = useState("");
  const [sessionYear, setSessionYear] = useState("");
  const [semester, setSemester] = useState("first");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const isDeptWide = DEPARTMENT_WIDE_TYPES.includes(type);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.from("departments").select("id, name").order("name").then(({ data }) => {
      setDepartments(data ?? []);
      if (data?.length) setDepartmentId(data[0].id);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/upload" },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !session) return;
    setStatus("sending");

    let courseId: string | null = null;
    let deptId: string | null = null;

    if (isDeptWide) {
      deptId = departmentId;
    } else {
      const { data: course } = await supabase.from("courses").select("id").ilike("code", courseCode).single();
      if (!course) {
        setStatus("error");
        return;
      }
      courseId = course.id;
    }

    const path = `${courseId ?? deptId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("materials").upload(path, file);
    if (uploadError) {
      setStatus("error");
      return;
    }

    const { error: insertError } = await supabase.from("materials").insert({
      course_id: courseId,
      department_id: deptId,
      type,
      title,
      file_path: path,
      file_size_kb: Math.round(file.size / 1024),
      session: sessionYear || null,
      semester: isDeptWide ? null : semester,
      uploaded_by: session.user.id,
    });

    setStatus(insertError ? "error" : "done");
  }

  if (!session) {
    return (
      <div className="max-w-md">
        <h1 className="font-display text-2xl font-semibold text-paper mb-4">Sign in to upload</h1>
        <p className="text-paper/60 text-sm mb-6">
          Anyone can browse without an account. Signing in is only needed to contribute
          materials — uploads go to a moderation queue before they go public.
        </p>
        <button onClick={signIn} className="bg-tape text-blueprint font-medium px-5 py-2.5 rounded-sm hover:opacity-90">
          Continue with Google
        </button>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="max-w-md">
        <h1 className="font-display text-2xl font-semibold text-approved mb-2">Uploaded</h1>
        <p className="text-paper/60 text-sm">
          Thanks — it's in the review queue and will appear once an admin approves it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h1 className="font-display text-2xl font-semibold text-paper mb-2">Upload a material</h1>

      <Field label="Type">
        <select value={type} onChange={(e) => setType(e.target.value)} className="input">
          <option value="lecture_note">Lecture note</option>
          <option value="past_question">Past question</option>
          <option value="textbook">Textbook</option>
          <option value="slide">Slide</option>
          <option value="siwes">SIWES resource</option>
          <option value="project">Project material</option>
          <option value="other">Other</option>
        </select>
      </Field>

      {isDeptWide ? (
        <Field label="Department">
          <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="input">
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </Field>
      ) : (
        <Field label="Course code (e.g. ARC 401)">
          <input required value={courseCode} onChange={(e) => setCourseCode(e.target.value)} className="input" />
        </Field>
      )}

      <Field label="Title">
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
      </Field>

      <div className="flex gap-3">
        <Field label="Session (e.g. 2023/2024)">
          <input value={sessionYear} onChange={(e) => setSessionYear(e.target.value)} className="input" />
        </Field>
        {!isDeptWide && (
          <Field label="Semester">
            <select value={semester} onChange={(e) => setSemester(e.target.value)} className="input">
              <option value="first">First</option>
              <option value="second">Second</option>
            </select>
          </Field>
        )}
      </div>

      <Field label="File">
        <input
          required
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-paper/80 text-sm"
        />
      </Field>

      <button
        disabled={status === "sending"}
        className="bg-tape text-blueprint font-medium px-5 py-2.5 rounded-sm hover:opacity-90 disabled:opacity-50"
      >
        {status === "sending" ? "Uploading…" : "Submit for review"}
      </button>

      {status === "error" && (
        <p className="text-pending text-sm">
          Something went wrong — {isDeptWide ? "try again" : "check the course code exists and try again"}.
        </p>
      )}

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
    </form>
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
