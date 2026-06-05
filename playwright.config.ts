import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 1,
  timeout: 30000,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-small",
      use: {
        ...devices["Galaxy S5"],
        viewport: { width: 320, height: 568 },
      },
    },
    {
      name: "mobile-medium",
      use: {
        ...devices["iPhone 12"],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
