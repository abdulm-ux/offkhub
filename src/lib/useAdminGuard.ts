"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type AdminState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "not-admin" }
  | { status: "admin"; userId: string };

export function useAdminGuard(): AdminState {
  const [state, setState] = useState<AdminState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    async function check() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        if (active) setState({ status: "signed-out" });
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!active) return;
      if (profile?.role === "admin") {
        setState({ status: "admin", userId: session.user.id });
      } else {
        setState({ status: "not-admin" });
      }
    }

    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
