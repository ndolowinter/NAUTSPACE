"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToastItem = {
  id: string;
  message: string;
};

type ToastContextValue = {
  toasts: ToastItem[];
  toast: (message: string, opts?: { durationMs?: number }) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((message: string, opts?: { durationMs?: number }) => {
    const durationMs = opts?.durationMs ?? 4000;
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  return <ToastContext.Provider value={{ toasts, toast }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastViewport({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { toasts } = useToast();

  return (
    <div
      {...props}
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed right-4 top-4 z-[200] space-y-2",
        className
      )}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-md border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 shadow-xl"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

