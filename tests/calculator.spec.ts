import { test, expect } from "@playwright/test";

test.describe("Profit Margin Calculator", () => {
  test("calculates margins correctly as user types", async ({ page }) => {
    await page.goto("/calculators/profit-margin");
    await page.waitForSelector("h1");

    const revenue = page.getByRole("spinbutton", { name: /revenue/i });
    const cost = page.getByRole("spinbutton", { name: /cost of goods/i });

    await revenue.fill("1000");
    await cost.fill("600");

    await page.waitForTimeout(500);

    // Gross profit = 400, Gross margin = 40%, Markup = 66.7%
    await expect(page.getByText("£400.00").first()).toBeVisible();
    await expect(page.getByText("40.0%").first()).toBeVisible();
    await expect(page.getByText("66.7%")).toBeVisible();
  });

  test("handles operating expenses for net margin", async ({ page }) => {
    await page.goto("/calculators/profit-margin");
    await page.waitForSelector("h1");

    await page.getByRole("spinbutton", { name: /revenue/i }).fill("1000");
    await page.getByRole("spinbutton", { name: /cost of goods/i }).fill("600");
    await page.getByRole("spinbutton", { name: /operating/i }).fill("200");

    await page.waitForTimeout(500);

    // Net profit = 200, Net margin = 20%
    await expect(page.getByText("£200.00").first()).toBeVisible();
    await expect(page.getByText("20.0%").first()).toBeVisible();
  });
});
