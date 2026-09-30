import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "NAUTSPACE HORIZON",
  description:
    "Strategic partnership inquiries for defense agencies, universities, and venture partners encrypted submission with automated triage.",
};

export default function ContactPage() {
  return (
    <Section
      eyebrow="Contact & Partnerships"
      title="Strategic partner inquiries"
      className="relative isolate overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image src={IMAGES.cargoShipNight.src} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-space-void via-space-void/60 to-space-void" />

      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <p className="font-semibold text-slate-100">Headquarters</p>
            <p className="mt-1 text-sm text-slate-400">Nairobi, Kenya</p>
          </div>
          <div className="glass-panel p-6">
            <p className="font-semibold text-slate-100">Partnerships</p>
            <p className="mt-1 text-sm text-slate-400">partnerships@nautspaceinternational.co.ke</p>
          </div>
          <div className="glass-panel p-6">
            <p className="font-semibold text-slate-100">Classification handling</p>
            <p className="mt-1 text-sm text-slate-400">
              Inquiries are automatically triaged by partnership type and urgency, then routed to
              the correct desk defense, academic, or venture.
            </p>
          </div>
        </div>

        <InquiryForm />
      </div>
    </Section>
  );
}
