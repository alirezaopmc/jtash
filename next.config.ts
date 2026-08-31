import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@manovaspace/ui", "@manovaspace/tokens", "@manovaspace/markdown"],
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
