import { test, expect } from "@playwright/test";

test.describe("executive portal access control", () => {
  test("unauthenticated visitors are redirected to login with a next param", async ({ page }) => {
    await page.goto("/executive/dashboard");
    await expect(page).toHaveURL(/\/auth\/login\?next=%2Fexecutive%2Fdashboard/);
  });

  test("unauthenticated visitors to the DAO page are also redirected", async ({ page }) => {
    await page.goto("/executive/dao");
    await expect(page).toHaveURL(/\/auth\/login\?next=%2Fexecutive%2Fdao/);
  });

  test("the public nav has no Executive Portal entry point, only Sign In", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Executive Portal" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Sign In" }).first()).toBeVisible();
  });
});
