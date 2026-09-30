"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IMAGES } from "@/lib/images";

const EXHIBITS = [
  {
    image: IMAGES.aerospaceMuseumExhibit,
    title: "Rocket Propulsion Gallery",
    description: "Full-scale sounding rocket and CubeSat launch vehicle mockups.",
  },
  {
    image: IMAGES.aerospaceMuseumDish,
    title: "Satellite & Payload Bay",
    description: "Hands-on CubeSat bus assemblies and payload integration exhibits.",
  },
  {
    image: IMAGES.militaryUav,
    title: "UAV & Avionics Systems",
    description: "Full-scale MQ-9 Reaper-class UAV mockup with flight-control and avionics history exhibits.",
  },
];

export function ExhibitGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {EXHIBITS.map((exhibit, i) => (
        <motion.div
          key={exhibit.title}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
        >
          <Card className="glass-card-hover group h-full overflow-hidden p-0">
            <div className="glass-media-frame relative h-36 w-full">
              <Image
                src={exhibit.image.src}
                alt={exhibit.image.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <CardHeader>
              <CardTitle>{exhibit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{exhibit.description}</CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
