import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssetTelemetryMapLoader } from "@/components/executive/AssetTelemetryMapLoader";
import { StatCard } from "@/components/ui/StatCard";

export const metadata: Metadata = {
  title: "NAUTSPACE HORIZON",
};

const RISK_ITEMS = [
  { label: "UAV Corridor South link degradation", level: "high", detail: "Intermittent C2 link loss over the last 6h window." },
  { label: "Maritime Buoy 4 battery below threshold", level: "medium", detail: "Est. 36h remaining before autonomous shutdown." },
  { label: "NautSpace International-SAT-02 thermal margin nominal", level: "low", detail: "No action required." },
];

const RISK_STYLES: Record<string, string> = {
  high: "border-red-500/40 bg-red-500/10 text-red-300",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  low: "border-emerald/40 bg-emerald/10 text-emerald",
};

const DEPLOYMENTS = [
  { name: "Kenya Spaceport Launch Window Q3", status: "On Track" },
  { name: "Border UAV Fleet Expansion (Phase 2)", status: "In Progress" },
  { name: "NautSpace International-SAT-03 Integration", status: "Delayed" },
];

export default function ExecutiveDashboardPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Executive Intelligence Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Operational risk, deployment status, and live asset telemetry across all theaters.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assets Online" value="24 / 27" tone="emerald" />
        <StatCard label="Active Risk Flags" value="3" tone="amber" />
        <StatCard label="Mission Readiness" value="92%" tone="cyan" />
        <StatCard label="Compliance Status" value="Nominal" tone="emerald" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-slate-800 bg-black/30">
          <CardHeader>
            <CardTitle>Satellite & Maritime Asset Telemetry</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetTelemetryMapLoader />
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-black/30">
          <CardHeader>
            <CardTitle>Operational Risk Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {RISK_ITEMS.map((risk) => (
              <div key={risk.label} className={`rounded-md border p-3 text-sm ${RISK_STYLES[risk.level]}`}>
                <p className="font-medium">{risk.label}</p>
                <p className="mt-1 text-xs opacity-80">{risk.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-800 bg-black/30">
        <CardHeader>
          <CardTitle>Space Deployment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-800">
            {DEPLOYMENTS.map((d) => (
              <li key={d.name} className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-300">{d.name}</span>
                <Badge variant={d.status === "Delayed" ? "danger" : d.status === "On Track" ? "emerald" : "neutral"}>
                  {d.status}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
