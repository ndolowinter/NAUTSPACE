import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "@/components/admin/EventForm";

export const metadata: Metadata = {
  title: "Edit Event",
};

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: event } = await supabase.from("events").select("*").eq("id", params.id).single();

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Edit Event</h1>
        <p className="mt-1 text-sm text-slate-500">{event.title}</p>
      </div>
      <EventForm event={event} />
    </div>
  );
}
