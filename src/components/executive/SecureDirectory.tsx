import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DIRECTORY = [
  { name: "Kenya Space Agency Liaison Office", clearance: "Government", channel: "Encrypted Voice + Text" },
  { name: "African Union Defense Coordination", clearance: "Defense", channel: "Encrypted Text" },
  { name: "Broglio Space Center Operations", clearance: "Executive", channel: "Encrypted Voice" },
  { name: "Strategic Investment Partners (SEA Capital)", clearance: "Investor", channel: "Encrypted Text" },
];

export function SecureDirectory() {
  return (
    <Card className="border-slate-800 bg-black/30">
      <CardHeader>
        <CardTitle>Restricted Client & Defense Directory</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-slate-800">
          {DIRECTORY.map((entry) => (
            <li key={entry.name} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm text-slate-200">{entry.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">{entry.channel}</p>
              </div>
              <Badge variant="neutral">{entry.clearance}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
