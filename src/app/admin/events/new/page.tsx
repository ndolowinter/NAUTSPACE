import type { Metadata } from "next";
import { EventForm } from "@/components/admin/EventForm";

export const metadata: Metadata = {
  title: "Add Event",
};

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Add Event</h1>
        <p className="mt-1 text-sm text-slate-500">Add a new event to the calendar.</p>
      </div>
      <EventForm />
    </div>
  );
}
