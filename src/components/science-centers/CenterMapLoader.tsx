"use client";

import dynamic from "next/dynamic";
import type { ScienceCenter } from "@/lib/types/database";

// Leaflet touches `window` as soon as its module is evaluated, so the real
// CenterMap implementation must never be imported during the server render
// pass ssr: false guarantees the browser is the only place that happens.
const CenterMap = dynamic(() => import("./CenterMap").then((m) => m.CenterMap), {
  ssr: false,
  loading: () => <div className="glass-panel h-[480px] animate-pulse" />,
});

export function CenterMapLoader({ centers }: { centers: ScienceCenter[] }) {
  return <CenterMap centers={centers} />;
}
