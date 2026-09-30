"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import type { InquiryType } from "@/lib/types/database";

const FORMBOLD_ENDPOINT = "https://formbold.com/s/6M5MA";

const INQUIRY_LABELS: Record<InquiryType, string> = {
  defense_agency: "Defense Agency",
  university: "University / Research Institution",
  venture_partner: "Venture / Investment Partner",
  government: "Government Body",
  general_b2b: "General B2B Partnership",
};

const inquirySchema = z.object({
  organizationName: z.string().min(2, "Required"),
  contactName: z.string().min(2, "Required"),
  contactEmail: z.string().email("Enter a valid email"),
  inquiryType: z.custom<InquiryType>((v) => typeof v === "string" && v in INQUIRY_LABELS),
  message: z.string().min(20, "Please provide at least 20 characters"),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export function InquiryForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormValues>({ resolver: zodResolver(inquirySchema) });

  const onSubmit = (values: InquiryFormValues) => {
    startTransition(async () => {
      try {
        const body = new FormData();
        body.append("Organization", values.organizationName);
        body.append("Contact Name", values.contactName);
        body.append("Email", values.contactEmail);
        body.append("Inquiry Type", INQUIRY_LABELS[values.inquiryType]);
        body.append("Message", values.message);

        const res = await fetch(FORMBOLD_ENDPOINT, {
          method: "POST",
          body,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          setStatus("error");
          return;
        }

        setStatus("success");
        reset();
      } catch {
        setStatus("error");
      }
    });
  };

  if (status === "success") {
    return (
      <div className="glass-panel flex flex-col items-center gap-3 p-10 text-center">
        <p className="font-semibold text-slate-100">Inquiry received</p>
        <p className="text-sm text-slate-400">
          Your submission has been routed to the appropriate partnerships team for review.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      action={FORMBOLD_ENDPOINT}
      method="POST"
      className="glass-panel space-y-5 p-6"
    >
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
        Submitted over an encrypted connection. Only cleared partnership staff can read inquiries.
      </div>

      {status === "error" && (
        <p
          className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Something went wrong submitting your inquiry. Please try again.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="organizationName">Organization</Label>
          <Input id="organizationName" {...register("organizationName")} />
          {errors.organizationName && (
            <p
              className="mt-1 text-xs text-red-400"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {errors.organizationName.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="contactName">Contact Name</Label>
          <Input id="contactName" {...register("contactName")} />
          {errors.contactName && (
            <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
              {errors.contactName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contactEmail">Email</Label>
          <Input id="contactEmail" type="email" {...register("contactEmail")} />
          {errors.contactEmail && (
            <p
              className="mt-1 text-xs text-red-400"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {errors.contactEmail.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="inquiryType">Inquiry Type</Label>
          <Select id="inquiryType" {...register("inquiryType")}>
            <option value="">Select…</option>
            {Object.entries(INQUIRY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          {errors.inquiryType && (
            <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
              Select an inquiry type
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} {...register("message")} />
        {errors.message && (
          <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Submitting…" : "Submit Inquiry"}
      </Button>
    </form>
  );
}
