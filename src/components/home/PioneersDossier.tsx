"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { IMAGES } from "@/lib/images";

const DOSSIER_ENTRIES = [
  {
    year: "1970s",
    title: "San Marco Equatorial Range",
    summary:
      "Kenya's Broglio Space Center hosted the San Marco platform off Malindi one of the earliest equatorial orbital launch sites in the world.",
    tag: "Launch Heritage",
  },
  {
    year: "2018",
    title: "First Kenyan-built CubeSat",
    summary:
      "University of Nairobi engineering teams delivered 1KUNS-PF, Kenya's first indigenously developed satellite, deployed from the ISS.",
    tag: "Satellite Milestone",
  },
  {
    year: "2019",
    title: "Kenya Space Agency Established",
    summary:
      "National coordination body formed to unify civilian, research, and commercial space activity across the country.",
    tag: "Policy",
  },
  {
    year: "2023",
    title: "Pan-African Earth Observation Network",
    summary:
      "Cross-border CubeSat constellation initiative for agricultural and climate monitoring across East Africa.",
    tag: "Collaboration",
  },
  {
    year: "2026",
    title: "ClimCam to the ISS: Egypt, Kenya, and Uganda Partner with UNOOSA and Airbus",
    summary:
      "ClimCam, an AI-enabled Earth observation instrument developed by Kenya Space Agency, Egypt Space Agency, and Uganda's space program, was launched on Cygnus NG-24 and is expected to operate on the Airbus Bartolomeo platform on the ISS for near real-time climate and environmental data across Eastern Africa, starting later in 2026.",
    tag: "Climate Resilience",
  },
];

export function PioneersDossier() {
  return (
    <Section
      eyebrow="Declassified Dossier"
      title="African Aerospace Pioneers & Missions"
      description="Publicly declassified highlights celebrating African leadership across five decades of space history."
      className="relative isolate overflow-hidden border-t border-slate-800/50"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]">
        <Image src={IMAGES.savannaLandscape.src} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/90 to-space-void" />

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-cyan/60 via-violet/40 to-amber/60 sm:left-1/2" />
        <div className="space-y-10">
          {DOSSIER_ENTRIES.map((entry, i) => {
            const fromRight = i % 2 === 1;
            const dotColor = i % 2 === 0 ? "bg-cyan shadow-glow" : "bg-amber shadow-glow-amber";
            return (
              <motion.div
                key={entry.title}
                initial={{ opacity: 0, x: fromRight ? 32 : -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`relative flex flex-col gap-3 sm:flex-row ${
                  fromRight ? "sm:flex-row-reverse sm:text-right" : ""
                }`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className={`absolute left-4 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full sm:left-1/2 ${dotColor}`}
                />
                <div className="glass-panel glass-card-hover ml-10 flex-1 p-5 sm:ml-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="neutral">{entry.year}</Badge>
                    <Badge>{entry.tag}</Badge>
                  </div>
                  <h3 className="font-semibold text-slate-100">{entry.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{entry.summary}</p>
                </div>
                <div className="hidden flex-1 sm:block" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
