import { test, expect } from "@playwright/test";

test.describe("public marketing pages", () => {
  test("home page renders the hero and telemetry ticker", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Autonomous Intelligence Platforms");
    await expect(page.getByText("Live Telemetry")).toBeVisible();
  });

  test("primary nav reaches every public section", async ({ page }) => {
    await page.goto("/");

    const routes: [string, string][] = [
      ["Science Centers", "/science-centers"],
      ["Careers & Academy", "/careers"],
      ["Be a Pilot", "/pilot"],
      ["Products & Services", "/services"],
      ["Research", "/research"],
      ["Contact", "/contact"],
    ];

    for (const [label, path] of routes) {
      // Fresh goto() per iteration rather than click + goBack(): back/forward
      // navigation through Next's client router needs the page to finish
      // resettling before the next link is interactive, which this loop
      // otherwise races.
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.getByRole("link", { name: label, exact: true }).first().click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    }
  });

  test("science centers page lists the National Science Centers section", async ({ page }) => {
    await page.goto("/science-centers");
    await expect(page.getByRole("heading", { name: /interactive map/i })).toBeVisible();
  });

  test("services page exposes the astrotourism anchor", async ({ page }) => {
    await page.goto("/services#astrotourism");
    await expect(page.getByRole("heading", { name: /guided orbital and dark-sky experiences/i })).toBeVisible();
  });
});
