import { test, expect } from "@playwright/test";

test.describe("client-side form validation", () => {
  test("contact form blocks submission until required fields are valid", async ({ page }) => {
    await page.goto("/contact");

    await page.getByRole("button", { name: /submit inquiry/i }).click();

    await expect(page.getByText("Required").first()).toBeVisible();
    await expect(page.getByText("Enter a valid email")).toBeVisible();
    await expect(page.getByText("Please provide at least 20 characters")).toBeVisible();

    // Still on /contact no network round-trip happened because zod caught it client-side.
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("contact form accepts a well-formed submission without client-side errors", async ({ page }) => {
    await page.goto("/contact");

    await page.getByLabel("Organization").fill("Kenya Space Agency");
    await page.getByLabel("Contact Name").fill("Amina Otieno");
    await page.getByLabel("Email").fill("amina.otieno@example.com");
    await page.getByLabel("Inquiry Type").selectOption("government");
    await page
      .getByLabel("Message")
      .fill("We would like to discuss a joint CubeSat calibration program for next quarter.");

    await page.getByRole("button", { name: /submit inquiry/i }).click();

    // No Supabase project is configured for this test run, so the insert
    // itself is expected to fail we're only asserting the client-side
    // validation gate got out of the way, not that the write succeeded.
    await expect(page.getByText("Required")).toHaveCount(0);
    await expect(page.getByText("Enter a valid email")).toHaveCount(0);
  });

  test("careers application requires a resume before submitting", async ({ page }) => {
    await page.goto("/careers");

    await page.getByLabel("Internship Track").selectOption("cybersecurity");
    await page.getByRole("button", { name: /submit application/i }).click();

    await expect(page.getByText("Attach your resume")).toBeVisible();
  });
});
