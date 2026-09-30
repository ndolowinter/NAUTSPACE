"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { createClient } from "@/lib/supabase/client";
import { ProfileMenu } from "@/components/layout/ProfileMenu";

const NAV_LINKS = [
  { href: "/events", label: "Events" },
  { href: "/services", label: "Products & Services" },
  { href: "/research", label: "Research" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ initialUserId }: { initialUserId: string | null }) {
  const [open, setOpen] = useState(false);
  const { user, loading } = useSupabaseUser(initialUserId);
  const router = useRouter();
  const pathname = usePathname();

  const mobilePanelId = "mobile-nav-panel";
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Supabase not configured nothing to sign out of.
    }
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    // Focus first interactive element inside the open menu.
    const focusables = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        toggleButtonRef.current?.focus();
        return;
      }

      if (e.key !== "Tab") return;
      if (!first || !last) return;

      const active = document.activeElement as HTMLElement | null;

      // Trap focus inside the panel while it's open.
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/40 bg-space-void/60 shadow-lg shadow-black/20 backdrop-blur-xl">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-50">
          <span>
            NautSpace International
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition-colors hover:text-cyan"
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
                aria-current={pathname?.startsWith("/dashboard") ? "page" : undefined}
              >
                Dashboard
              </Link>
              <ProfileMenu userId={user.id} />
              <button
                onClick={signOut}
                className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "gap-1.5")}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/login" className={cn(buttonVariants({ size: "sm" }))}>
              Sign In
            </Link>
          )}
        </div>

        <button
          className="p-2 text-sm font-medium text-slate-300 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls={mobilePanelId}
          id="mobile-nav-toggle"
          ref={toggleButtonRef}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div
          id={mobilePanelId}
          role="navigation"
          aria-label="Mobile navigation"
          ref={panelRef}
          className="border-t border-slate-800/50 bg-space-void/95 lg:hidden"
        >
          <div className="container flex flex-col gap-4 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-300 hover:text-cyan"
                onClick={() => setOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            {!loading && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-cyan"
                  onClick={() => setOpen(false)}
                  aria-current={pathname?.startsWith("/dashboard") ? "page" : undefined}
                >
                  Dashboard →
                </Link>
                <button onClick={signOut} className="text-left text-sm font-medium text-slate-300">
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm font-medium text-cyan"
                onClick={() => setOpen(false)}
              >
                Sign In →
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
