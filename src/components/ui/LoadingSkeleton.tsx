import { Card } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="container space-y-6 py-10">
      <div className="animate-pulse space-y-3">
        <div className="h-7 w-2/3 rounded bg-slate-800" />
        <div className="h-4 w-1/2 rounded bg-slate-800" />
        <div className="h-4 w-full rounded bg-slate-800" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-800 bg-black/20">
          <div className="animate-pulse space-y-3 p-6">
            <div className="h-5 w-2/3 rounded bg-slate-800" />
            <div className="h-4 w-full rounded bg-slate-800" />
            <div className="h-4 w-5/6 rounded bg-slate-800" />
            <div className="h-10 w-24 rounded bg-slate-800" />
          </div>
        </Card>

        <Card className="border-slate-800 bg-black/20">
          <div className="animate-pulse space-y-3 p-6">
            <div className="h-5 w-1/2 rounded bg-slate-800" />
            <div className="h-4 w-full rounded bg-slate-800" />
            <div className="h-4 w-2/3 rounded bg-slate-800" />
            <div className="h-10 w-32 rounded bg-slate-800" />
          </div>
        </Card>
      </div>
    </div>
  );
}

