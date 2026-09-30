"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { Membership } from "@/lib/types/database";

function daysRemaining(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function MembershipBanner({
  membership,
  lifetime = false,
}: {
  membership: Membership;
  lifetime?: boolean;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (lifetime) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald/30 bg-emerald/10 p-4 text-emerald">
        <p className="text-sm">Lifetime membership this account never expires.</p>
      </div>
    );
  }

  const trialDaysLeft = daysRemaining(membership.trial_ends_at);
  const isTrialExpired = membership.status === "trial" && trialDaysLeft <= 0;
  const needsPayment = membership.status === "expired" || membership.status === "cancelled" || isTrialExpired;

  const payNow = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/mpesa/stk-push", { method: "POST" });
        const data = await res.json();
        setMessage(data.message ?? "Something went wrong.");
      } catch {
        setMessage("Payments aren't available right now please try again shortly.");
      }
    });
  };

  if (needsPayment) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-amber-300">
          <p className="text-sm">
            {membership.status === "expired" || isTrialExpired
              ? "Your free trial has ended pay your monthly membership fee to keep your privileges."
              : "Your membership needs renewal."}
          </p>
        </div>
        <Button size="sm" onClick={payNow} disabled={isPending}>
          {isPending ? "Contacting Mpesa…" : "Pay with Mpesa"}
        </Button>
        {message && <p className="text-xs text-slate-400 sm:ml-3">{message}</p>}
      </div>
    );
  }

  if (membership.status === "trial") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 p-4 text-cyan">
        <p className="text-sm">
          Free trial {trialDaysLeft} day{trialDaysLeft === 1 ? "" : "s"} remaining.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-emerald/30 bg-emerald/10 p-4 text-emerald">
      <p className="text-sm">Active member thank you for your support.</p>
    </div>
  );
}
