"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IMAGES } from "@/lib/images";

const ASTROTOURISM = [
  {
    image: IMAGES.stargazingMilkyWay,
    title: "Stargazing Expeditions",
    description: "Guided multi-night dark-sky astronomy trips.",
    price: "From $1,240",
  },
  {
    image: IMAGES.rocketLaunchViewing,
    title: "Rocket Launch Viewing Tours",
    description: "Access to the Kenya Spaceport launch viewing gallery.",
    price: "From $2,890",
  },
  {
    image: IMAGES.savannaLandscape,
    title: "Dark-Sky Reserve Access",
    description: "Extended reserve stays for astrophotography groups.",
    price: "From $980",
  },
];

export function AstrotourismPackages() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {ASTROTOURISM.map((pkg, i) => (
        <motion.div
          key={pkg.title}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
        >
          <Card className="glass-card-hover group h-full overflow-hidden p-0">
            <div className="glass-media-frame relative h-40 w-full">
              <Image
                src={pkg.image.src}
                alt={pkg.image.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <CardHeader>
              <CardTitle>{pkg.title}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="emerald">{pkg.price}</Badge>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
