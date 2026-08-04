import Link from "next/link";
import { ArrowRight, Flame, Clock3, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import LiveClock from "@/components/LiveClock";
import MemeBanner from "@/components/MemeBanner";
import HeroIllustration from "@/components/HeroIllustration";
import StatsBar from "@/components/StatsBar";
import SearchBar from "@/components/SearchBar";
import AdBoard from "@/components/AdBoard";
import JobBoard from "@/components/JobBoard";
import { schoolIcon } from "@/lib/schoolIcons";
import { MATERIAL_TYPE_LABELS } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  const [{ data: schools }, { data: latestNews }, { data: trending }, { data: latest }, { data: recommended }] = await Promise.all([
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
    supabase
      .from("materials")
      .select("id, title, type, courses(code)")
      .eq("approved", true)
      .eq("recommended", true)
      .limit(8),
  ]);

  return (
    <div>
      {/* Hero */}
      <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
        <div>
          <LiveClock />
          <div className="font-mono text-xs text-tape uppercase tracking-widest mb-2 mt-4">
            offkhub · Federal University of Technology, Minna
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-paper mb-3 leading-tight">
            Everything FUTMinna students need—course materials, past questions,
            SIWES resources, and project materials—in one place.
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 mb-2">
            <Link
              href="/trending"
              className="w-full sm:w-auto text-center bg-tape text-blueprint font-semibold text-sm px-5 py-2.5 rounded-sm hover:opacity-90 transition-opacity"
            >
              Browse Trending
            </Link>
            <Link
              href="/upload"
              className="w-full sm:w-auto text-center border border-blueprint-line text-paper font-medium text-sm px-5 py-2.5 rounded-sm hover:border-tape transition-colors"
            >
              Upload a material
            </Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <HeroIllustration />
        </div>
      </div>

      {/* Prominent search */}
      <div className="mb-6">
        <SearchBar large placeholder="Search course code, department, or material…" />
      </div>

      <StatsBar />

      <div className="mb-10">
        <MemeBanner />
      </div>

      {/* Three-part discovery: most downloaded / new / recommended */}
      <div className="grid sm:grid-cols-3 gap-3 mb-10">
        <DiscoveryCard icon="🔥" label="Most Downloaded" href="/trending" count={trending?.length} subtitle="Students love seeing what's popular" />
        <DiscoveryCard icon="📈" label="New Uploads" href="/latest" count={latest?.length} subtitle="Freshly added resources" />
        <DiscoveryCard icon="⭐" label="Lecturer Recommended" href="/recommended" count={recommended?.length} subtitle="Trusted by your lecturers" />
      </div>

      {!!trending?.length && (
        <Section title="Trending" icon={<Flame size={16} className="text-tape" />} href="/trending">
          <ScrollRow>
            {trending.map((m: any) => (
              <MaterialTile key={m.id} title={m.title} sub={m.courses?.code} type={m.type} meta={`↓ ${m.download_count}`} />
            ))}
          </ScrollRow>
        </Section>
      )}

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

      {!!recommended?.length && (
        <Section title="Lecturer recommended" icon={<Star size={16} className="text-tape" />} href="/recommended">
          <ScrollRow>
            {recommended.map((m: any) => (
              <MaterialTile key={m.id} title={m.title} sub={m.courses?.code} type={m.type} meta="⭐" />
            ))}
          </ScrollRow>
        </Section>
      )}

      {/* Schools */}
      <div className="mb-10">
        <h2 className="font-display text-lg font-semibold text-paper mb-3">Schools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {schools?.map((s: any) => (
            <Link key={s.id} href={`/${s.slug}`} className="crop-marks bg-paper text-ink rounded-sm p-4 sm:p-5 hover:-translate-y-0.5 transition-transform">
              <div className="text-2xl mb-1">{schoolIcon(s.slug)}</div>
              <div className="font-mono text-xs text-blueprint/70 uppercase">{s.slug}</div>
              <div className="font-display font-semibold text-sm sm:text-base mt-1">{s.name}</div>
              <div className="text-xs text-ink/40 mt-2">{s.departments?.length ?? 0} department{s.departments?.length === 1 ? "" : "s"}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-3 mb-10">
        <Link href="/siwes" className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform">
          <div className="font-display font-semibold">SIWES Resources</div>
          <div className="text-xs text-ink/50 mt-1">Logbooks, reports, placement guides</div>
        </Link>
        <Link href="/projects" className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform">
          <div className="font-display font-semibold">Project Materials</div>
          <div className="text-xs text-ink/50 mt-1">Past project reports and defense slides</div>
        </Link>
        <Link href="/contributors" className="crop-marks bg-paper text-ink rounded-sm p-5 hover:-translate-y-0.5 transition-transform">
          <div className="font-display font-semibold">🏆 Top Contributors</div>
          <div className="text-xs text-ink/50 mt-1">See who's uploading the most</div>
        </Link>
      </div>

      <AdBoard />
      <JobBoard />

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

      {/* Donation Message */}
      <div className="mt-16 bg-blueprint-light/20 border border-blueprint-line/40 rounded-sm p-8 text-center">
        <h3 className="font-display font-semibold text-paper text-lg mb-2">Support offkhub</h3>
        <p className="text-paper/60 text-sm max-w-md mx-auto mb-6">
          offkhub is free for everyone. If it has helped you, consider supporting the project to help cover hosting and future improvements.
        </p>
        <button className="bg-tape text-blueprint font-bold px-8 py-3 rounded-sm hover:opacity-90 transition-opacity">
          Consider a Donation
        </button>
      </div>
    </div>
  );
}



function DiscoveryCard({ icon, label, href, count, subtitle }: { icon: string; label: string; href: string; count?: number; subtitle: string }) {
  return (
    <Link href={href} className="crop-marks bg-blueprint-light/30 border border-blueprint-line rounded-sm p-4 hover:border-tape transition-colors">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-display font-semibold text-paper text-sm">{label}</div>
      <div className="text-[10px] text-tape/70 uppercase tracking-wider mt-1">{subtitle}</div>
      <div className="text-xs text-paper/40 mt-1">{count ? `${count} available` : "Check back soon"}</div>
    </Link>
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
