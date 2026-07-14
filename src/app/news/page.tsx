import { supabase } from "@/lib/supabase";
import type { NewsPost } from "@/lib/types";

export const revalidate = 60;

export default async function NewsPage() {
  const { data: posts } = (await supabase
    .from("news")
    .select("id, title, body, published, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })) as { data: NewsPost[] | null };

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-8">FUTMinna News</h1>
      <div className="space-y-4 max-w-2xl">
        {posts?.map((p) => (
          <article key={p.id} className="bg-paper text-ink rounded-sm p-5">
            <div className="font-mono text-[11px] text-blueprint/60 mb-1">
              {new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            <h2 className="font-display font-semibold text-lg mb-2">{p.title}</h2>
            <p className="text-sm text-ink/80 whitespace-pre-wrap">{p.body}</p>
          </article>
        ))}
        {!posts?.length && <p className="text-paper/50 text-sm">No news posted yet.</p>}
      </div>
    </div>
  );
}
