"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

function truncate(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <Button variant="outline" size="sm" onClick={() => disconnect()}>
        {truncate(address)}
      </Button>
    );
  }

  const defaultConnector = connectors[0];

  return (
    <Button
      size="sm"
      disabled={isPending || !defaultConnector}
      onClick={() => defaultConnector && connect({ connector: defaultConnector })}
    >
      {isPending ? "Connecting…" : "Connect Signer Wallet"}
    </Button>
  );
}
