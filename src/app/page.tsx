import Link from "next/link";
import { supabase } from "@/lib/supabase";
import LiveClock from "@/components/LiveClock";
import MemeBanner from "@/components/MemeBanner";
import type { NewsPost } from "@/lib/types";

export const revalidate = 60;

const SCHOOLS = [
  { name: "School of Environmental Technology", slug: "set", live: true },
  { name: "School of Engineering & Engineering Technology", slug: "seet", live: false },
  { name: "School of Physical Sciences", slug: "sps", live: false },
  { name: "School of Life Sciences", slug: "sls", live: false },
  { name: "School of Information & Communication Technology", slug: "sict", live: false },
  { name: "School of Agriculture & Agricultural Technology", slug: "saat", live: false },
];

export default async function Home() {
  const { data: latestNews } = (await supabase
    .from("news")
    .select("id, title, body, published, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3)) as { data: NewsPost[] | null };

  return (
    <div>
      <LiveClock />
      <div className="font-mono text-xs text-tape uppercase tracking-widest mb-2 mt-4">
        offkhub · Federal University of Technology, Minna
      </div>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-paper max-w-xl mb-2">
        Course materials and past questions, organized like a proper drawing set.
      </h1>
      <p className="text-paper/40 text-sm mb-6">
        Everything you'd normally have to go off campus to sort out — sorted here instead.
      </p>

      <div className="mb-10">
        <MemeBanner />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        {SCHOOLS.map((s) =>
          s.live ? (
            <Link key={s.slug} href={`/${s.slug}`} className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform">
              <div className="font-mono text-xs text-blueprint/70 uppercase">{s.slug}</div>
              <div className="font-display font-semibold mt-1">{s.name}</div>
            </Link>
          ) : (
            <div key={s.slug} className="border border-blueprint-line rounded-sm p-5 opacity-50">
              <div className="font-mono text-xs text-paper/50 uppercase">{s.slug}</div>
              <div className="font-display font-semibold mt-1 text-paper/70">{s.name}</div>
              <div className="text-xs text-paper/40 mt-2">Coming soon</div>
            </div>
          )
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        <Link href="/siwes" className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform">
          <div className="font-display font-semibold">SIWES Resources</div>
          <div className="text-xs text-ink/50 mt-1">Logbooks, reports, placement guides</div>
        </Link>
        <Link href="/projects" className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform">
          <div className="font-display font-semibold">Project Materials</div>
          <div className="text-xs text-ink/50 mt-1">Past project reports and defense slides</div>
        </Link>
        <Link href="/calendar" className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform">
          <div className="font-display font-semibold">Academic Calendar</div>
          <div className="text-xs text-ink/50 mt-1">Key dates for the session</div>
        </Link>
        <Link href="/news" className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform">
          <div className="font-display font-semibold">FUTMinna News</div>
          <div className="text-xs text-ink/50 mt-1">Latest updates and announcements</div>
        </Link>
      </div>

      {!!latestNews?.length && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold text-paper">Latest news</h2>
            <Link href="/news" className="text-tape text-sm">See all →</Link>
          </div>
          <div className="space-y-2">
            {latestNews.map((p) => (
              <div key={p.id} className="bg-paper text-ink rounded-sm px-4 py-3">
                <div className="font-medium">{p.title}</div>
                <p className="text-sm text-ink/60 mt-1 line-clamp-2">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
