/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  webpack: (config, { webpack }) => {
    // wagmi/connectors' barrel export pulls in Coinbase's baseAccount
    // connector, which transitively references @x402/* packages behind an
    // optional crypto-payment feature we never invoke (we only use the
    // `injected` connector for the DAO governance mock). Those packages
    // were never installed and aren't meant to be ignore the whole scope
    // instead of trying to resolve individual subpaths one at a time.
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^@x402\// }));
    return config;
  },
};

export default nextConfig;
