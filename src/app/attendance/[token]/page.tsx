import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AttendanceForm } from "@/components/events/AttendanceForm";

export const metadata: Metadata = {
  title: "Mark Attendance",
};

export default async function AttendancePage({ params }: { params: { token: string } }) {
  const supabase = createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("attendance_token", params.token)
    .in("status", ["published", "completed"])
    .single();

  if (!event) notFound();

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-50">{event.title}</h1>
        <p className="mt-1 text-sm text-slate-400">Mark your attendance for this event</p>
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">{new Date(event.start_at).toLocaleString()}</span>
          {event.location && <span className="flex items-center gap-1">{event.location}</span>}
        </div>
      </div>

      <AttendanceForm eventId={event.id} />
    </div>
  );
}
