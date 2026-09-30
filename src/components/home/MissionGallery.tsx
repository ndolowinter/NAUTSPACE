"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { IMAGES } from "@/lib/images";

const FRAMES = [
  { image: IMAGES.savannaLandscape, caption: "Equatorial launch corridor, Rift Valley" },
  { image: IMAGES.aerospaceMuseumDish, caption: "Restored tracking dish, National Science Center" },
  { image: IMAGES.wildlifeGiraffe, caption: "Conservation-zone UAV patrol grounds" },
  { image: IMAGES.aerospaceMuseumExhibit, caption: "Flight-heritage exhibit, Nairobi" },
];

export function MissionGallery() {
  return (
    <Section
      eyebrow="Emerging Field & Facilities"
      title="Across the continent from savanna to mission control"
      description="A glimpse of the terrain, hardware, and heritage sites behind NautSpace International's operations."
      className="relative isolate overflow-hidden border-t border-slate-800/50"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image src={IMAGES.heroRocketLaunch.src} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/55 to-space-void" />

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {FRAMES.map((frame, i) => (
          <motion.div
            key={frame.caption}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-700/50 sm:aspect-[4/5]"
          >
            <Image
              src={frame.image.src}
              alt={frame.image.alt}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
            <div className="absolute inset-0 opacity-0 ring-1 ring-inset ring-amber/40 transition-opacity duration-300 group-hover:opacity-100" />
            <p className="absolute inset-x-0 bottom-0 p-3 text-xs font-medium text-slate-200">
              {frame.caption}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
