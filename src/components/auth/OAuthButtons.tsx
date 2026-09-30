"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Provider = "google" | "facebook" | "github" | "azure";

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "google", label: "Google" },
  { id: "facebook", label: "Facebook" },
  { id: "github", label: "GitHub" },
  { id: "azure", label: "Microsoft" },
];

export function OAuthButtons({ next }: { next: string }) {
  const [pendingProvider, setPendingProvider] = useState<Provider | null>(null);

  const signIn = async (provider: Provider) => {
    setPendingProvider(provider);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) setPendingProvider(null);
      // On success the browser navigates away to the provider's login page,
      // so there's nothing further to do here.
    } catch {
      setPendingProvider(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => signIn(p.id)}
          disabled={pendingProvider !== null}
          className={cn(
            "flex items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-cyan/50 hover:bg-slate-800/50 disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {pendingProvider === p.id ? "Connecting…" : p.label}
        </button>
      ))}
    </div>
  );
}
