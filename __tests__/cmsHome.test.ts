import { afterEach, describe, expect, it } from "vitest";
import {
  fallbackHomeHero,
  getHomeHeroContent,
  publicMediaUrl,
} from "@/lib/cms/home";

const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

afterEach(() => {
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;

  if (originalKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalKey;
});

describe("homepage CMS fallback", () => {
  it("uses verified hard-coded content when Supabase is not configured", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    await expect(getHomeHeroContent()).resolves.toEqual(fallbackHomeHero);
  });

  it("builds an encoded public media URL", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";

    expect(publicMediaUrl("images/2026/community day.jpg")).toBe(
      "https://example.supabase.co/storage/v1/object/public/site-media/images/2026/community%20day.jpg",
    );
  });
});
