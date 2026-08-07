import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /donate/i }).first()).toBeVisible();
});

test("about page loads", async ({ page }) => {
  await page.goto("/about");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /every child deserves/i,
    }),
  ).toBeVisible();
});

test("safeguarding page loads", async ({ page }) => {
  await page.goto("/safeguarding");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Safeguarding Policy",
    }),
  ).toBeVisible();
});

test("donate navigation works", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /donate/i }).first().click();

  await expect(page).toHaveURL(/\/donate/);
});
