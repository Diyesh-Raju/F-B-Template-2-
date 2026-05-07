import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // We have multiple lockfiles in this repo; force Turbopack to treat this
    // directory as the project root so module resolution is correct.
    root: __dirname,
  },
};

export default nextConfig;
