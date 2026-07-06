import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// ponytail: `pnpm dev` uses `--webpack` because Turbopack struggles with
// symlinked workspace CSS from linked @orbit/* packages.
const nextConfig: NextConfig = {
  transpilePackages: ["@orbit/ui", "@orbit/tokens", "@orbit/markdown"],
  allowedDevOrigins: ["127.0.0.1"],
  outputFileTracingRoot: path.join(rootDir, "../../.."),
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
