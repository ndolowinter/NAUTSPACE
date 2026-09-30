import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "border-cyan/30 bg-cyan/10 text-cyan",
        violet: "border-violet/30 bg-violet/10 text-violet",
        emerald: "border-emerald/30 bg-emerald/10 text-emerald",
        amber: "border-amber/30 bg-amber/10 text-amber-soft",
        neutral: "border-slate-700 bg-slate-800/50 text-slate-300",
        danger: "border-red-500/30 bg-red-500/10 text-red-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Use dark-on-white colors for the "neutral" variant on light backgrounds. */
  light?: boolean;
}

export function Badge({ className, variant, light, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        badgeVariants({ variant, className }),
        light && (variant ?? "default") === "neutral" && "border-slate-200 bg-slate-100 text-slate-600"
      )}
      {...props}
    />
  );
}
