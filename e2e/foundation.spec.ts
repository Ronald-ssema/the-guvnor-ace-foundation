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

test("public pages expose their wording to the same-origin admin preview", async ({ page }) => {
  // WebKit can receive a final Next.js development reload while the first page
  // compilation settles. Wait for the page to become idle before creating the
  // preview frame so the message listener is not attached to a stale document.
  await page.goto("/", { waitUntil: "networkidle" });

  const result = await page.evaluate(() => new Promise<{ path: string; count: number }>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error("CMS preview did not respond")), 8000);
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.source !== "gaf-cms") return;
      window.clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
      resolve({ path: event.data.path, count: event.data.items?.length ?? 0 });
    };
    window.addEventListener("message", onMessage);
    const iframe = document.createElement("iframe");
    iframe.src = "/?cms-preview=1";
    document.body.appendChild(iframe);
  }));

  expect(result.path).toBe("/");
  expect(result.count).toBeGreaterThan(20);
});
