"use client";

import Link from "next/link";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminBadge() {
  const state = useAdminGuard();
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    if (state.status !== "admin") return;
    supabase
      .from("materials")
      .select("id", { count: "exact", head: true })
      .eq("approved", false)
      .then(({ count }) => setPending(count ?? 0));
  }, [state.status]);

  if (state.status !== "admin" || !pending) return null;

  return (
    <Link
      href="/admin"
      className="flex items-center gap-1 bg-tape text-blueprint text-xs font-bold px-2 py-1 rounded-full hover:opacity-90"
      title={`${pending} item${pending === 1 ? "" : "s"} waiting for review`}
    >
      {pending} pending
    </Link>
  );
}
