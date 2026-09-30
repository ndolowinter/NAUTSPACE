"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Public demo videos from ArcGIS/Esri and the Gaussian Splatting community
// referenced here (via YouTube's standard embed) as illustrative context for
// NautSpace International's drone-to-3D-reality-mesh pipeline, not NautSpace-produced footage.
const VIDEOS = [
  {
    youtubeId: "Ym9H03hdfgs",
    title: "Gaussian Splats in ArcGIS",
    tag: "Photorealistic GIS Layers",
    description: "Drone imagery converted directly into a photorealistic Gaussian-splat layer inside a GIS workflow.",
  },
  {
    youtubeId: "NClMoP3dhHs",
    title: "Drone Imagery → Digital Twin",
    tag: "Digital Twins",
    description: "Gaussian splatting turning raw drone capture into a navigable photorealistic digital twin.",
  },
  {
    youtubeId: "mQ4EHUpXj9Q",
    title: "3D Gaussian Splatting Pipeline",
    tag: "Capture → Reconstruction",
    description: "End-to-end walkthrough of building a 3D Gaussian Splatting reconstruction from drone video.",
  },
];

export function GISRealityCapture() {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Badge variant="violet">Reality Capture</Badge>
        <p className="text-sm text-slate-400">
          NautSpace International&apos;s UAV fleet feeds captured imagery into a Gaussian Splatting / photogrammetry
          pipeline to produce photorealistic 3D reconstructions for terrain, infrastructure, and
          conservation-zone mapping.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {VIDEOS.map((video, i) => (
          <motion.div
            key={video.youtubeId}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
          >
            <Card className="glass-card-hover h-full overflow-hidden p-0">
              <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-black">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="neutral">{video.tag}</Badge>
                </div>
                <CardTitle className="text-base">{video.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{video.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
