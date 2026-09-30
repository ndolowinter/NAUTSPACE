"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Section } from "@/components/ui/section";
import { IMAGES } from "@/lib/images";

const STREAMS = [
  {
    youtubeId: "uwXgcTc8oY8",
    title: "ISS Live: Earth from Orbit",
    source: "NASA Official Stream",
  },
  {
    youtubeId: "cOmmvhDQ2HM",
    title: "Rocket R&D: 24/7 Engine Test Stand",
    source: "NASASpaceflight McGregor, Texas",
  },
  {
    youtubeId: "P11y8N22Rq0",
    title: "Global Launch & Mission Coverage",
    source: "NASA TV Official Media Channel",
  },
];

export function LiveNow() {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  return (
    <Section
      eyebrow="Live Right Now"
      title="Watch space happen in real time"
      description="Live feeds from orbit and from the ground the International Space Station, active rocket R&D test stands, and worldwide launch coverage."
      className="relative isolate overflow-hidden border-t border-slate-800/50"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image src={IMAGES.earthCityLights.src} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/55 to-space-void" />

      <div className="grid gap-6 lg:grid-cols-3">
        {STREAMS.map((stream, i) => (
          <motion.div
            key={stream.youtubeId}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
            className="glass-panel glass-card-hover overflow-hidden p-0"
          >
            <div className="relative aspect-video w-full bg-black">
              <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
              </span>
              {loaded[stream.youtubeId] ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${stream.youtubeId}?autoplay=0&mute=1`}
                  title={stream.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setLoaded((prev) => ({ ...prev, [stream.youtubeId]: true }))}
                  aria-label={`Load video: ${stream.title}`}
                  className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/20 outline-none hover:bg-black/30"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${stream.youtubeId}/hqdefault.jpg`}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50" />
                  <span className="relative inline-flex items-center gap-2 rounded-full bg-space-void/80 px-4 py-2 text-sm font-semibold text-slate-50 shadow-lg">
                    Click to load video
                  </span>
                </button>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-100">{stream.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{stream.source}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
