import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Long-lived caching for the static PDFs/images in /public.
  async headers() {
    return [
      {
        source: "/:file*.(pdf|png|jpg|jpeg|webp|svg|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
