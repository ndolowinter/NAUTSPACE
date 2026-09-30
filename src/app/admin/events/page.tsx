import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Manage Events",
};

const STATUS_VARIANT: Record<string, "emerald" | "neutral" | "danger" | "amber"> = {
  published: "emerald",
  draft: "neutral",
  cancelled: "danger",
  completed: "amber",
};

export default async function EventsAdminPage() {
  const supabase = createClient();
  const { data: events } = await supabase.from("events").select("*").order("start_at", { ascending: false });

  const now = Date.now();
  const upcoming = (events ?? []).filter((e) => new Date(e.start_at).getTime() >= now && e.status !== "cancelled");
  const past = (events ?? []).filter((e) => new Date(e.start_at).getTime() < now || e.status === "cancelled");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Manage Events</h1>
          <p className="mt-1 text-sm text-slate-500">Create events and generate attendance QR codes.</p>
        </div>
        <Link href="/admin/events/new" className={cn(buttonVariants(), "gap-1.5")}>
          Add Event
        </Link>
      </div>

      <EventSection title={`Upcoming (${upcoming.length})`} events={upcoming} />
      <EventSection title={`Past (${past.length})`} events={past} />
    </div>
  );
}

function EventSection({
  title,
  events,
}: {
  title: string;
  events: { id: string; title: string; start_at: string; location: string | null; status: string }[];
}) {
  return (
    <Card className="border-slate-800 bg-black/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No events yet.</p>}
        {events.map((event) => (
          <div
            key={event.id}
            className="flex flex-col gap-2 rounded-lg border border-slate-800 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-slate-100">{event.title}</p>
              <p className="text-xs text-slate-500">
                {new Date(event.start_at).toLocaleString()} {event.location ? `· ${event.location}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={STATUS_VARIANT[event.status] ?? "neutral"}>{event.status}</Badge>
              <Link
                href={`/admin/events/${event.id}/attendance`}
                className="flex items-center gap-1 text-sm text-cyan hover:text-cyan/80"
              >
                Attendance
              </Link>
              <Link
                href={`/admin/events/${event.id}/edit`}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
