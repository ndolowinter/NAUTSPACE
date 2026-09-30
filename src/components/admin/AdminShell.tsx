"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Admin Panel", exact: true },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/members", label: "Admin Members" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/opportunities", label: "Opportunities" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#01040a] text-slate-200">
      <div className="flex items-center justify-between border-b border-amber-500/20 bg-amber-500/5 px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-amber-400">
        <span className="flex items-center gap-2">Admin Panel Superuser Only</span>
        <Link href="/" className="font-mono normal-case tracking-normal text-amber-300/80 hover:underline">
          ← Back to site
        </Link>
      </div>

      <div className="lg:hidden px-4 py-3">
        <details className="border-b border-slate-800/60">
          <summary className="cursor-pointer text-sm font-semibold text-amber-200">Menu</summary>
          <nav className="mt-3 space-y-1" aria-label="Admin navigation">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </details>
      </div>

      <div className="flex">
        <aside className="hidden w-64 shrink-0 border-r border-slate-800/60 bg-black/40 p-4 lg:block">
          <nav className="space-y-1">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
