"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const supabase = createClient();
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
        });
        // Always show the same message, whether or not the email exists
        // confirming/denying an account's existence here would leak who has
        // a NautSpace International account to anyone who tries an address.
        setStatus("sent");
      } catch {
        setStatus("error");
      }
    });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-slate-50">Reset your password</h1>
        <p className="text-sm text-slate-400">
          Enter your account email and we&apos;ll send you a link to set a new password.
        </p>
      </div>

      {status === "sent" ? (
        <div className="glass-panel flex flex-col items-center gap-3 p-8 text-center">
          <p className="font-semibold text-slate-100">Check your email</p>
          <p className="text-sm text-slate-400">
            If an account exists for <span className="text-slate-200">{email}</span>, a reset link
            is on its way. It expires after a short time, so use it soon.
          </p>
          <Link href="/auth/login" className="mt-2 text-sm font-medium text-cyan hover:text-cyan/80">
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="glass-panel space-y-5 p-6">
          {status === "error" && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              Something went wrong sending the reset email. Please try again.
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
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Sending…" : "Send Reset Link"}
          </Button>
          <p className="text-center text-xs text-slate-500">
            <Link href="/auth/login" className="text-cyan hover:text-cyan/80">
              Back to Sign In
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
