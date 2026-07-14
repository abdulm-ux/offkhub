import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Navbar() {
  return (
    <header className="border-b border-blueprint-line/60 sticky top-0 z-20 backdrop-blur bg-blueprint/90">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-display font-semibold text-lg tracking-tight text-paper shrink-0">
          offk<span className="text-tape">hub</span>
        </Link>
        <div className="flex-1">
          <SearchBar compact />
        </div>
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-paper/80 shrink-0">
          <Link href="/set" className="hover:text-tape transition-colors">Browse SET</Link>
          <Link href="/siwes" className="hover:text-tape transition-colors">SIWES</Link>
          <Link href="/projects" className="hover:text-tape transition-colors">Projects</Link>
          <Link href="/calendar" className="hover:text-tape transition-colors">Calendar</Link>
          <Link href="/news" className="hover:text-tape transition-colors">News</Link>
          <Link href="/upload" className="hover:text-tape transition-colors">Upload</Link>
        </nav>
      </div>
    </header>
  );
}
