"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/**
 * Client-side auth state for components that need to render differently
 * signed-in vs signed-out (e.g. hiding prices, swapping nav links).
 * createClient() throws if Supabase env vars aren't configured treated
 * the same as "signed out" rather than crashing the page.
 */
export function useSupabaseUser(initialUserId: string | null) {
  const [user, setUser] = useState<User | null>(() => (initialUserId ? ({ id: initialUserId } as User) : null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      setUser(null);
      setLoading(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
