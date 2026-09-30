import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { ServiceGroupGrid } from "@/components/services/ServiceGroupGrid";
import { IMAGES } from "@/lib/images";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { createClient } from "@/lib/supabase/server";
import { PILOT_TRACKS, ACADEMY_TRACKS } from "@/lib/applicationTracks";
import type { Opportunity } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "NAUTSPACE HORIZON",
  description: "NautSpace International programs, services, and public API capabilities.",
};

const OPPORTUNITY_TYPE_LABELS: Record<string, string> = {
  internship: "Internship",
  competition: "Competition",
  job: "Job",
  scholarship: "Scholarship",
};

const API_ENDPOINTS = [
  {
    method: "GET",
    path: "/v1/geospatial/coverage",
    description: "Query CubeSat and drone sensing coverage for a bounding box.",
  },
  {
    method: "GET",
    path: "/v1/spectrum/simulate",
    description: "RF interference and spectrum-occupancy simulation for a given band.",
  },
  {
    method: "GET",
    path: "/v1/telemetry/stream",
    description: "Server-sent events feed of public satellite telemetry samples.",
  },
];

const PILOT_TRACK_CARDS = [
  {
    title: "Remote Pilot License",
    description: "Structured pathway support toward a PPL/CPL, in partnership with licensed flight schools.",
  },
  {
    title: "Drone Mapping & GIS",
    description: "Aerial survey operations, orthomosaic and terrain mapping, and GIS data pipelines.",
  },
  {
    title: "Drone Building & Fabrication",
    description: "Airframe assembly, flight-controller wiring, and maintenance of fixed-wing and multirotor UAVs.",
  },
  {
    title: "Videography and Photography",
    description: "Aerial cinematography, gimbal camera operation, and commercial drone photo/video delivery.",
  },
];

const LIDAR_TRACK = {
  tag: "LIDAR & Remote Sensing",
  title: "Canopy-Penetrating LIDAR for Underground & Understory Terrain",
  description:
    "Airborne LIDAR sees through dense forest canopy to map bare-earth terrain, understory structure, and buried features invisible to optical sensors.",
};

const PILOT_CURRICULUM = [
  {
    title: "Remote Pilot License",
    curriculum: [
      "Ground school: air law & regulations, meteorology, navigation",
      "Aircraft technical knowledge and human performance & limitations",
      "Radio telephony and airspace procedures",
      "Basic handling, circuits & landings",
      "Navigation exercises and emergency procedures",
      "Solo consolidation and cross-country flying",
    ],
    requirements: ["Class 2 or 3 aviation medical certificate"],
    sessions:
      "1–2 hour dual instruction flights, progressing from dual to solo to cross-country minimum 45 flight hours toward a PPL (partner flight school dependent).",
  },
  {
    title: "Drone Mapping & GIS",
    curriculum: [
      "Drone flight fundamentals and pre-flight checks",
      "GIS software (QGIS / ArcGIS) essentials",
      "Flight planning and autonomous mission software",
      "Photogrammetry, orthomosaics, and ground control points",
      "Data accuracy, processing pipelines, and deliverables",
      "KCAA RPAS regulatory compliance",
    ],
    requirements: [
      "Previous GIS experience in ArcGIS, ArcMap, QGIS or any other",
      "Not required but beneficial",
      "RPL License & Certificate of Compeltion",
      "Up-to-date Class 2 or 3 aviation medical certificate",
    ],
    sessions: "Weekly hands-on field mapping sessions, paired with lab sessions for data processing.",
  },
  {
    title: "Videography and Photography",
    curriculum: [
      "Aerial cinematography techniques and shot planning",
      "Gimbal and camera settings for aerial work",
      "Composition and lighting for aerial photography",
      "Post-production: color grading and stabilization",
      "Commercial licensing and client delivery workflows",
    ],
    requirements: [
      "Previously acquired RPL License and Certificate of Compeltion",
      "Up-to-date Class 2 or 3 aviation medical certificate",
      "Completed Approvals from Kenya Film Classification Board and Kenya Civil Aviation Authority",
    ],
    sessions: "On-location shoot sessions paired with editing lab sessions.",
  },
  {
    title: "Drone Building & Fabrication",
    curriculum: [
      "Airframe design and material selection",
      "Motor, ESC, and power-system selection",
      "Flight-controller wiring and firmware (Betaflight / ArduPilot)",
      "Soldering and electronics assembly",
      "Maintenance, diagnostics, and troubleshooting",
      "Workshop safety",
    ],
    requirements: ["Location Booking fee"],
    sessions: "Hands-on workshop sessions from kit assembly through to first test flight.",
  },
];

const ACADEMY_TRACK_CARDS = [
  { title: "Space Systems", description: "CubeSat bus design, payload integration, and mission ops." },
  { title: "Autonomous UAVs", description: "Flight control software, swarm coordination, and sensor fusion." },
  { title: "AI Data Fusion", description: "Multi-sensor intelligence pipelines for surveillance and spectrum monitoring." },
  { title: "Cybersecurity", description: "Securing UAV command links, satellite uplinks, and ground infrastructure." },
  { title: "RF Engineering", description: "Antenna design, spectrum analysis, and ground station RF chains." },
  { title: "Astrotourism Management", description: "Expedition logistics, guest science programming, and dark-sky operations." },
];

