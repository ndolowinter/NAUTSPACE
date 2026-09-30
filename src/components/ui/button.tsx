import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-cyan text-space-void hover:bg-cyan/90 shadow-glow",
        outline:
          "border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800/50 hover:border-cyan/50",
        ghost: "text-slate-300 hover:bg-slate-800/50 hover:text-white",
        violet: "bg-violet text-white hover:bg-violet/90 shadow-glow-violet",
        destructive: "bg-red-600 text-white hover:bg-red-500",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Use dark-on-white colors for the "outline"/"ghost" variants on light backgrounds. */
  light?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, light, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant, size, className }),
        light &&
          (variant === "outline"
            ? "border-slate-300 bg-white text-slate-700 hover:border-cyan/50 hover:bg-slate-50"
            : variant === "ghost"
              ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              : undefined)
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
