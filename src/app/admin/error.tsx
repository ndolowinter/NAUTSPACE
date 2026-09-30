"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-16">
      <Card className="border-slate-800 bg-black/30">
        <div className="space-y-4 p-6">
          <h2 className="text-lg font-semibold text-slate-50">Admin error</h2>
          <p className="text-sm text-slate-400">
            Something went wrong while loading the Admin Panel. Retry to try again.
          </p>
          <Button onClick={reset} className="gap-2">
            Retry
          </Button>
        </div>
      </Card>
    </div>
  );
}

