import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/programmes",
    "/impact",
    "/stories",
    "/reports",
    "/donate",
    "/get-involved",
    "/volunteer",
    "/partnerships",
    "/contact",
    "/safeguarding",
    "/child-protection",
    "/policies",
    "/privacy",
    "/cookies",
    "/accessibility",
    "/complaints",
    "/terms",
    "/donation-refund",
  ];

  return routes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));
}
