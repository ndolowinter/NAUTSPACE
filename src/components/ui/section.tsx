import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Use dark-on-white text colors for sections placed on a light background. */
  light?: boolean;
}

export function Section({
  eyebrow,
  title,
  description,
  light,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("relative py-20 sm:py-28", className)} {...props}>
      <div className="container">
        {(eyebrow || title || description) && (
          <div className="mx-auto mb-14 max-w-2xl text-center">
            {eyebrow && (
              <p
                className={cn(
                  "mb-3 text-xs font-semibold uppercase tracking-[0.2em]",
                  light ? "text-cyan-700" : "text-cyan"
                )}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className={cn(
                  "text-3xl font-bold sm:text-4xl",
                  light ? "text-slate-900" : "text-slate-50"
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className={cn("mt-4", light ? "text-slate-600" : "text-slate-400")}>
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
