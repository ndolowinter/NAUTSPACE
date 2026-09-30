"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const attendanceSchema = z.object({
  fullName: z.string().min(2, "Required"),
  email: z
    .union([z.literal(""), z.string().email("Enter a valid email")])
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  phone: z
    .union([z.literal(""), z.string()])
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  referenceNumber: z
    .union([z.literal(""), z.string()])
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

export function AttendanceForm({ eventId }: { eventId: string }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: { fullName: "", email: "", phone: "", referenceNumber: "" },
  });

  const onSubmit = (values: AttendanceFormValues) => {
    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.from("event_attendance").insert({
          event_id: eventId,
          full_name: values.fullName,
          email: values.email ?? null,
          phone: values.phone ?? null,
          reference_number: values.referenceNumber ?? null,
        });
        if (error) {
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
      <div className="flex flex-col items-center gap-3 rounded-lg border border-emerald/30 bg-emerald/10 p-8 text-center">
        <p className="font-semibold text-slate-100">Attendance recorded</p>
        <p className="text-sm text-slate-400">Thanks for checking in enjoy the event!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-slate-800 bg-slate-950/60 p-6">
      {status === "error" && (
        <p
          className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Something went wrong marking your attendance. Please try again.
        </p>
      )}
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          required
          placeholder="Enter your full name"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
            {errors.fullName.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          placeholder="+254 XXX XXX XXX"
          {...register("phone")}
        />
      </div>
      <div>
        <Label htmlFor="referenceNumber">Reference / Membership Number</Label>
        <Input
          id="referenceNumber"
          placeholder="Optional"
          {...register("referenceNumber")}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Marking…" : "Mark Attendance"}
      </Button>
    </form>
  );
}
