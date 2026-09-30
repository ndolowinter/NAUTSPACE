import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  light = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { light?: boolean }) {
  return (
    <div
      className={cn(
        light
          ? "relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60"
          : "glass-panel",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-3", className)} {...props} />;
}

export function CardTitle({
  className,
  light = false,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { light?: boolean }) {
  return (
    <h3
      className={cn("text-lg font-semibold", light ? "text-slate-900" : "text-slate-100", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  light = false,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { light?: boolean }) {
  return (
    <p className={cn("text-sm", light ? "text-slate-600" : "text-slate-400", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
