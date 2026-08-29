import type { MetadataRoute } from "next";

import { seo } from "@/lib/content";

/* Served at /robots.txt. Everything is public and indexable. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
  };
}
