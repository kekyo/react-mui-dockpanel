// react-mui-dockpanel - React MUI edge stacking layout component
// Copyright (c) Kouji Matsui (@kekyo@mi.kekyo.net)
// Under MIT.
// https://github.com/kekyo/react-mui-dockpanel/

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  outputDir: ".playwright-output",
  testDir: "./e2e/tests",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://127.0.0.1:5173",
    deviceScaleFactor: 1,
    trace: "on-first-retry",
    viewport: {
      height: 600,
      width: 800,
    },
  },
  webServer: {
    command: "npm run dev:e2e",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: "http://127.0.0.1:5173",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        deviceScaleFactor: 1,
        viewport: {
          height: 600,
          width: 800,
        },
      },
    },
  ],
});
