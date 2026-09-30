"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  contentId: string;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const contentId = React.useId();

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = wrapperRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, wrapperRef, contentId }}>
      <div ref={wrapperRef} className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  className,
}: {
  children: React.ReactElement;
  className?: string;
}) {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

  return React.cloneElement(children, {
    className: cn(children.props.className, className),
    "aria-haspopup": "menu",
    "aria-expanded": ctx.open,
    "aria-controls": ctx.contentId,
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      ctx.setOpen(!ctx.open);
    },
  });
}

export function DropdownMenuContent({
  align = "end",
  className,
  children,
}: {
  align?: "start" | "end";
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error("DropdownMenuContent must be used within DropdownMenu");

  if (!ctx.open) return null;

  return (
    <div
      id={ctx.contentId}
      role="menu"
      className={cn(
        "absolute z-50 mt-2 min-w-[12rem] rounded-md border border-slate-700 bg-slate-950/90 p-1 shadow-xl",
        align === "end" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  onSelect,
  className,
  children,
}: {
  onSelect?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error("DropdownMenuItem must be used within DropdownMenu");

  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        "w-full rounded-sm px-3 py-2 text-left text-sm text-slate-200 transition-colors hover:bg-slate-800/60",
        className
      )}
      onClick={() => {
        onSelect?.();
        ctx.setOpen(false);
      }}
    >
      {children}
    </button>
  );
}

