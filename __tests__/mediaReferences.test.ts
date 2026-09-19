import { describe, expect, it } from "vitest";

import { containsStoragePath } from "@/lib/admin/mediaReferences";

describe("containsStoragePath", () => {
  const path = "images/2026/example.webp";

  it("finds an image used in nested editor settings", () => {
    expect(
      containsStoragePath(
        { homeSections: { story: { imagePath: path } } },
        path,
      ),
    ).toBe(true);
  });

  it("finds an image used inside an array", () => {
    expect(containsStoragePath({ gallery: [{ src: path }] }, path)).toBe(true);
  });

  it("does not treat a partial path as a reference", () => {
    expect(containsStoragePath({ imagePath: `${path}.backup` }, path)).toBe(false);
  });
});
