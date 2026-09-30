import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "NAUTSPACE HORIZON",
  description: "NautSpace International events and science center visits.",
};

export default function ScienceCentersPage() {
  redirect("/events");
}
