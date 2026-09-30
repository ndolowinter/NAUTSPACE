import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "NAUTSPACE HORIZON",
  description: "NautSpace International programs are hosted under Products & Services.",
};

export default function PilotPage() {
  redirect("/services");
}
