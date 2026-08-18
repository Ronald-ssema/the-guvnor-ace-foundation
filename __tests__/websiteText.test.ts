import { describe, expect, it } from "vitest";
import {
  fallbackWebsiteTextSettings,
  parseWebsiteTextSettings,
} from "@/lib/cms/websiteText";

describe("parseWebsiteTextSettings", () => {
  it("returns safe empty defaults for missing data", () => {
    expect(parseWebsiteTextSettings(null)).toEqual({
      ...fallbackWebsiteTextSettings,
      pages: expect.any(Object),
    });
    expect(parseWebsiteTextSettings(null).pages["/"]).toEqual({});
  });

  it("keeps valid page and global plain-text overrides", () => {
    const parsed = parseWebsiteTextSettings({
      global: {
        "global-header:1234abcd:0": "Our work",
        unsafe: "ignored",
      },
      pages: {
        "/about": {
          "page:8765abcd:1": "A new Foundation heading",
          invalid: "ignored",
        },
      },
    });

    expect(parsed.global).toEqual({
      "global-header:1234abcd:0": "Our work",
    });
    expect(parsed.pages["/about"]).toEqual({
      "page:8765abcd:1": "A new Foundation heading",
    });
  });

  it("ignores unknown pages", () => {
    const parsed = parseWebsiteTextSettings({
      pages: {
        "/not-a-real-page": { "page:1234abcd:0": "Do not publish" },
      },
    });
    expect(parsed.pages["/not-a-real-page"]).toBeUndefined();
  });
});
