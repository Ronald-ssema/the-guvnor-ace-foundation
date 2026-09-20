import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { siteConfig } from "@/lib/site";

describe("sitemap", () => {
  it("contains unique canonical URLs without fabricated modification dates", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(siteConfig.url);
    expect(new Set(urls).size).toBe(urls.length);

    for (const entry of entries) {
      expect(entry.url.startsWith(siteConfig.url)).toBe(true);
      expect(entry.lastModified).toBeUndefined();
    }
  });
});
