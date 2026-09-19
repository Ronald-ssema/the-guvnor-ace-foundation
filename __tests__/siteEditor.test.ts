import { afterEach, describe, expect, it } from "vitest";
import {
  fallbackSiteEditorSettings,
  getSiteEditorSettings,
  parseSiteEditorSettings,
} from "@/lib/cms/siteEditor";

const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

afterEach(() => {
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;

  if (originalKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalKey;
});

describe("safe visual editor settings", () => {
  it("uses controlled fallbacks when Supabase is not configured", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    await expect(getSiteEditorSettings()).resolves.toEqual(
      fallbackSiteEditorSettings,
    );
  });

  it("accepts approved appearance options and preserves missing fallbacks", () => {
    const settings = parseSiteEditorSettings({
      appearance: { accent: "emerald", density: "compact" },
      contact: { email: "hello@example.org" },
      homeSections: { story: { visible: false, order: 2 } },
    });

    expect(settings.appearance).toEqual({
      accent: "emerald",
      density: "compact",
    });
    expect(settings.contact.email).toBe("hello@example.org");
    expect(settings.contact.phoneDisplay).toBe(
      fallbackSiteEditorSettings.contact.phoneDisplay,
    );
    expect(settings.homeSections.story.visible).toBe(false);
  });

  it("rejects unsupported appearance values by returning safe defaults", () => {
    const settings = parseSiteEditorSettings({
      appearance: { accent: "javascript:red", density: "hidden" },
    });

    expect(settings.appearance).toEqual(
      fallbackSiteEditorSettings.appearance,
    );
  });
});
