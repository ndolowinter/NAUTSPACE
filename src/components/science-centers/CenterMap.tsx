"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ScienceCenter } from "@/lib/types/database";

// Esri's classic ArcGIS Online basemap REST tiles public, free, and keyless
// (no NEXT_PUBLIC_MAPBOX_TOKEN-style setup required). Base + reference layers
// together reproduce Esri's "Dark Gray Canvas" basemap.
const ESRI_DARK_BASE =
  "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const ESRI_DARK_REFERENCE =
  "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}";

const pinIcon = divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#06B6D4;border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 10px 2px rgba(6,182,212,0.8);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// This module is only ever loaded client-side, via CenterMapLoader's
// next/dynamic(..., { ssr: false }) merely *importing* leaflet touches
// `window` at module-evaluation time, which crashes if Next.js evaluates
// this file during the server render pass, so it must never be imported
// directly from a page/layout.
export function CenterMap({ centers }: { centers: ScienceCenter[] }) {
  const initialCenter = useMemo<[number, number]>(
    () => [centers[0]?.lat ?? -1.3, centers[0]?.lng ?? 37.9],
    [centers]
  );

  return (
    <div className="glass-panel h-[480px] overflow-hidden">
      <MapContainer
        center={initialCenter}
        zoom={3}
        zoomControl={false}
        style={{ width: "100%", height: "100%", background: "#0B1220" }}
      >
        <ZoomControl position="topright" />
        <TileLayer url={ESRI_DARK_BASE} attribution="Tiles &copy; Esri" />
        <TileLayer url={ESRI_DARK_REFERENCE} />
        {centers.map((center) => (
          <Marker key={center.id} position={[center.lat, center.lng]} icon={pinIcon}>
            <Popup>
              <div className="max-w-[220px]">
                <p className="font-semibold text-space-void">{center.name}</p>
                <p className="text-xs text-slate-600">
                  {center.city}, {center.country}
                </p>
                {center.description && <p className="mt-1 text-xs text-slate-700">{center.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
