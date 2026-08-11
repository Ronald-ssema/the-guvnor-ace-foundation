import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0, frequency: "weekly" as const },
    { path: "/about", priority: 0.9, frequency: "monthly" as const },
    { path: "/programmes", priority: 0.9, frequency: "monthly" as const },
    { path: "/impact", priority: 0.9, frequency: "monthly" as const },
    { path: "/stories", priority: 0.8, frequency: "monthly" as const },
    { path: "/reports", priority: 0.8, frequency: "monthly" as const },
    { path: "/donate", priority: 0.9, frequency: "monthly" as const },
    { path: "/get-involved", priority: 0.8, frequency: "monthly" as const },
    { path: "/volunteer", priority: 0.8, frequency: "monthly" as const },
    { path: "/partnerships", priority: 0.8, frequency: "monthly" as const },
    { path: "/contact", priority: 0.7, frequency: "monthly" as const },
    { path: "/safeguarding", priority: 0.7, frequency: "monthly" as const },
    { path: "/child-protection", priority: 0.7, frequency: "monthly" as const },
    { path: "/policies", priority: 0.6, frequency: "monthly" as const },
    { path: "/privacy", priority: 0.5, frequency: "yearly" as const },
    { path: "/complaints", priority: 0.5, frequency: "yearly" as const },
    { path: "/terms", priority: 0.5, frequency: "yearly" as const },
    { path: "/donation-refund", priority: 0.5, frequency: "yearly" as const },
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    changeFrequency: route.frequency,
    priority: route.priority,
  }));
}
