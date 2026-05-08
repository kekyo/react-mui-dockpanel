// react-mui-dockpanel - React MUI edge stacking layout component
// Copyright (c) Kouji Matsui (@kekyo@mi.kekyo.net)
// Under MIT.
// https://github.com/kekyo/react-mui-dockpanel/

import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

interface ExpectedRect {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

const runTimestamp = (() => {
  const now = new Date();
  const pad = (value: number, length: number): string => value.toString().padStart(length, "0");

  return [
    `${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}`,
    `${pad(now.getHours(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getSeconds(), 2)}`,
    pad(now.getMilliseconds(), 3),
  ].join("_");
})();

const toPathSegment = (value: string): string => {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized.length === 0 ? "unnamed-test" : sanitized;
};

test.afterEach(async ({ page }, testInfo) => {
  const screenshotDirectory = path.join(
    process.cwd(),
    "test-results",
    runTimestamp,
    toPathSegment(testInfo.title),
  );
  const screenshotPath = path.join(screenshotDirectory, "screenshot.png");

  await mkdir(screenshotDirectory, { recursive: true });
  await page.screenshot({
    fullPage: false,
    path: screenshotPath,
  });
});

const getViewportSize = (page: Page): { readonly height: number; readonly width: number } => {
  const viewportSize = page.viewportSize();

  if (viewportSize === null) {
    throw new Error("Expected Playwright viewport size to be configured.");
  }

  return viewportSize;
};

const getRect = async (locator: Locator): Promise<ExpectedRect> => {
  const rect = await locator.boundingBox();

  if (rect === null) {
    throw new Error("Expected locator to have a bounding box.");
  }

  return rect;
};

const expectRect = (actual: ExpectedRect, expected: ExpectedRect): void => {
  expect(actual.x).toBeCloseTo(expected.x, 0);
  expect(actual.y).toBeCloseTo(expected.y, 0);
  expect(actual.width).toBeCloseTo(expected.width, 0);
  expect(actual.height).toBeCloseTo(expected.height, 0);
};

const expectTestIdRect = async (
  page: Page,
  testId: string,
  expected: ExpectedRect,
): Promise<void> => {
  expectRect(await getRect(page.getByTestId(testId)), expected);
};

test("lays out top then fill", async ({ page }) => {
  await page.goto("/top-fill");
  const viewport = getViewportSize(page);

  await expectTestIdRect(page, "top", { x: 0, y: 0, width: viewport.width, height: 100 });
  await expectTestIdRect(page, "fill", {
    x: 0,
    y: 100,
    width: viewport.width,
    height: viewport.height - 100,
  });
});

test("lays out left then fill", async ({ page }) => {
  await page.goto("/left-fill");
  const viewport = getViewportSize(page);

  await expectTestIdRect(page, "left", { x: 0, y: 0, width: 200, height: viewport.height });
  await expectTestIdRect(page, "fill", {
    x: 200,
    y: 0,
    width: viewport.width - 200,
    height: viewport.height,
  });
});

test("lays out top then left then fill", async ({ page }) => {
  await page.goto("/top-left-fill");
  const viewport = getViewportSize(page);

  await expectTestIdRect(page, "top", { x: 0, y: 0, width: viewport.width, height: 100 });
  await expectTestIdRect(page, "left", {
    x: 0,
    y: 100,
    width: 200,
    height: viewport.height - 100,
  });
  await expectTestIdRect(page, "fill", {
    x: 200,
    y: 100,
    width: viewport.width - 200,
    height: viewport.height - 100,
  });
});

test("lays out top then left then top then fill", async ({ page }) => {
  await page.goto("/top-left-top-fill");
  const viewport = getViewportSize(page);

  await expectTestIdRect(page, "outer-top", { x: 0, y: 0, width: viewport.width, height: 100 });
  await expectTestIdRect(page, "left", {
    x: 0,
    y: 100,
    width: 200,
    height: viewport.height - 100,
  });
  await expectTestIdRect(page, "inner-top", {
    x: 200,
    y: 100,
    width: viewport.width - 200,
    height: 50,
  });
  await expectTestIdRect(page, "fill", {
    x: 200,
    y: 150,
    width: viewport.width - 200,
    height: viewport.height - 150,
  });
});

test("lays out all edge directions in order", async ({ page }) => {
  await page.goto("/all-edges");
  const viewport = getViewportSize(page);

  await expectTestIdRect(page, "top", { x: 0, y: 0, width: viewport.width, height: 100 });
  await expectTestIdRect(page, "right", {
    x: viewport.width - 120,
    y: 100,
    width: 120,
    height: viewport.height - 100,
  });
  await expectTestIdRect(page, "bottom", {
    x: 0,
    y: viewport.height - 80,
    width: viewport.width - 120,
    height: 80,
  });
  await expectTestIdRect(page, "left", {
    x: 0,
    y: 100,
    width: 200,
    height: viewport.height - 180,
  });
  await expectTestIdRect(page, "fill", {
    x: 200,
    y: 100,
    width: viewport.width - 320,
    height: viewport.height - 180,
  });
});

test("lays out all edge directions in order (auto)", async ({ page }) => {
  await page.goto("/all-edges2");
  const viewport = getViewportSize(page);

  await expectTestIdRect(page, "top", { x: 0, y: 0, width: viewport.width, height: 100 });
  await expectTestIdRect(page, "right", {
    x: viewport.width - 120,
    y: 100,
    width: 120,
    height: viewport.height - 100,
  });
  await expectTestIdRect(page, "bottom", {
    x: 0,
    y: viewport.height - 80,
    width: viewport.width - 120,
    height: 80,
  });
  await expectTestIdRect(page, "left", {
    x: 0,
    y: 100,
    width: 200,
    height: viewport.height - 180,
  });
  await expectTestIdRect(page, "fill", {
    x: 200,
    y: 100,
    width: viewport.width - 320,
    height: viewport.height - 180,
  });
});

test("lays out repeated top docks in order", async ({ page }) => {
  await page.goto("/repeated-top");
  const viewport = getViewportSize(page);

  await expectTestIdRect(page, "top-1", { x: 0, y: 0, width: viewport.width, height: 100 });
  await expectTestIdRect(page, "top-2", { x: 0, y: 100, width: viewport.width, height: 50 });
  await expectTestIdRect(page, "fill", {
    x: 0,
    y: 150,
    width: viewport.width,
    height: viewport.height - 150,
  });
});

test("uses natural size for auto edge docks", async ({ page }) => {
  await page.goto("/auto-size");
  const viewport = getViewportSize(page);

  await expectTestIdRect(page, "auto-top", { x: 0, y: 0, width: viewport.width, height: 70 });
  await expectTestIdRect(page, "auto-left", {
    x: 0,
    y: 70,
    width: 90,
    height: viewport.height - 70,
  });
  await expectTestIdRect(page, "auto-fill", {
    x: 90,
    y: 70,
    width: viewport.width - 90,
    height: viewport.height - 70,
  });
});
