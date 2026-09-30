"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { IMAGES } from "@/lib/images";

const CAPABILITIES = [
  {
    tag: "LIDAR & Remote Sensing",
    title: "Canopy-Penetrating LIDAR for Underground & Understory Terrain",
    description:
      "Airborne LIDAR sees through dense forest canopy to map bare-earth terrain, understory structure, and buried features invisible to optical sensors.",
    image: IMAGES.forestCanopyAerial,
    youtubeId: "eNFNVSU6A24",
    videoCaption: "How LIDAR maps bare earth through trees",
  },
];

export function IntelligencePlatforms() {
  return (
    <Section
      eyebrow="Sensing & Autonomous Intelligence"
      title="Capabilities behind Earth observation and autonomous operations"
      description="From the seafloor to forest canopy to open water, NautSpace International's sensing stack pairs piloted and autonomous platforms with AI-driven analysis."
      className="relative isolate overflow-hidden border-t border-slate-800/50"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image src={IMAGES.militaryUav.src} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/55 to-space-void" />

      <div className="grid gap-8 lg:grid-cols-3">
        {CAPABILITIES.map((cap, i) => (
          <motion.div
            key={cap.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
            className="glass-panel glass-card-hover flex h-full flex-col overflow-hidden p-0"
          >
            <div className="relative h-40 w-full">
              <Image
                src={cap.image.src}
                alt={cap.image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="p-5 pb-0">
              <span className="mb-3 inline-block rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-slate-300 backdrop-blur-sm">
                {cap.tag}
              </span>
              <h3 className="font-semibold text-slate-100">{cap.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{cap.description}</p>
            </div>

            <div className="mt-4 px-5 pb-5">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${cap.youtubeId}`}
                  title={cap.videoCaption}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">{cap.videoCaption}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
