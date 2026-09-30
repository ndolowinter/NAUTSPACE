import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletConnectButton } from "./WalletConnectButton";

const SIGNERS = [
  { label: "SEA Treasury Lead", address: "0x7a2f…e91C", signed: true },
  { label: "Kenya Space Agency Liaison", address: "0x3c9d…4B21", signed: true },
  { label: "Independent Auditor", address: "0x91Ab…7F0D", signed: false },
];

export function TreasuryPanel() {
  const threshold = 2;
  const signedCount = SIGNERS.filter((s) => s.signed).length;

  return (
    <Card className="border-slate-800 bg-black/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle>Multi-Sig Treasury</CardTitle>
        </div>
        <WalletConnectButton />
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Treasury Balance</p>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-50">1,240.85 ETH</p>
          <p className="text-xs text-slate-500">≈ $3.98M · Sepolia testnet (mock)</p>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide text-slate-500">
            Signer Quorum ({signedCount}/{SIGNERS.length}, threshold {threshold})
          </p>
          <ul className="space-y-2">
            {SIGNERS.map((signer) => (
              <li
                key={signer.address}
                className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm"
              >
                <div>
                  <p className="text-slate-200">{signer.label}</p>
                  <p className="font-mono text-xs text-slate-500">{signer.address}</p>
                </div>
                <Badge variant={signer.signed ? "emerald" : "neutral"}>
                  {signer.signed ? "Signed" : "Pending"}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
