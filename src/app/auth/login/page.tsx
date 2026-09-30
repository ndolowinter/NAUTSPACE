"use client";

import { useState, useTransition, Suspense, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(signInError.message);
          return;
        }
        router.push(next);
        router.refresh();
      } catch {
        setError("Sign-in is not available Supabase is not configured for this environment.");
      }
    });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-slate-50">Sign in to NautSpace International</h1>
        <p className="text-sm text-slate-400">
          Students, researchers, partners, and executive staff use the same portal.
        </p>
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="mb-0">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="mb-1.5 text-xs font-medium text-cyan hover:text-cyan/80"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing in…" : "Sign In"}
        </Button>
        <p className="text-center text-sm text-slate-400">
          New here?{" "}
          <Link href="/auth/sign-up" className="font-medium text-cyan hover:text-cyan/80">
            Create an account
          </Link>
        </p>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs uppercase tracking-wide text-slate-500">Or continue with</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <OAuthButtons next={next} />
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
