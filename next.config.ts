import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@manovaspace/tokens", "@manovaspace/ui"],
  experimental: {
    // Evict Turbopack's dev cache to disk under memory pressure (Next.js 16.3+).
    turbopackMemoryEviction: "auto",
  },
};

export default nextConfig;
