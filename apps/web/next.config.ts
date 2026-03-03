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
  images: {
    remotePatterns: [
      {
        // for Pelatform static assets
        protocol: "https",
        hostname: "assets.pelatform.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/docs/:path*",
      },
    ];
  },
};

export default withMDX(nextConfig);
