import { Hero } from "@/components/home/Hero";
import { TelemetryTicker } from "@/components/home/TelemetryTicker";
import { LiveNow } from "@/components/home/LiveNow";
import { IntelligencePlatforms } from "@/components/home/IntelligencePlatforms";
import { AstrotourismSpotlight } from "@/components/home/AstrotourismSpotlight";
import { MissionGallery } from "@/components/home/MissionGallery";
import { PioneersDossier } from "@/components/home/PioneersDossier";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TelemetryTicker />
      <LiveNow />
      <IntelligencePlatforms />
      <AstrotourismSpotlight />
      <MissionGallery />
      <PioneersDossier />
    </>
  );
}
