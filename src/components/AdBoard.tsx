import { ExternalLink, ShoppingCart, Home, Wrench, GraduationCap } from "lucide-react";

export default function AdBoard() {
  return (
    <div className="space-y-8 my-12">
      {/* Sponsored Adverts */}
      <div>
        <h2 className="font-display text-lg font-semibold text-paper mb-4 flex items-center gap-2">
          <span className="bg-tape text-blueprint text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">Sponsored</span>
          Local Services
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdCard 
            icon={<Home size={20} />}
            title="Need accommodation?"
            desc="Hostels near Gidan Kwano. Available lodges."
            cta="See Hostels"
          />
          <AdCard 
            icon={<Wrench size={20} />}
            title="Laptop Repairs"
            desc="Same-day repairs for FUTMinna students."
            cta="Contact Technician"
          />
          <AdCard 
            icon={<GraduationCap size={20} />}
            title="Learn AutoCAD"
            desc="Master architectural drafting in 3 weeks."
            cta="Enroll Now"
          />
          <AdCard 
            icon={<ShoppingCart size={20} />}
            title="XYZ Printing Press"
            desc="20% student discount on project printing."
            cta="Get Quote"
          />
        </div>
      </div>

      {/* Affiliate Section */}
      <div className="bg-blueprint-light/20 border border-blueprint-line/40 rounded-sm p-6">
        <h2 className="font-display text-lg font-semibold text-paper mb-2">Essential Student Tools</h2>
        <p className="text-paper/50 text-xs mb-6 italic">Handpicked tools every FUTMinna student needs. Support offkhub by buying through our links.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <ToolLink label="Calculators" />
          <ToolLink label="Laptops" />
          <ToolLink label="Flash Drives" />
          <ToolLink label="Hard Drives" />
          <ToolLink label="Drawing Tools" />
          <ToolLink label="Internet Data" />
        </div>
      </div>
    </div>
  );
}

function AdCard({ icon, title, desc, cta }: { icon: React.ReactNode, title: string, desc: string, cta: string }) {
  return (
    <div className="crop-marks bg-paper text-ink p-4 hover:-translate-y-0.5 transition-transform">
      <div className="text-tape mb-3">{icon}</div>
      <div className="font-display font-semibold text-sm mb-1">{title}</div>
      <p className="text-[11px] text-ink/60 mb-4 leading-relaxed">{desc}</p>
      <a 
        href="/contact"
        className="block w-full text-center text-[10px] font-bold uppercase tracking-widest py-2 border border-blueprint-line hover:bg-blueprint hover:text-paper transition-colors"
      >
        {cta}
      </a>
    </div>
  );
}

function ToolLink({ label }: { label: string }) {
  return (
    <a 
      href="https://amazon.com" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center justify-between bg-blueprint-light/40 border border-blueprint-line/60 rounded-sm px-3 py-2 text-paper/80 hover:text-tape hover:border-tape transition-all group"
    >
      <span className="text-[11px] font-medium">{label}</span>
      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}
