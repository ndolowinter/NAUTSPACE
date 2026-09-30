"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (next: string) => void;
  baseId: string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function sanitizeIdPart(part: string) {
  return part.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
}: {
  value?: string;
  defaultValue: string;
  onValueChange?: (next: string) => void;
  children: React.ReactNode;
}) {
  const baseId = React.useId();
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;

  const setValue = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value: current, setValue, baseId }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex items-center gap-2 rounded-lg border border-slate-800/60 p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({
  value,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");

  const triggerId = `${ctx.baseId}-${sanitizeIdPart(value)}-trigger`;
  const panelId = `${ctx.baseId}-${sanitizeIdPart(value)}-panel`;

  const isActive = ctx.value === value;

  return (
    <button
      id={triggerId}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      className={cn(
        "rounded-md px-3 py-2 text-sm transition-colors",
        isActive ? "border border-cyan/30 bg-cyan/10 text-cyan" : "text-slate-300 hover:bg-slate-800/40"
      )}
      onClick={() => ctx.setValue(value)}
      {...props}
    />
  );
}

export function TabsContent({
  value,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used within Tabs");

  const panelId = `${ctx.baseId}-${sanitizeIdPart(value)}-panel`;
  const triggerId = `${ctx.baseId}-${sanitizeIdPart(value)}-trigger`;

  const isActive = ctx.value === value;

  if (!isActive) return null;

  return (
    <div role="tabpanel" id={panelId} aria-labelledby={triggerId} className={cn("mt-4", className)} {...props} />
  );
}

