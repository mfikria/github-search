import type { NextConfig } from "next";


const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/github-search' : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
