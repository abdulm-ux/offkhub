import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SearchBar from "@/components/SearchBar";

export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() ?? "";

  const { data: results } = q
    ? await supabase
        .from("courses")
        .select("id, code, title, level, departments(slug, name)")
        .or(`code.ilike.%${q}%,title.ilike.%${q}%`)
        .limit(30)
    : { data: [] };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper mb-4">Search</h1>
      <div className="max-w-md mb-8">
        <SearchBar />
      </div>

      {q && (
        <p className="text-paper/50 text-sm mb-4 font-mono">
          {results?.length ?? 0} result{results?.length === 1 ? "" : "s"} for "{q}"
        </p>
      )}

      <div className="space-y-2">
        {results?.map((c: any) => (
          <Link
            key={c.id}
            href={`/set/${c.departments.slug}/${c.level}/${c.code.replace(/\s+/g, "-").toLowerCase()}`}
            className="flex items-center justify-between bg-paper text-ink rounded-sm px-4 py-3 hover:bg-paper/90 transition-colors"
          >
            <div>
              <div className="font-mono text-xs text-blueprint/70">{c.code}</div>
              <div className="font-medium">{c.title}</div>
            </div>
            <div className="text-xs text-ink/50">{c.departments.name} · {c.level}L</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
