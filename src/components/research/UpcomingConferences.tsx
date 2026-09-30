"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { IMAGES } from "@/lib/images";

const CONFERENCES = [
  {
    name: "Africa Virtual Cybersecurity Summit",
    dates: "Aug 6–7, 2026",
    format: "Online",
    location: "Virtual Africa-wide",
    description:
      "CISOs and security leaders on AI-driven threats, critical infrastructure protection, and data sovereignty directly relevant to NautSpace International's ground-segment hardening work.",
    href: "https://ismg.events/summit/virtual-africa-summit-2026/",
  },
  {
    name: "Aviation Africa 2026 Drone & Autonomous Systems Track",
    dates: "Sep 9–10, 2026",
    format: "In-Person",
    location: "Nairobi, Kenya",
    description:
      "African Drone Forum track on drone regulation, BVLOS operations, and unmanned traffic management, hosted at the Sarit Expo Centre.",
    href: "https://www.africandroneforum.org/",
  },
  {
    name: "PyCon Africa 2026",
    dates: "Oct 7–11, 2026",
    format: "In-Person",
    location: "Kampala, Uganda",
    description:
      "Pan-African Python conference run with Kenya, Tanzania, Rwanda, and South Sudan communities talks typically stream free online.",
    href: "https://africa.pycon.org/",
  },
  {
    name: "Africa Fintech Summit Kigali",
    dates: "Nov 18–19, 2026",
    format: "In-Person",
    location: "Kigali, Rwanda",
    description:
      "Regional fintech and digital-payments summit, relevant to NautSpace International's astrotourism booking and partnership infrastructure.",
    href: "https://africafintechsummit.com/events/africa-fintech-summit-kigali-2026/agenda",
  },
  {
    name: "Africa Tech Summit Nairobi 2027",
    dates: "Feb 10–11, 2027",
    format: "In-Person",
    location: "Nairobi, Kenya",
    description:
      "The 9th edition of East Africa's flagship tech and investment conference AI, climate tech, and startup tracks at the Sarit Expo Centre.",
    href: "https://www.africatechsummit.com/nairobi/",
  },
];

export function UpcomingConferences() {
  return (
    <Section
      eyebrow="Community & Events"
      title="Upcoming tech conferences in Eastern Africa"
      description="Publicly registrable events online and in-person across the region's tech, AI, drone, and fintech calendars."
      className="relative isolate overflow-hidden border-t border-slate-800/50"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image src={IMAGES.stargazingMilkyWay.src} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/60 to-space-void" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CONFERENCES.map((conf, i) => (
          <motion.a
            key={conf.name}
            href={conf.href}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="glass-panel glass-card-hover group flex flex-col p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-cyan">
                {conf.dates}
              </span>
              <span
                className={
                  conf.format === "Online"
                    ? "flex items-center gap-1 rounded-full border border-violet/30 bg-violet/10 px-2 py-0.5 text-[11px] font-medium text-violet"
                    : "flex items-center gap-1 rounded-full border border-emerald/30 bg-emerald/10 px-2 py-0.5 text-[11px] font-medium text-emerald"
                }
              >
                {conf.format}
              </span>
            </div>

            <h3 className="font-semibold text-slate-100">{conf.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">{conf.location}</p>
            <p className="mt-3 flex-1 text-sm text-slate-400">{conf.description}</p>

            <span className="mt-4 flex items-center gap-1 text-sm font-medium text-cyan opacity-0 transition-opacity group-hover:opacity-100">
              Event details
            </span>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}
