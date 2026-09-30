import * as React from "react";
import { cn } from "@/lib/utils";

const LIGHT_FIELD =
  "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan/40";

interface LightProp {
  light?: boolean;
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & LightProp
>(({ className, light, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 disabled:cursor-not-allowed disabled:opacity-50",
      light && LIGHT_FIELD,
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & LightProp
>(({ className, light, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-24 w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 disabled:cursor-not-allowed disabled:opacity-50",
      light && LIGHT_FIELD,
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & LightProp
>(({ className, light, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50",
      light && LIGHT_FIELD,
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export function Label({
  className,
  light,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & LightProp) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-sm font-medium",
        light ? "text-slate-700" : "text-slate-300",
        className
      )}
      {...props}
    />
  );
}
