"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types/database";

const NAV = [
  { href: "/executive/dashboard", label: "Intelligence Dashboard" },
  { href: "/executive/dao", label: "Hybrid DAO Governance" },
  { href: "/executive/contacts", label: "Secure Communications" },
];

export function ExecutiveShell({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#01040a] text-slate-200">
      <div className="flex items-center justify-between border-b border-red-500/20 bg-red-500/5 px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-red-400">
        <span className="flex items-center gap-2">Restricted Access Executive Portal</span>
        <span className="font-mono normal-case tracking-normal text-red-300/80">Role: {role}</span>
      </div>

      <div className="lg:hidden px-4 py-3">
        <details className="border-b border-slate-800/60">
          <summary className="cursor-pointer text-sm font-semibold text-red-200">Menu</summary>
          <nav className="mt-3 space-y-1" aria-label="Executive navigation">
            {NAV.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "border border-cyan/30 bg-cyan/10 text-cyan"
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
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "border border-cyan/30 bg-cyan/10 text-cyan"
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
