import type { MetadataRoute } from "next";

import { seo } from "@/lib/content";

/* Single-page site, so the sitemap has one entry. Next serves this at
   /sitemap.xml automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: seo.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
