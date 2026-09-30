"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { BookingStatus } from "@/lib/types/database";

export function BookingApprovalControl({ bookingId }: { bookingId: string }) {
  const [status, setStatus] = useState<BookingStatus>("pending");
  const [isPending, startTransition] = useTransition();

  const decide = (next: BookingStatus) => {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("science_center_bookings")
        .update({ status: next })
        .eq("id", bookingId);
      if (!error) setStatus(next);
    });
  };

  if (status !== "pending") {
    return (
      <span
        className={
          status === "approved" ? "text-sm font-medium text-emerald" : "text-sm font-medium text-red-400"
        }
      >
        {status === "approved" ? "Approved" : "Denied"}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="gap-1 border-emerald/40 text-emerald hover:bg-emerald/10"
        disabled={isPending}
        onClick={() => decide("approved")}
      >
        {isPending ? "…" : "Approve"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="gap-1 border-red-500/40 text-red-400 hover:bg-red-500/10"
        disabled={isPending}
        onClick={() => decide("denied")}
      >
        {isPending ? "…" : "Deny"}
      </Button>
    </div>
  );
}
