import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "NAUTSPACE HORIZON",
  description: "NautSpace International opportunities and Academy programs.",
};

export default function CareersPage() {
  redirect("/services");
}
