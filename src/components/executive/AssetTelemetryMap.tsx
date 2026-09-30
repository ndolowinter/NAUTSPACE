"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";

const ESRI_DARK_BASE =
  "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const ESRI_DARK_REFERENCE =
  "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}";

interface Asset {
  id: string;
  type: "satellite" | "maritime" | "uav";
  label: string;
  lat: number;
  lng: number;
  status: "nominal" | "degraded" | "offline";
}

const BASE_ASSETS: Asset[] = [
  { id: "sat-01", type: "satellite", label: "NautSpace International-SAT-01", lat: -3.0, lng: 40.2, status: "nominal" },
  { id: "sat-02", type: "satellite", label: "NautSpace International-SAT-02", lat: 5.1, lng: 41.7, status: "nominal" },
  { id: "mar-01", type: "maritime", label: "Coastal Patrol Buoy 4", lat: -4.05, lng: 39.66, status: "degraded" },
  { id: "uav-01", type: "uav", label: "Border UAV Corridor North", lat: 3.5, lng: 35.9, status: "nominal" },
  { id: "uav-02", type: "uav", label: "Border UAV Corridor South", lat: -1.9, lng: 34.1, status: "offline" },
];

const STATUS_COLOR: Record<Asset["status"], string> = {
  nominal: "#10B981",
  degraded: "#F59E0B",
  offline: "#EF4444",
};

function assetIcon(asset: Asset) {
  const color = STATUS_COLOR[asset.status];
  const html = renderToStaticMarkup(
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: 9999,
        border: `1px solid ${color}`,
        background: color,
      }}
    />
  );
  return divIcon({ className: "", html, iconSize: [16, 16], iconAnchor: [8, 8] });
}

// This module is only ever loaded client-side, via AssetTelemetryMapLoader's
// next/dynamic(..., { ssr: false }) see the comment there for why.
export function AssetTelemetryMap() {
  const [assets, setAssets] = useState(BASE_ASSETS);

  useEffect(() => {
    const id = setInterval(() => {
      setAssets((prev) =>
        prev.map((a) => ({
          ...a,
          lat: a.lat + (Math.random() - 0.5) * 0.05,
          lng: a.lng + (Math.random() - 0.5) * 0.05,
        }))
      );
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-[420px] overflow-hidden rounded-lg border border-slate-800">
      <MapContainer
        center={[0, 38]}
        zoom={4}
        zoomControl={false}
        style={{ width: "100%", height: "100%", background: "#0B1220" }}
      >
        <ZoomControl position="topright" />
        <TileLayer url={ESRI_DARK_BASE} attribution="Tiles &copy; Esri" />
        <TileLayer url={ESRI_DARK_REFERENCE} />
        {assets.map((asset) => (
          <Marker
            key={asset.id}
            position={[asset.lat, asset.lng]}
            icon={assetIcon(asset)}
            title={`${asset.label} ${asset.status}`}
          />
        ))}
      </MapContainer>
    </div>
  );
}
