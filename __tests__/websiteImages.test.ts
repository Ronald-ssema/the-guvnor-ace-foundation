import { describe, expect, it } from "vitest";
import {
  fallbackWebsiteImageSettings,
  parseWebsiteImageSettings,
} from "@/lib/cms/websiteImages";

describe("parseWebsiteImageSettings", () => {
  it("returns safe defaults for missing data", () => {
    expect(parseWebsiteImageSettings(null)).toEqual(fallbackWebsiteImageSettings);
  });

  it("keeps supported placements and removes duplicate gallery paths", () => {
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
    expect(settings.gallery).toEqual({
      visible: false,
      title: "Community visits",
      mediaPaths: ["images/2026/one.webp", "images/2026/two.webp"],
    });
  });
});