export default async function ServicesPage() {
  const supabase = createClient();
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("*")
    .eq("status", "published")
    .order("application_deadline", { ascending: true, nullsFirst: false });

  return (
    <>
      <Section
        eyebrow="Be a Pilot"
        title="Fly, map, and build the next generation of African aerospace"
        description="Four hands-on tracks for aspiring pilots and drone operators open to students, hobbyists, and career switchers."
        className="relative isolate overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.militaryUav.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/55 to-space-void" />

        <div className="space-y-6">
          <div className="glass-panel p-6">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="neutral">{LIDAR_TRACK.tag}</Badge>
            </div>
            <h3 className="font-semibold text-slate-100">{LIDAR_TRACK.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{LIDAR_TRACK.description}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILOT_TRACK_CARDS.map((track) => (
              <Card key={track.title} className="glass-card-hover">
                <CardHeader>
                  <CardTitle>{track.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{track.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Curriculum"
        title="Curriculum & course requirements"
        description="What each track actually covers, what you need before you start, and how sessions are structured."
        className="relative isolate overflow-hidden border-t border-slate-800/50"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {PILOT_CURRICULUM.map((track) => (
            <details key={track.title} className="glass-panel group open:pb-2">
              <summary className="cursor-pointer list-none p-5 font-semibold text-slate-100">{track.title}</summary>
              <div className="space-y-4 px-5 pb-5">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan">Curriculum</p>
                  <ul className="space-y-1 text-sm text-slate-400">
                    {track.curriculum.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan">Course Requirements</p>
                  <ul className="space-y-1 text-sm text-slate-400">
                    {track.requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan">Flight / Session Structure</p>
                  <p className="text-sm text-slate-400">{track.sessions}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Apply"
        title="Register your interest"
        className="relative isolate overflow-hidden border-t border-slate-800/50"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.forestCanopyAerial.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/60 to-space-void" />

        <div className="mx-auto max-w-xl">
          <ApplicationForm tracks={PILOT_TRACKS} trackFieldLabel="Program Track" resumeLabel="Resume / Certifications (PDF, max 8MB)" />
        </div>
      </Section>

      <Section
        eyebrow="Careers & Academy"
        title="Join us for monthly research and networking sessions in Nairobi"
        className="relative isolate overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.aerospaceMuseumExhibit.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/55 to-space-void" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ACADEMY_TRACK_CARDS.map((track) => (
            <Card key={track.title} className="glass-card-hover">
              <CardHeader>
                <CardTitle>{track.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{track.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {!!opportunities?.length && (
        <Section
          eyebrow="Opportunities"
          title="Open internships, competitions, and scholarships"
          description="Externally posted opportunities from NautSpace International's partner network."
          className="relative isolate overflow-hidden border-t border-slate-800/50"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(opportunities as Opportunity[]).map((opp) => (
              <Card key={opp.id} className="glass-card-hover flex h-full flex-col">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="default">
                      {OPPORTUNITY_TYPE_LABELS[opp.type] ?? opp.type}
                    </Badge>
                    {opp.featured && <Badge variant="amber">Featured</Badge>}
                  </div>
                  <CardTitle>{opp.title}</CardTitle>
                  {opp.organization && <CardDescription>{opp.organization}</CardDescription>}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <div>
                    {opp.description && <p className="text-sm text-slate-400">{opp.description}</p>}
                    {opp.location && <p className="mt-2 text-xs text-slate-500">{opp.location}</p>}
                    {opp.application_deadline && (
                      <p className="mt-1 text-xs text-slate-500">
                        Deadline: {new Date(opp.application_deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {opp.application_link && (
                    <a
                      href={opp.application_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-cyan hover:text-cyan/80"
                    >
                      Apply
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      )}

      <Section
        eyebrow="Apply"
        title="Submit your resume securely"
        className="relative isolate overflow-hidden border-t border-slate-800/50"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.forestCanopyAerial.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/60 to-space-void" />

        <div className="mx-auto max-w-xl">
          <ApplicationForm tracks={ACADEMY_TRACKS} trackFieldLabel="Internship Track" />
        </div>
      </Section>

      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <Image
          src={IMAGES.militaryUav.src}
          alt={IMAGES.militaryUav.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-space-void via-space-void/70 to-space-void/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="container pb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Products &amp; Services</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50 sm:text-4xl">
              From orbit to ocean floor NautSpace International&apos;s operational capability stack
            </h1>
          </div>
        </div>
      </div>

      <Section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.forestCanopyAerial.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/55 to-space-void" />

        <div className="grid gap-10">
          <h3 className="text-center text-xl font-semibold text-slate-100">
            CubeSat Payloads &amp; Drone Fleet Operations
          </h3>

          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h4 className="mb-6 text-lg font-semibold text-slate-100">CubeSat Payloads</h4>
              <ServiceGroupGrid group="cubesat" />
            </div>
            <div>
              <h4 className="mb-6 text-lg font-semibold text-slate-100">Drone Fleet Operations</h4>
              <ServiceGroupGrid group="drone" />
            </div>
          </div>
        </div>
      </Section>

      <Section className="relative isolate overflow-hidden border-t border-slate-800/50">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.earthCityLights.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/55 to-space-void" />

        <div className="glass-panel mx-auto max-w-3xl overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-800/50 px-5 py-3">
            <span className="text-sm font-medium text-slate-200">api.orbitspacesafari.co.ke</span>
          </div>
          <ul className="divide-y divide-slate-800/50">
            {API_ENDPOINTS.map((endpoint) => (
              <li key={endpoint.path} className="flex items-start gap-4 px-5 py-4">
                <span className="rounded bg-cyan/10 px-2 py-1 font-mono text-xs font-semibold text-cyan">
                  {endpoint.method}
                </span>
                <div>
                  <p className="font-mono text-sm text-slate-200">{endpoint.path}</p>
                  <p className="mt-1 text-sm text-slate-400">{endpoint.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
