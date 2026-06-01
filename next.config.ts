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
  // Aggressively cache the scroll-scrub hero videos. By default Vercel serves
  // /public files with a revalidating cache, so a returning visitor (or a
  // client-side route change back to the page) can re-fetch the clip and lose
  // the buffering race again before the scrub can paint. A long immutable
  // cache lets the edge CDN and the browser keep the bytes, so every visit
  // after the first has the whole clip ready instantly and the scrub is smooth
  // from the first scroll. If a hero video is ever re-encoded, change its
  // filename (or append a ?v= query in the component) to bust the cache.
  async headers() {
    return [
      {
        source: "/:path*.mp4",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
