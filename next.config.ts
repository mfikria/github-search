import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/github-search',
  assetPrefix: '/github-search',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
