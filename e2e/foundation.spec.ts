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

test("donation page offers payment choices without an extra click", async ({ page }) => {
  await page.goto("/donate");

  await expect(
    page.getByRole("link", { name: /donate securely with paypal/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /donate on gofundme/i }).first(),
  ).toBeVisible();
  await expect(
    page
      .locator(".donation-option-card", { hasText: "Airtel Money" })
      .getByText("+256 752 462 740"),
  ).toBeVisible();
});

test("public pages provide a persistent one-click donation link", async ({ page }) => {
  await page.goto("/programmes");

  const quickDonation = page.getByRole("complementary", {
    name: "Quick donation",
  });

  await expect(quickDonation).toBeVisible();
  await expect(
    quickDonation.getByRole("link", { name: /donate now/i }),
  ).toHaveAttribute("href", /paypal\.com\/donate/);
});
