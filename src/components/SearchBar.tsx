"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  compact = false,
  large = false,
  placeholder = "Search a course code, e.g. ARC 401",
}: {
  compact?: boolean;
  large?: boolean;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <Search
        size={large ? 20 : 16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-paper/40 pointer-events-none"
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-md border bg-blueprint-light/40 text-paper placeholder:text-paper/50 font-mono focus:outline-none focus:ring-2 focus:ring-tape ${
          large
            ? "border-blueprint-line pl-11 pr-4 py-4 text-base sm:text-lg"
            : compact
            ? "border-blueprint-line pl-8 pr-3 py-1.5 text-sm"
            : "border-blueprint-line pl-9 pr-3 py-3 text-base"
        }`}
      />
    </form>
  );
}
