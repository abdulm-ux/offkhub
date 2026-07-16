"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Dept = { id: string; name: string; slug: string; school_id: string };
type School = { id: string; name: string; slug: string };

export default function SchoolsMenu() {
  const [open, setOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [depts, setDepts] = useState<Dept[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (open && !loaded) {
      Promise.all([
        supabase.from("schools").select("id, name, slug").order("name"),
        supabase.from("departments").select("id, name, slug, school_id").order("name"),
      ]).then(([s, d]) => {
        setSchools(s.data ?? []);
        setDepts(d.data ?? []);
        setLoaded(true);
      });
    }
  }, [open, loaded]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1 text-sm font-medium text-paper/80 hover:text-tape transition-colors"
      >
        Schools <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-[min(90vw,640px)] bg-paper text-ink rounded-sm shadow-xl border border-blueprint-line/40 p-4 grid sm:grid-cols-2 gap-4 z-30 max-h-[70vh] overflow-y-auto">
          {schools.map((s) => {
            const schoolDepts = depts.filter((d) => d.school_id === s.id);
            return (
              <div key={s.id}>
                <Link href={`/${s.slug}`} className="font-display font-semibold text-sm hover:text-tape">
                  {s.name}
                </Link>
                <ul className="mt-1.5 space-y-1">
                  {schoolDepts.slice(0, 6).map((d) => (
                    <li key={d.id}>
                      <Link href={`/${s.slug}/${d.slug}`} className="text-xs text-ink/60 hover:text-blueprint">
                        {d.name}
                      </Link>
                    </li>
                  ))}
                  {!schoolDepts.length && (
                    <li className="text-xs text-ink/30 italic">No departments added yet</li>
                  )}
                </ul>
              </div>
            );
          })}
          {!loaded && <p className="text-ink/40 text-sm col-span-2">Loading…</p>}
        </div>
      )}
    </div>
  );
}
