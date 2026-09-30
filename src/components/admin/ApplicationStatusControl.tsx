"use client";

import { useState, useTransition } from "react";
import { Select } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { ApplicationStatus } from "@/lib/types/database";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  interview: "Interview",
  accepted: "Accepted",
  rejected: "Rejected",
};

export function ApplicationStatusControl({
  applicationId,
  status,
}: {
  applicationId: string;
  status: ApplicationStatus;
}) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  const onChange = (next: ApplicationStatus) => {
    setCurrent(next);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("applications")
        .update({ status: next })
        .eq("id", applicationId);
      if (error) setCurrent(status);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={current}
        disabled={isPending}
        onChange={(e) => onChange(e.target.value as ApplicationStatus)}
        className="h-8 w-auto text-xs"
      >
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      {isPending && <span className="text-xs text-slate-500">Saving…</span>}
    </div>
  );
}
