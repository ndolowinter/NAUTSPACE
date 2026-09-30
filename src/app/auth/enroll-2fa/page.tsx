"use client";

import { Suspense, useState, useTransition, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { startTotpEnrollment, confirmTotpEnrollment } from "./actions";

function Enroll2FAForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/executive/dashboard";

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [manualKey, setManualKey] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onStart = () => {
    setError(null);
    startTransition(async () => {
      const result = await startTotpEnrollment();
      if (!result.success || !result.qrDataUrl || !result.manualKey) {
        setError(result.error ?? "Could not start enrollment.");
        return;
      }
      setQrDataUrl(result.qrDataUrl);
      setManualKey(result.manualKey);
    });
  };

  const onConfirm = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await confirmTotpEnrollment(code);
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
        <h1 className="text-2xl font-bold text-slate-50">Enable Two-Factor Authentication</h1>
        <p className="text-sm text-slate-400">
          Government, executive, and admin accounts must enroll in TOTP 2FA before reaching the
          Executive Portal.
        </p>
      </div>

      <div className="glass-panel space-y-5 p-6">
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

        {!qrDataUrl ? (
          <Button onClick={onStart} disabled={isPending} className="w-full">
            {isPending ? "Generating…" : "Generate Setup QR Code"}
          </Button>
        ) : (
          <form onSubmit={onConfirm} className="space-y-5">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-lg bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="TOTP enrollment QR code" width={200} height={200} />
              </div>
              <p className="text-center text-xs text-slate-500">
                Scan with Google Authenticator, 1Password, or Authy. Can&apos;t scan?
                <br />
                Enter this key manually:{" "}
                <code className="text-cyan">{manualKey}</code>
              </p>
            </div>

            <div>
              <Label htmlFor="code">Enter the 6-digit code to confirm</Label>
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
              {isPending ? "Confirming…" : "Confirm & Enable 2FA"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Enroll2FAPage() {
  return (
    <Suspense fallback={null}>
      <Enroll2FAForm />
    </Suspense>
  );
}
