"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Recovery links deliver the session as #access_token=...&refresh_token=...
  // in the URL hash fragment (the legacy "implicit grant" style what
  // supabase.auth.admin.generateLink() always produces). This app's Supabase
  // client is configured for the PKCE flow (the @supabase/ssr default, used
  // for the ?code= exchange in /auth/callback), and a PKCE-configured client
  // does NOT auto-detect implicit-grant hash tokens so nothing ever turned
  // that hash into an actual session, no matter how long we waited. Parsing
  // the hash ourselves and calling setSession() directly works regardless of
  // flow type, since it just installs whatever access/refresh token pair we
  // hand it.
  const [sessionReady, setSessionReady] = useState<"checking" | "ready" | "missing">("checking");

  useEffect(() => {
    let cancelled = false;
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      setSessionReady("missing");
      return;
    }

    const establishSession = async () => {
      const hash = window.location.hash.replace(/^#/, "");
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        // Strip the tokens from the address bar either way so they don't
        // linger in browser history.
        window.history.replaceState(null, "", window.location.pathname);
        if (!cancelled && !setSessionError) {
          setSessionReady("ready");
          return true;
        }
      }
      return false;
    };

    establishSession().then(async (established) => {
      if (established || cancelled) return;
      // Fall back to an already-active session (e.g. a reload after the
      // hash was already consumed).
      const { data } = await supabase.auth.getSession();
      if (!cancelled && data.session) setSessionReady("ready");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || session) setSessionReady("ready");
    });

    const timeout = setTimeout(() => {
      if (!cancelled) setSessionReady((current) => (current === "checking" ? "missing" : current));
    }, 6000);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) {
          setError(updateError.message);
          return;
        }
        router.push("/auth/login");
      } catch {
        setError("This reset link may have expired. Request a new one from the sign-in page.");
      }
    });
  };

  if (sessionReady === "checking") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-3 px-4 py-16 text-center">
        <p className="text-sm text-slate-400">Verifying your reset link…</p>
      </div>
    );
  }

  if (sessionReady === "missing") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
        <div className="glass-panel flex flex-col items-center gap-3 p-8 text-center">
          <p className="font-semibold text-slate-100">This link is invalid or has expired</p>
          <p className="text-sm text-slate-400">
            Reset links are single-use and expire quickly. Request a new one to continue.
          </p>
          <Link
            href="/auth/forgot-password"
            className="mt-2 text-sm font-medium text-cyan hover:text-cyan/80"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-slate-50">Set a new password</h1>
        <p className="text-sm text-slate-400">Choose a new password for your NautSpace International account.</p>
      </div>

      <form onSubmit={onSubmit} className="glass-panel space-y-5 p-6">
        {error && (
          <p
            className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {error}
          </p>
        )}
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Updating…" : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
