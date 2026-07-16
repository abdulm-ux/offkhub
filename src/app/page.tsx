import Link from "next/link";
import { ArrowRight, Flame, Clock3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import LiveClock from "@/components/LiveClock";
import MemeBanner from "@/components/MemeBanner";
import { MATERIAL_TYPE_LABELS } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  const [{ data: schools }, { data: latestNews }, { data: trending }, { data: latest }] = await Promise.all([
    supabase.from("schools").select("id, name, slug, departments(id)").order("name"),
    supabase.from("news").select("id, title, body, created_at").eq("published", true).order("created_at", { ascending: false }).limit(3),
    supabase
      .from("materials")
      .select("id, title, type, download_count, courses(code)")
      .eq("approved", true)
      .order("download_count", { ascending: false })
      .limit(8),
    supabase
      .from("materials")
      .select("id, title, type, created_at, courses(code)")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return (
    <div>
      {/* Hero */}
      <LiveClock />
      <div className="font-mono text-xs text-tape uppercase tracking-widest mb-2 mt-4">
        offkhub · Federal University of Technology, Minna
      </div>
      <h1 className="font-display text-3xl sm:text-5xl font-semibold text-paper max-w-2xl mb-2 leading-tight">
        Course materials and past questions, organized like a proper drawing set.
      </h1>
      <p className="text-paper/40 text-sm mb-6 max-w-lg">
        Everything you'd normally have to go off campus to sort out — sorted here instead.
      </p>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/trending" className="bg-tape text-blueprint font-semibold text-sm px-5 py-2.5 rounded-sm hover:opacity-90 transition-opacity">
          Browse Trending
        </Link>
        <Link href="/upload" className="border border-blueprint-line text-paper font-medium text-sm px-5 py-2.5 rounded-sm hover:border-tape transition-colors">
          Upload a material
        </Link>
      </div>

      <div className="mb-10">
        <MemeBanner />
      </div>

      {/* Trending */}
      {!!trending?.length && (
        <Section title="Trending" icon={<Flame size={16} className="text-tape" />} href="/trending">
          <ScrollRow>
            {trending.map((m: any) => (
              <MaterialTile key={m.id} title={m.title} sub={m.courses?.code} type={m.type} meta={`↓ ${m.download_count}`} />
            ))}
          </ScrollRow>
        </Section>
      )}

      {/* Latest */}
      {!!latest?.length && (
        <Section title="Latest uploads" icon={<Clock3 size={16} className="text-tape" />} href="/latest">
          <ScrollRow>
            {latest.map((m: any) => (
              <MaterialTile
                key={m.id}
                title={m.title}
                sub={m.courses?.code}
                type={m.type}
                meta={new Date(m.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
              />
            ))}
          </ScrollRow>
        </Section>
      )}

      {/* Schools */}
      <div className="mb-10">
        <h2 className="font-display text-lg font-semibold text-paper mb-3">Schools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {schools?.map((s: any) => (
            <Link key={s.id} href={`/${s.slug}`} className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform">
              <div className="font-mono text-xs text-blueprint/70 uppercase">{s.slug}</div>
              <div className="font-display font-semibold mt-1">{s.name}</div>
              <div className="text-xs text-ink/40 mt-2">{s.departments?.length ?? 0} department{s.departments?.length === 1 ? "" : "s"}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        <Link href="/siwes" className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform">
          <div className="font-display font-semibold">SIWES Resources</div>
          <div className="text-xs text-ink/50 mt-1">Logbooks, reports, placement guides</div>
        </Link>
        <Link href="/projects" className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform">
          <div className="font-display font-semibold">Project Materials</div>
          <div className="text-xs text-ink/50 mt-1">Past project reports and defense slides</div>
        </Link>
      </div>

      {/* News */}
      {!!latestNews?.length && (
        <Section title="Latest news" href="/news">
          <div className="space-y-2">
            {latestNews.map((p) => (
              <div key={p.id} className="bg-paper text-ink rounded-sm px-4 py-3">
                <div className="font-medium">{p.title}</div>
                <p className="text-sm text-ink/60 mt-1 line-clamp-2">{p.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  href,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold text-paper flex items-center gap-2">
          {icon} {title}
        </h2>
        <Link href={href} className="text-tape text-sm flex items-center gap-1 hover:opacity-80">
          See all <ArrowRight size={14} />
        </Link>
      </div>
      {children}
    </div>
  );
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
      {children}
    </div>
  );
}

function MaterialTile({
  title,
  sub,
  type,
  meta,
}: {
  title: string;
  sub?: string;
  type: string;
  meta: string;
}) {
  return (
    <div className="crop-marks shrink-0 w-44 snap-start bg-paper text-ink rounded-sm p-3">
      <div className="font-mono text-[9px] uppercase text-tape">
        {MATERIAL_TYPE_LABELS[type as keyof typeof MATERIAL_TYPE_LABELS] ?? type}
      </div>
      <div className="font-medium text-sm mt-1 line-clamp-3">{title}</div>
      <div className="flex items-center justify-between mt-3 text-[11px] text-ink/50">
        {sub && <span className="font-mono">{sub}</span>}
        <span className="font-mono">{meta}</span>
      </div>
    </div>
  );
}
