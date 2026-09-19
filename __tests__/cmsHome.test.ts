import { afterEach, describe, expect, it } from "vitest";
import {
  fallbackHomeHero,
  getHomeHeroContent,
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

  it("does not expose a media URL when the fallback image is used", () => {
    expect(fallbackHomeHero.imagePath).toBeNull();
    expect(fallbackHomeHero.imageUrl).toBeNull();
  });
});
