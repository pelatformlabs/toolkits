import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  // nextjs 16
  // cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  transpilePackages: [],
  reactStrictMode: true,
};

export default withMDX(nextConfig);
