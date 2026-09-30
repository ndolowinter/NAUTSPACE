"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const GROUPS = {
  cubesat: [
    { title: "Agriculture Analytics", description: "Multispectral crop-health and yield-forecast payloads for smallholder and commercial farms." },
    { title: "Climate Intelligence", description: "Atmospheric and land-surface sensing for drought early-warning and carbon monitoring." },
    { title: "IoT Communications", description: "Low-bandwidth relay payloads for remote sensor networks across underserved regions." },
  ],
  drone: [
    { title: "Wildlife Protection", description: "Anti-poaching aerial patrols with thermal imaging over conservation zones." },
  ],
} as const;

export function ServiceGroupGrid({ group }: { group: keyof typeof GROUPS }) {
  const items = GROUPS[group];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
        >
          <Card className="glass-card-hover h-full">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
