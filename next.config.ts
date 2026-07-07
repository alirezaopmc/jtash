import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@orbit/ui", "@orbit/tokens", "@orbit/markdown"],
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
