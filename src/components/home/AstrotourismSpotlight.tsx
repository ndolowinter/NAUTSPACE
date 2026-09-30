"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { IMAGES } from "@/lib/images";

const PACKAGES = [
  {
    image: IMAGES.stargazingMilkyWay,
    title: "Dark-Sky Stargazing Expeditions",
    location: "Chalbi Desert, Kenya",
    description:
      "Multi-night equatorial stargazing under some of Africa's darkest skies, guided by NautSpace International astronomers.",
  },
  {
    image: IMAGES.mistyHighlands,
    title: "Radio-Silent Highlands Retreat",
    location: "Northern Highlands, Kenya",
    description:
      "Off-grid observation camps in designated radio-quiet zones, free of interference ideal for both naked-eye astronomy and amateur radio astronomy.",
  },
  {
    image: IMAGES.riftValleyEscarpment,
    title: "Rift Valley Hills & Escarpment Sky Camp",
    location: "Great Rift Valley, Kenya",
    description:
      "Ridge-top and valley-floor observation sites along the Rift, pairing dramatic elevation views with clear, low-humidity night skies.",
  },
  {
    image: IMAGES.rocketLaunchViewing,
    title: "Kenya Spaceport Launch Viewing",
    location: "Malindi, Kenya",
    description:
      "Front-row access to CubeSat and sounding-rocket launches from the Kenya Spaceport corridor.",
  },
  {
    image: IMAGES.indianOceanNight,
    title: "Indian Ocean Night Sail & Stargazing",
    location: "Watamu & Lamu Coast, Kenya",
    description:
      "Overnight dhow sailing along the coast, tracking constellations and satellite passes over open water, far from shoreline light pollution.",
  },
  {
    image: IMAGES.equatorialSafari,
    title: "Equatorial Space Safari",
    location: "Amboseli & Broglio Space Center",
    description:
      "Combine a classic wildlife safari with orbital tracking sessions and mission control tours.",
  },
];

export function AstrotourismSpotlight() {
  return (
    <Section
      eyebrow="Astrotourism & Space Safari"
      title="Aerospace Discovery in Africa"
      description="From desert dark-sky reserves to Rift Valley ridgelines to open ocean NautSpace International runs guided astrotourism across Kenya's full range of terrain."
      className="relative isolate overflow-hidden border-t border-slate-800/50"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image src={IMAGES.savannaLandscape.src} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/60 to-space-void" />

      <div className="grid gap-6 md:grid-cols-3">
        {PACKAGES.map((pkg, i) => (
          <motion.div
            key={pkg.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
          >
            <div className="glass-panel glass-card-hover group h-full overflow-hidden p-0">
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={pkg.image.src}
                  alt={pkg.image.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-slate-100">{pkg.title}</h3>
                <p className="text-sm text-slate-500">{pkg.location}</p>
                <p className="mt-3 text-sm text-slate-400">{pkg.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
