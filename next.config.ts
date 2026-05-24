import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    // We have multiple lockfiles in this repo; force Turbopack to treat this
    // directory as the project root so module resolution is correct.
    root: __dirname,
  },
};

export default nextConfig;
