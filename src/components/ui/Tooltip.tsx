"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Tooltip({
  content,
  className,
  children,
}: {
  content: React.ReactNode;
  className?: string;
  children: React.ReactElement;
}) {
  const id = React.useId();

  return (
    <span className="relative inline-flex group">
      {React.cloneElement(children, { "aria-describedby": id })}
      <span
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 top-[-0.4rem] z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 opacity-0 shadow-lg transition-opacity",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          className
        )}
      >
        {content}
      </span>
    </span>
  );
}

