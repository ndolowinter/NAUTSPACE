"use client";

import { useState, useTransition, Suspense, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

function SignUpForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "check-email">("idle");
  const [isPending, startTransition] = useTransition();

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
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        // Supabase projects normally require email confirmation before a
        // session is issued data.session is null in that case even
        // though the account was created successfully.
        if (!data.session) {
          setStatus("check-email");
        } else {
          window.location.href = next;
        }
      } catch {
        setError("Sign-up is not available Supabase is not configured for this environment.");
      }
    });
  };

  if (status === "check-email") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
        <div className="glass-panel flex flex-col items-center gap-3 p-8 text-center">
          <p className="font-semibold text-slate-100">Check your email</p>
          <p className="text-sm text-slate-400">
            We sent a confirmation link to <span className="text-slate-200">{email}</span>. Click
            it to activate your account, then sign in.
          </p>
          <Link href="/auth/login" className="mt-2 text-sm font-medium text-cyan hover:text-cyan/80">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-slate-50">Create your NautSpace International account</h1>
        <p className="text-sm text-slate-400">
          For students, researchers, partners, and applicants one account for the whole portal.
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
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
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
          <Label htmlFor="password">Password</Label>
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
          <Label htmlFor="confirmPassword">Confirm Password</Label>
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
          {isPending ? "Creating account…" : "Create Account"}
        </Button>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-cyan hover:text-cyan/80">
            Sign in
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

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}
