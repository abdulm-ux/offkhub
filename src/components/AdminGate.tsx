"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAdminGuard } from "@/lib/useAdminGuard";

const TABS = [
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/moderation", label: "Moderation" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/calendar", label: "Calendar" },
];

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const state = useAdminGuard();

  if (state.status === "loading") {
    return <p className="text-paper/50 text-sm">Checking access…</p>;
  }

  if (state.status === "signed-out") {
    return (
      <div className="max-w-md">
        <h1 className="font-display text-2xl font-semibold text-paper mb-3">Admin sign-in required</h1>
        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
          className="bg-tape text-blueprint font-medium px-5 py-2.5 rounded-sm hover:opacity-90"
        >
          Continue with Google
        </button>
      </div>
    );
  }

  if (state.status === "not-admin") {
    return (
      <div className="max-w-md">
        <h1 className="font-display text-2xl font-semibold text-pending mb-2">Not authorized</h1>
        <p className="text-paper/60 text-sm">
          Your account doesn't have the <code className="font-mono">admin</code> role. Ask an
          existing admin to run:
        </p>
        <pre className="font-mono text-xs bg-blueprint-light/40 border border-blueprint-line rounded-sm p-3 mt-3 overflow-x-auto">
{`update profiles set role = 'admin' where id = '<your-uid>';`}
        </pre>
      </div>
    );
  }

  return (
    <div>
      <nav className="flex gap-1 mb-8 border-b border-blueprint-line pb-3 overflow-x-auto">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="text-sm font-medium text-paper/70 hover:text-tape px-3 py-1.5 whitespace-nowrap"
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
