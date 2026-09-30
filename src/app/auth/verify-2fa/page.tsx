"use client";

import { Suspense, useState, useTransition, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { verifyTotpCode } from "./actions";

function Verify2FAForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/executive/dashboard";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await verifyTotpCode(code);
      if (!result.success) {
        setError(result.error ?? "Verification failed.");
        return;
      }
      router.push(next);
      router.refresh();
    });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-slate-50">Two-Factor Verification</h1>
        <p className="text-sm text-slate-400">
          Enter the 6-digit code from your authenticator app to access the Executive Portal.
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
          <Label htmlFor="code">Authentication Code</Label>
          <Input
            id="code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="text-center font-mono text-lg tracking-[0.4em]"
            placeholder="000000"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending || code.length !== 6}>
          {isPending ? "Verifying…" : "Verify & Continue"}
        </Button>
      </form>
    </div>
  );
}

export default function Verify2FAPage() {
  return (
    <Suspense fallback={null}>
      <Verify2FAForm />
    </Suspense>
  );
}
