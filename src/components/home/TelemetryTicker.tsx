"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface TelemetryReading {
  label: string;
  value: string;
}

// Mock live-feed baseline. In production this streams from the satellite
// telemetry ingest API; kept static here with light client-side jitter so
// the ticker reads as "live" without a backend dependency.
const BASE_READINGS: TelemetryReading[] = [
  { label: "NAUTSPACE-SAT-01 ALT", value: "512.4 km" },
  { label: "NAUTSPACE-SAT-01 VEL", value: "7.61 km/s" },
  { label: "SOLAR FLUX (F10.7)", value: "138 sfu" },
  { label: "MALINDI GROUND STN", value: "LOCKED" },
  { label: "UAV FLEET ACTIVE", value: "14 / 16" },
  { label: "CLIMATE SENSOR NET", value: "NOMINAL" },
  { label: "KENYA SPACEPORT T-MINUS", value: "NEXT WINDOW 09:14:22" },
];

function jitter(value: string) {
  // Match only the leading number (e.g. "512.4" out of "512.4 km") the
  // previous version derived the toFixed() digit count from everything
  // after the first ".", including trailing unit text. Since each tick
  // replaced the number with a longer toFixed() string, that "digit count"
  // grew a little every 2.5s and eventually exceeded toFixed()'s 0–100
  // range, throwing a RangeError after a couple of minutes on the page.
  const match = value.match(/^(-?\d+(?:\.(\d+))?)(.*)$/);
  if (!match) return value;
  const [, numStr, decimals, rest] = match;
  // Group 1 is a required (non-optional) capture in the pattern above, so
  // it's always present when `match` is non-null noUncheckedIndexedAccess
  // just can't see that from RegExpMatchArray's type.
  const num = parseFloat(numStr!);
  const digits = Math.min(decimals?.length ?? 0, 4);
  const delta = (Math.random() - 0.5) * (num * 0.004);
  return `${(num + delta).toFixed(digits)}${rest}`;
}

export function TelemetryTicker() {
  const [readings, setReadings] = useState(BASE_READINGS);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!isVisible) return;
    const id = setInterval(() => {
      setReadings((prev) =>
        prev.map((r) => (r.value.match(/^\d/) ? { ...r, value: jitter(r.value) } : r))
      );
    }, 2500);
    return () => clearInterval(id);
  }, [prefersReducedMotion, isVisible]);

  const loop = [...readings, ...readings];

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden border-y border-slate-800/50 bg-slate-950/60 py-3"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald/5 via-transparent to-amber/5" />
      <div className="relative flex flex-col gap-2 overflow-hidden px-1 sm:px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald">
            Live Telemetry
          </span>
        </div>
        <div className="flex min-w-full shrink-0 animate-drift gap-10 whitespace-nowrap">
          {loop.map((r, i) => (
            <span key={`${r.label}-${i}`} className="telemetry-mono">
              {r.label} <span className="text-slate-500">·</span>{" "}
              <span
                className={r.label.includes("SPACEPORT") ? "text-amber-soft" : "text-slate-200"}
              >
                {r.value}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
