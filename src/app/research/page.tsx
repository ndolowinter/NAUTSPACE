import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GISRealityCapture } from "@/components/research/GISRealityCapture";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "NAUTSPACE HORIZON",
  description:
    "NautSpace International declassified research papers, open-source repositories, and technical specifications.",
};

const PAPERS = [
  {
    title: "Equatorial Launch Corridor Trajectory Optimization",
    tag: "Propulsion",
    year: "2024",
    summary: "Declassified analysis of low-inclination launch windows from the Kenya Spaceport corridor.",
  },
  {
    title: "CubeSat Attitude Determination on Constrained Compute",
    tag: "Satellite Systems",
    year: "2023",
    summary: "Extended Kalman filter tuning for 3U CubeSat buses under strict power budgets.",
  },
];

const REPOS = [
  { name: "osai/cubesat-flight-software", description: "Reference flight software for 1U/3U CubeSat buses.", stars: "412" },
  { name: "osai/spectrum-sim", description: "RF interference and spectrum-occupancy simulation toolkit.", stars: "198" },
  { name: "osai/uav-swarm-mesh", description: "Resilient mesh networking layer for autonomous UAV fleets.", stars: "276" },
];

const SPECS = [
  { title: "Secure UAV Flight Controls", description: "Encrypted command-and-control link with hardware-rooted key attestation." },
  { title: "CubeSat Bus Architecture", description: "Modular 1U/3U/6U bus specification with standardized payload interface." },
  { title: "Rocket Propulsion Roadmap", description: "Staged development plan from sounding rockets to orbital-class vehicles." },
  { title: "Ground Segment Hardening", description: "Zero-trust architecture for ground station command infrastructure." },
];

export default function ResearchPage() {
  return (
    <>
      <Section
        eyebrow="Open Source"
        title="GitHub repository integrations"
        className="relative isolate overflow-hidden border-t border-slate-800/50"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.forestCanopyAerial.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/60 to-space-void" />

        <div className="grid gap-4 sm:grid-cols-3">
          {REPOS.map((repo) => (
            <a
              key={repo.name}
              href={`https://github.com/${repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="glass-panel block p-5 transition-colors hover:border-cyan/40"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-sm text-slate-200">{repo.name}</span>
              </div>
              <p className="text-sm text-slate-400">{repo.description}</p>
              <p className="mt-3 text-xs text-slate-500">★ {repo.stars}</p>
            </a>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="NautSpace Interational Community"
        title="Public research papers & technical dossiers"
        description="Cleared-for-release excerpts from NautSpace International's research program full datasets available to verified partners."
        className="relative isolate overflow-hidden border-t border-slate-800/50"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.earthCityLights.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/55 to-space-void" />

        <div className="grid gap-6 md:grid-cols-2">
          {PAPERS.map((paper) => (
            <Card key={paper.title}>
              <CardHeader>
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="neutral">{paper.tag}</Badge>
                  <Badge variant="neutral">{paper.year}</Badge>
                </div>
                <CardTitle>{paper.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{paper.summary}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="GIS Mapping & 3D Reality Capture"
        title="From drone flight to photorealistic reconstruction"
        description="Gaussian Splatting and photogrammetry pipelines that turn UAV imagery into navigable 3D terrain, infrastructure, and conservation-zone reconstructions."
        className="relative isolate overflow-hidden border-t border-slate-800/50"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.riftValleyEscarpment.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/60 to-space-void" />

        <GISRealityCapture />
      </Section>

      <Section
        eyebrow="Technical Specifications"
        title="Secure systems, by design"
        className="relative isolate overflow-hidden border-t border-slate-800/50"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={IMAGES.cargoShipNight.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/60 to-space-void" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SPECS.map((spec) => (
            <Card key={spec.title}>
              <CardHeader>
                <CardTitle className="text-base">{spec.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{spec.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
