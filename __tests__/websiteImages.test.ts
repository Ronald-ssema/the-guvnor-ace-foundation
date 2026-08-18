import { describe, expect, it } from "vitest";
import {
  fallbackWebsiteImageSettings,
  parseWebsiteImageSettings,
} from "@/lib/cms/websiteImages";

describe("parseWebsiteImageSettings", () => {
  it("returns safe defaults for missing data", () => {
    expect(parseWebsiteImageSettings(null)).toEqual(fallbackWebsiteImageSettings);
  });

  it("keeps supported placements and migrates the legacy Stories gallery", () => {
    const settings = parseWebsiteImageSettings({
      slots: {
        food: {
          mediaPath: "images/2026/food.webp",
          visible: false,
          alt: "Food parcels prepared for distribution",
        },
      },
      gallery: {
        visible: false,
        title: "Community visits",
        mediaPaths: [
          "images/2026/one.webp",
          "images/2026/one.webp",
          "images/2026/two.webp",
          42,
        ],
      },
    });

    expect(settings.slots.food).toEqual({
      mediaPath: "images/2026/food.webp",
      visible: false,
      alt: "Food parcels prepared for distribution",
    });
    expect(settings.slots.about).toEqual(fallbackWebsiteImageSettings.slots.about);
    expect(settings.pageGalleries.stories).toEqual({
      visible: false,
      title: "Community visits",
      mediaPaths: ["images/2026/one.webp", "images/2026/two.webp"],
    });
    expect(settings.pageGalleries.about).toEqual(
      fallbackWebsiteImageSettings.pageGalleries.about,
    );
  });

  it("supports separate multi-photo galleries on several pages", () => {
    const settings = parseWebsiteImageSettings({
      pageGalleries: {
        home: {
          visible: true,
          title: "Latest photographs",
          mediaPaths: ["images/2026/shared.webp", "images/2026/home.webp"],
        },
        donate: {
          visible: true,
          title: "Your support at work",
          mediaPaths: ["images/2026/shared.webp", "images/2026/donate.webp"],
        },
      },
    });

    expect(settings.pageGalleries.home.mediaPaths).toEqual([
      "images/2026/shared.webp",
      "images/2026/home.webp",
    ]);
    expect(settings.pageGalleries.donate.mediaPaths).toEqual([
      "images/2026/shared.webp",
      "images/2026/donate.webp",
    ]);
  });
});
