import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { CenterMapLoader } from "@/components/science-centers/CenterMapLoader";
import { ExhibitGrid } from "@/components/science-centers/ExhibitGrid";
import { BookingForm } from "@/components/science-centers/BookingForm";
import { createClient } from "@/lib/supabase/server";
import type { ScienceCenter } from "@/lib/types/database";
import { IMAGES } from "@/lib/images";
import { UpcomingConferences } from "@/components/research/UpcomingConferences";

export const metadata: Metadata = {
  title: "NAUTSPACE HORIZON",
  description: "Upcoming NautSpace events, science center visits, and publicly registrable community programs.",
};

// Used when Supabase is unreachable/unconfigured in local development, so the
// page still renders mirrors supabase/migrations/0001_init.sql seed data.
const FALLBACK_CENTERS: ScienceCenter[] = [
  {
    id: "fallback-1",
    name: "Kenya National Aerospace & Aviation Museum",
    country: "Kenya",
    city: "Nairobi",
    lat: -1.2921,
    lng: 36.8219,
    description: "Flagship STEM hub covering rocketry, avionics, and UAV systems history.",
    has_flight_simulator: true,
    created_at: new Date(0).toISOString(),
  },
  {
    id: "fallback-2",
    name: "Kenya Spaceport Visitor Center",
    country: "Kenya",
    city: "Malindi",
    lat: -3.2175,
    lng: 40.1191,
    description: "Launch viewing gallery adjacent to the equatorial launch corridor.",
    has_flight_simulator: false,
    created_at: new Date(0).toISOString(),
  },
  {
    id: "fallback-3",
    name: "South African National Space Agency Center",
    country: "South Africa",
    city: "Pretoria",
    lat: -25.7479,
    lng: 28.2293,
    description: "Regional partner center for satellite operations education.",
    has_flight_simulator: true,
    created_at: new Date(0).toISOString(),
  },
];

async function getCenters(): Promise<ScienceCenter[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("science_centers").select("*").order("name");
    if (error || !data || data.length === 0) return FALLBACK_CENTERS;
    return data;
  } catch {
    return FALLBACK_CENTERS;
  }
}

export default async function EventsPage() {
  const supabase = createClient();
  const [{ data: events }, centers] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .gte("start_at", new Date().toISOString())
      .order("start_at", { ascending: true }),
    getCenters(),
  ]);

  return (
    <>
      <Section
        eyebrow="Events"
        title="Upcoming NautSpace events"
        description="Workshops, stargazing expeditions, and launch viewings across our operating regions."
      >
        {!events?.length ? (
          <p className="text-center text-sm text-slate-500">
            No upcoming events scheduled check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="glass-panel overflow-hidden">
                {event.banner_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.banner_image_url}
                    alt={event.title}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  {event.category && (
                    <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 text-xs font-medium text-cyan">
                      {event.category}
                    </span>
                  )}
                  <h3 className="mt-2 font-semibold text-slate-100">{event.title}</h3>
                  {event.description && <p className="mt-2 text-sm text-slate-400">{event.description}</p>}
                  <div className="mt-4 flex flex-col gap-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">{new Date(event.start_at).toLocaleString()}</span>
                    {event.location && <span className="flex items-center gap-1">{event.location}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section
        eyebrow="National Science Centers"
        title="An interactive map of Africa's aerospace education hubs"
        description="Museums, avionics exhibits, and flight simulator labs across the continent book a visit, a virtual STEM tour, or a school lab session."
        className="relative isolate overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.aerospaceMuseumDish.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/55 to-space-void" />
        <CenterMapLoader centers={centers} />
      </Section>

      <Section
        eyebrow="Inside the Centers"
        title="Interactive museum exhibits"
        className="relative isolate overflow-hidden border-t border-slate-800/50"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.stargazingMilkyWay.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/60 to-space-void" />
        <ExhibitGrid />
      </Section>

      <Section
        eyebrow="Reserve a Visit"
        title="Book a STEM tour or flight simulator session"
        description="Reservations are linked to your NautSpace International account sign in first if you haven't already."
        className="relative isolate overflow-hidden border-t border-slate-800/50"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.mistyHighlands.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/60 to-space-void" />

        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {centers
              .filter((c) => c.has_flight_simulator)
              .map((c) => (
                <div key={c.id} className="glass-panel flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-slate-100">
                      {c.name === "Kenya National Aerospace & Aviation Museum" ? `${c.name} (Upcoming)` : c.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {c.city}, {c.country}
                    </p>
                  </div>
                  <Badge variant="emerald">Simulation</Badge>
                </div>
              ))}
          </div>
          <BookingForm centers={centers} />
        </div>
      </Section>

      <UpcomingConferences />
    </>
  );
}
