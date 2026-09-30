"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` as soon as its module is evaluated, so the real
// AssetTelemetryMap implementation must never be imported during the server
// render pass ssr: false guarantees the browser is the only place that
// happens. (executive/dashboard/page.tsx is a Server Component, so this
// indirection is what makes ssr: false legal to use at all.)
export const AssetTelemetryMapLoader = dynamic(
  () => import("./AssetTelemetryMap").then((m) => m.AssetTelemetryMap),
  {
    ssr: false,
    loading: () => <div className="h-[420px] animate-pulse rounded-lg border border-slate-800 bg-black/40" />,
  }
);
