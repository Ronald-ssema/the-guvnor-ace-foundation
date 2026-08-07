import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://the-guvnor-ace-foundation.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/programmes",
    "/impact",
    "/reports",
    "/stories",
    "/volunteer",
    "/partnerships",
    "/contact",
    "/donate",
    "/policies",
    "/safeguarding",
    "/privacy",
    "/complaints",
    "/terms",
    "/child-protection",
    "/donation-refund",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}