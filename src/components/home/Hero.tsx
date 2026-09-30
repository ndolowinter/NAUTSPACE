"use client";

import { motion, AnimatePresence, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SCENES = [
  { src: "/videos/hero-launch.mp4", label: "Orbital Launch" },
  { src: "/videos/hero-savanna.mp4", label: "Equatorial Savanna" },
  { src: "/videos/hero-nightsky.mp4", label: "Dark-Sky Reserve" },
];

const SCENE_DURATION_MS = 9000;

function BackgroundVideo({ src }: { src: string }) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export function Hero() {
  const [sceneIndex, setSceneIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSceneIndex((i) => (i + 1) % SCENES.length);
    }, SCENE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={sceneIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <BackgroundVideo src={SCENES[sceneIndex]!.src} />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="container relative pb-16 pt-40 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <Badge variant="amber" className="mb-6">
            Space Exploration in Africa
          </Badge>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            <span className="text-gradient-aurora bg-[length:200%_auto] animate-[aurora-shift_6s_ease_infinite]">
              Space Exploration, Earth Observation
            </span>{" "}
            and Autonomous Intelligence Platforms
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-200">
            NautSpace International unites CubeSat intelligence, autonomous UAV operations, and equatorial
            astrotourism under one platform advancing African aerospace leadership from
            Nairobi to orbit.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/services"
              className={cn(buttonVariants({ size: "lg" }), "group shadow-glow hover:shadow-glow-amber transition-shadow")}
            >
              Explore Space Safaris
            </Link>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/20 pt-8">
            <Stat label="Active Missions" value={12} />
            <Stat label="Partner Nations" value={9} />
            <Stat label="CubeSats Deployed" value={27} />
          </dl>
        </motion.div>
      </div>

      {/* Scene indicator */}
      <div className="absolute bottom-6 right-6 z-10 hidden items-center gap-2 sm:flex">
        {SCENES.map((scene, i) => (
          <button
            key={scene.src}
            onClick={() => setSceneIndex(i)}
            aria-label={`Show ${scene.label} scene`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === sceneIndex ? "w-8 bg-amber-soft" : "w-4 bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, motionValue]);

  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-300">{label}</dt>
      <dd ref={ref} className="mt-1 text-2xl font-bold text-white">
        {display}
      </dd>
    </div>
  );
}
