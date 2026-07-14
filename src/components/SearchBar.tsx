"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search a course code, e.g. ARC 401"
        className={`w-full rounded-md border border-blueprint-line bg-blueprint-light/40 text-paper placeholder:text-paper/50 font-mono text-sm px-3 focus:outline-none focus:ring-2 focus:ring-tape ${
          compact ? "py-1.5" : "py-3 text-base"
        }`}
      />
    </form>
  );
}
