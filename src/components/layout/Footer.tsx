import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/lib/images";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Footer({ showAdminPanel }: { showAdminPanel: boolean }) {
  return (
    <footer className="relative overflow-hidden border-t border-slate-800/50 bg-space-void">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <Image src={IMAGES.earthCityLights.src} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-space-void via-space-void/95 to-space-void" />

      <div className="container relative grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-semibold text-slate-50">NautSpace International</p>
          <p className="mt-3 text-sm text-slate-400">
            A Space Exploration in Africa initiative. Kenya headquartered, serving Africa
            and global strategic partners in space systems, astrotourism, and defense innovation.
          </p>
        </div>

        <FooterColumn
          title="Research"
          links={[
            { href: "/services", label: "Products & Services" },
            { href: "/events", label: "Events" },
            { href: "/contact", label: "Contact" },
            { href: "/research", label: "Research" },
          ]}
        />

        <FooterColumn
          title="Company"
          links={[
            { href: "/contact", label: "Partnerships" },
            { href: "/auth/login", label: "Sign In" },
          ]}
        />

        <div className="glass-panel p-4">
          <p className="text-sm font-semibold text-slate-200">Headquarters</p>
          <p className="mt-3 text-sm text-slate-400">
            Nairobi, Kenya
            <br />
            nautspaceinternational.org
            <br />
            Tel:{" "}
            <a href="tel:+254116878279" className="hover:text-cyan">
              +254 116878279
            </a>
          </p>
        </div>
      </div>

      <div className="relative border-t border-slate-800/50 py-6">
        <div className="container flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Space Exploration in Africa. All rights reserved.
          </p>
          {showAdminPanel && (
            <Link
              href="/admin"
              className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-slate-400 hover:text-cyan">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
