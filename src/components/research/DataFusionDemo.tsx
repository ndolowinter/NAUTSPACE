"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SensorStream {
  key: string;
  label: string;
  color: string;
  value: number;
}

const INITIAL_STREAMS: SensorStream[] = [
  { key: "surveillance", label: "Surveillance", color: "#06B6D4", value: 62 },
  { key: "rf", label: "RF Interference", color: "#8B5CF6", value: 41 },
  { key: "spectrum", label: "Spectrum Monitoring", color: "#10B981", value: 78 },
];

function clamp(v: number, min = 5, max = 98) {
  return Math.min(max, Math.max(min, v));
}

export function DataFusionDemo() {
  const [streams, setStreams] = useState(INITIAL_STREAMS);

  useEffect(() => {
    const id = setInterval(() => {
      setStreams((prev) =>
        prev.map((s) => ({ ...s, value: clamp(s.value + (Math.random() - 0.5) * 14) }))
      );
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const fusedConfidence = Math.round(
    streams.reduce((sum, s) => sum + s.value, 0) / streams.length
  );

  return (
    <div className="glass-panel mx-auto max-w-4xl p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-5">
          {streams.map((stream) => (
            <div key={stream.key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-300">{stream.label}</span>
                <span className="font-mono text-slate-400">{Math.round(stream.value)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${stream.value}%`, backgroundColor: stream.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        <Card className="flex flex-col items-center justify-center gap-3 border-cyan/30 bg-cyan/5 p-8">
          <CardHeader className="p-0 text-center">
            <CardTitle className="text-sm font-medium uppercase tracking-widest text-cyan">
              Fused Confidence
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-center">
            <p className="text-5xl font-bold text-slate-50">{fusedConfidence}%</p>
            <p className="mt-2 text-xs text-slate-400">
              {fusedConfidence > 70
                ? "High-confidence anomaly correlation"
                : fusedConfidence > 40
                ? "Moderate correlation monitoring"
                : "Low correlation nominal"}
            </p>
          </CardContent>
        </Card>
      </div>
      <p className="mt-6 text-center text-xs text-slate-500">
        Simulated feed for demonstration purposes not connected to live sensor infrastructure.
      </p>
    </div>
  );
}
