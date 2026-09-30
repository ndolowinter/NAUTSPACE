import type { ApplicationTrack } from "@/lib/types/database";

export const APPLICATION_TRACK_LABELS: Record<ApplicationTrack, string> = {
  space_systems: "Space Systems",
  autonomous_uav: "Autonomous UAVs",
  ai_data_fusion: "AI Data Fusion",
  cybersecurity: "Cybersecurity",
  rf_engineering: "RF Engineering",
  astrotourism_management: "Astrotourism Management",
  pilot_license: "Pilot License",
  drone_mapping: "Drone Mapping & GIS",
  drone_building: "Drone Building & Fabrication",
  videography_photography: "Videography and Photography",
};

export const ACADEMY_TRACKS: ApplicationTrack[] = [
  "space_systems",
  "autonomous_uav",
  "ai_data_fusion",
  "cybersecurity",
  "rf_engineering",
  "astrotourism_management",
];

export const PILOT_TRACKS: ApplicationTrack[] = [
  "pilot_license",
  "drone_mapping",
  "drone_building",
  "videography_photography",
];
