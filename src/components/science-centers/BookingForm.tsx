"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { ScienceCenter, TicketType } from "@/lib/types/database";

const TICKET_LABELS: Record<TicketType, string> = {
  stem_tour: "Virtual / On-site STEM Tour",
  flight_simulator: "Flight Simulator Session",
  stargazing_expedition: "Stargazing Expedition",
  launch_viewing: "Launch Viewing",
  dark_sky_reserve: "Dark-Sky Reserve Visit",
};

const bookingSchema = z.object({
  centerId: z.string().uuid("Select a science center"),
  date: z.string().min(1, "Select a date"),
  ticketType: z.custom<TicketType>((v) => typeof v === "string" && v in TICKET_LABELS),
  partySize: z.coerce.number().int().min(1).max(50),
  notes: z.string().max(500).optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm({ centers }: { centers: ScienceCenter[] }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error" | "signed-out">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormValues>({ resolver: zodResolver(bookingSchema) });

  const onSubmit = (values: BookingFormValues) => {
    startTransition(async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setStatus("signed-out");
          return;
        }

        const { error } = await supabase.from("science_center_bookings").insert({
          user_id: user.id,
          center_id: values.centerId,
          date: values.date,
          ticket_type: values.ticketType,
          party_size: values.partySize,
          notes: values.notes ?? null,
        });

        if (error) {
          setStatus("error");
          return;
        }

        setStatus("success");
        reset();
      } catch {
        // createClient() throws synchronously if Supabase env vars aren't configured.
        setStatus("error");
      }
    });
  };

  if (status === "success") {
    return (
      <div className="glass-panel flex flex-col items-center gap-3 p-10 text-center">
        <p className="font-semibold text-slate-100">Booking submitted</p>
        <p className="text-sm text-slate-400">
          Your reservation request has been recorded. A confirmation will follow by email.
        </p>
        <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
          Book another visit
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-panel space-y-5 p-6">
      {status === "signed-out" && (
        <p
          className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Sign in first to submit a booking your reservation is tied to your student/researcher
          account.
        </p>
      )}
      {status === "error" && (
        <p
          className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Something went wrong submitting your booking. Please try again.
        </p>
      )}

      <div>
        <Label htmlFor="centerId">Science Center</Label>
        <Select id="centerId" {...register("centerId")}>
          <option value="">Select a center…</option>
          {centers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.city ? `, ${c.city}` : ""}
            </option>
          ))}
        </Select>
        {errors.centerId && (
          <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
            {errors.centerId.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="date">Preferred Date</Label>
          <Input id="date" type="date" {...register("date")} />
          {errors.date && (
            <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
              {errors.date.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="partySize">Party Size</Label>
          <Input id="partySize" type="number" min={1} max={50} defaultValue={1} {...register("partySize")} />
        </div>
      </div>

      <div>
        <Label htmlFor="ticketType">Experience</Label>
        <Select id="ticketType" {...register("ticketType")}>
          <option value="">Select an experience…</option>
          {Object.entries(TICKET_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        {errors.ticketType && (
          <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
            Select an experience
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" placeholder="School group size, accessibility needs, etc." {...register("notes")} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Submitting…" : "Submit Booking"}
      </Button>
    </form>
  );
}
