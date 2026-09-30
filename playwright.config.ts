import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  // Next dev mode compiles routes on demand several workers racing to
  // trigger a first compile of the heaviest route (the 3D-globe homepage)
  // at once produces flaky navigation timing that has nothing to do with
  // app correctness. 2 workers locally keeps some parallelism without
  // reproducing that contention; CI gets its own budget.
  workers: process.env.CI ? undefined : 2,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
