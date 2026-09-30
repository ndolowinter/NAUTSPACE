import { Card, CardContent } from "@/components/ui/card";

const TONE_CLASS: Record<"emerald" | "amber" | "cyan", string> = {
  emerald: "text-emerald",
  amber: "text-amber-400",
  cyan: "text-cyan",
};

export function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "emerald" | "amber" | "cyan";
}) {
  return (
    <Card className="border-slate-800 bg-black/30">
      <CardContent className="flex items-center gap-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
          <p className={`text-xl font-bold ${TONE_CLASS[tone]}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

