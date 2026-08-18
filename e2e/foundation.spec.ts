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

  await page
    .getByRole("button", { name: "Reject optional cookies" })
    .click();

  await page.getByRole("link", { name: /donate/i }).first().click();

  await expect(page).toHaveURL(/\/donate/);
});

test("visitors can manage and reopen cookie preferences", async ({ page }) => {
  await page.goto("/");

  const dialog = page.getByRole("dialog", { name: "Our cookies" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Manage cookies" }).click();

  await expect(
    page.getByRole("dialog", { name: "Manage cookies" }),
  ).toBeVisible();
  await page.getByRole("checkbox", { name: /analytics/i }).check();
  await page.getByRole("button", { name: "Save my choices" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.getByRole("button", { name: "Cookie settings" }).click();
  await expect(
    page.getByRole("dialog", { name: "Manage cookies" }),
  ).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /analytics/i })).toBeChecked();
});

test("donation page provides expandable answers and a direct donation prompt", async ({ page }) => {
  await page.goto("/donate");
  await page
    .getByRole("button", { name: "Reject optional cookies" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Frequently asked questions" }),
  ).toBeVisible();
  await expect(
    page.locator(".donation-faq-appeal-button"),
  ).toHaveAttribute("href", /paypal\.com\/donate/);

  await page.getByText("How can I donate?", { exact: true }).click();
  await expect(
    page.getByText(/donate online through PayPal or GoFundMe/i),
  ).toBeVisible();
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
