import Link from "next/link";
import { Github, Instagram, Twitter } from "lucide-react";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/dmca", label: "DMCA / Copyright" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/upload-guidelines", label: "Upload Guidelines" },
  { href: "/contributors", label: "Top Contributors" },
];

export default function Footer() {
  return (
    <footer className="border-t border-blueprint-line/60 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between gap-8">
          <div>
            <div className="font-display font-bold text-lg text-paper mb-2">
              offk<span className="text-tape">hub</span>
            </div>
            <p className="text-paper/40 text-xs max-w-xs">
              A student-built archive for FUTMinna — course materials, past questions,
              SIWES resources, and project materials in one place.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-paper/60 text-sm hover:text-tape transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <a href="https://github.com/abdulm-ux/offkhub" target="_blank" rel="noopener noreferrer" className="text-paper/50 hover:text-tape transition-colors">
                <Github size={18} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-paper/50 hover:text-tape transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-paper/50 hover:text-tape transition-colors">
                <Twitter size={18} />
              </a>
            </div>
            <div className="text-[10px] text-paper/30 uppercase tracking-widest">
              FUTMinna Community Project
            </div>
          </div>
        </div>

        <div className="text-paper/30 text-xs mt-8">
          © {new Date().getFullYear()} offkhub. Not officially affiliated with FUTMinna.
        </div>
      </div>
    </footer>
  );
}
