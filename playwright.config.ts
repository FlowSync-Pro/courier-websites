import { defineConfig, devices } from "@playwright/test";

// Point the suite at a deployed site with BASE_URL. Unset, Playwright
// starts the local dev server on port 4317 (SQLite, no env vars).
const baseFromEnv = process.env.BASE_URL?.trim();
const baseURL = baseFromEnv || "http://127.0.0.1:4317";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: baseFromEnv
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
