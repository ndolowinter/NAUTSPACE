"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  children: React.ReactNode;
}) {
  return <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>{children}</DialogContext.Provider>;
}

function getFocusable(container: HTMLElement) {
  const selectors = [
    'a[href]',
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");
  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter((el) => !el.hasAttribute("disabled"));
}

export function DialogContent({
  className,
  children,
  ariaLabel,
}: {
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(DialogContext);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!ctx) return;

    const el = contentRef.current;
    if (!el) return;

    const focusables = getFocusable(el);
    (focusables[0] ?? el).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        ctx.setOpen(false);
        return;
      }

      if (e.key !== "Tab") return;
      const focusablesNow = getFocusable(el);
      if (!focusablesNow.length) return;

      const first = focusablesNow[0]!;
      const last = focusablesNow[focusablesNow.length - 1]!;
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [ctx]);

  if (!ctx) throw new Error("DialogContent must be used within Dialog");
  if (!ctx.open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) ctx.setOpen(false);
        }}
      />
      <div className="relative mx-auto flex min-h-full w-full items-center justify-center p-4">
        <div
          ref={contentRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className={cn("w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-950/95 shadow-2xl", className)}
        >
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}

