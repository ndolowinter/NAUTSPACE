import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Sepolia testnet only the DAO/treasury UI is a governance mock, not a
// production multi-sig integration. Swap in mainnet + a real Safe deployment
// before wiring this to an actual treasury.
export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
});
