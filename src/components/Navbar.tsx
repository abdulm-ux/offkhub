"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Upload, Menu, X } from "lucide-react";
import SchoolsMenu from "./SchoolsMenu";
import SearchBar from "./SearchBar";
import AdminBadge from "./AdminBadge";

const LINKS = [
  { href: "/trending", label: "Trending" },
  { href: "/latest", label: "Latest" },
  { href: "/news", label: "News" },
  { href: "/calendar", label: "Calendar" },
];

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-blueprint/90 border-b border-blueprint-line/60">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-3">
          <Link href="/" className="font-display font-bold text-lg tracking-tight text-paper shrink-0">
            offk<span className="text-tape">hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-paper/80">
            <SchoolsMenu />
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-tape transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <AdminBadge />
            <button
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search"
              className="p-2 text-paper/80 hover:text-tape transition-colors"
            >
              <Search size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/trending"
                className="text-paper/70 hover:text-tape text-sm font-medium px-2 py-1 transition-colors"
              >
                Trending
              </Link>
              <Link
                href="/upload"
                className="flex items-center gap-1.5 bg-tape text-blueprint text-sm font-semibold px-3 py-1.5 rounded-sm hover:opacity-90 transition-opacity"
              >
                <Upload size={14} /> Upload
              </Link>
            </div>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
              className="md:hidden p-2 text-paper/80"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-3">
            <SearchBar />
          </div>
        )}
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-blueprint-line/60 px-4 py-3 flex flex-col gap-3 text-sm font-medium text-paper/80">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="hover:text-tape py-2 border-b border-blueprint-line/30">
              {l.label}
            </Link>
          ))}
          <Link href="/upload" onClick={() => setMobileOpen(false)} className="bg-tape text-blueprint text-center font-bold py-3 rounded-sm mt-2">
            Upload a material
          </Link>
        </nav>
      )}
    </header>
  );
}
