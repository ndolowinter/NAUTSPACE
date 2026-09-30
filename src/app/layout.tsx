import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbitspacesafari.co.ke"),
  title: {
    default: "NAUTSPACE HORIZON",
    template: "NAUTSPACE HORIZON",
  },
  description:
    "NautSpace International is a Space Exploration in Africa platform for space systems, aerospace discovery, national science centers, and AI-driven aerospace intelligence, headquartered in Kenya.",
  keywords: [
    "Kenya Spaceport",
    "astrotourism",
    "CubeSat",
    "UAV operations",
    "space safari",
    "national science centers",
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  let initialUserId: string | null = null;
  let initialRole: string | null = null;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    initialUserId = user?.id ?? null;

    if (initialUserId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", initialUserId)
        .single();
      initialRole = profile?.role ?? null;
    }
  } catch {
    // If Supabase isn't configured, treat as signed-out and render public navigation.
    initialUserId = null;
    initialRole = null;
  }

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="starfield absolute inset-0 animate-twinkle opacity-[0.35]" />
          <div className="glow-blob -left-40 top-0 h-[32rem] w-[32rem] bg-cyan/10" />
          <div className="glow-blob -right-32 top-[45vh] h-[28rem] w-[28rem] bg-violet/10" />
          <div className="glow-blob -left-20 bottom-0 h-[30rem] w-[30rem] bg-amber/[0.07]" />
        </div>
        <Navbar initialUserId={initialUserId} />
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer showAdminPanel={initialRole === "admin"} />
      </body>
    </html>
  );
}
