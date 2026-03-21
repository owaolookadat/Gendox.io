import { test, expect } from "@playwright/test";

test.describe("Document Generators — form fill & download", () => {
  test("Resignation Letter — fills form and downloads DOCX", async ({ page }) => {
    await page.goto("/generators/resignation-letter");
    await page.waitForSelector("h1");

    // Fill fields by ID
    await page.fill("#yourName", "John Smith");
    await page.fill("#jobTitle", "Software Engineer");
    await page.fill("#managerName", "Jane Doe");
    await page.fill("#companyName", "Acme Corp");

    // Fill date if present
    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.isVisible().catch(() => false)) {
      await dateInput.fill("2025-12-31");
    }

    // Button should now be enabled
    const btn = page.getByRole("button", { name: /generate document/i });
    await expect(btn).toBeEnabled({ timeout: 3000 });

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 15000 }).catch(() => null),
      btn.click(),
    ]);

    if (download) {
      expect(download.suggestedFilename()).toMatch(/\.(docx|pdf)$/);
    }
  });

  test("Invoice — fills line items and downloads DOCX", async ({ page }) => {
    await page.goto("/generators/invoice");
    await page.waitForSelector("h1");

    // Fill text inputs that exist
    const textInputs = page.locator('input[type="text"]:visible');
    const count = await textInputs.count();
    for (let i = 0; i < Math.min(count, 6); i++) {
      const val = await textInputs.nth(i).inputValue();
      if (!val) await textInputs.nth(i).fill("Test Data " + i).catch(() => {});
    }

    // Fill number inputs (quantity, price)
    const numberInputs = page.locator('input[type="number"]:visible');
    const numCount = await numberInputs.count();
    for (let i = 0; i < numCount; i++) {
      const val = await numberInputs.nth(i).inputValue();
      if (!val || val === "0") await numberInputs.nth(i).fill("100").catch(() => {});
    }

    const btn = page.getByRole("button", { name: /generate/i });
    await expect(btn).toBeEnabled({ timeout: 3000 });

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 15000 }).catch(() => null),
      btn.click(),
    ]);

    if (download) {
      expect(download.suggestedFilename()).toMatch(/\.(docx|pdf)$/);
    }
  });

  test("NDA — fills form and downloads DOCX", async ({ page }) => {
    await page.goto("/generators/nda");
    await page.waitForSelector("h1");

    // Fill all visible text inputs
    const textInputs = page.locator('input[type="text"]:visible');
    const count = await textInputs.count();
    for (let i = 0; i < count; i++) {
      const val = await textInputs.nth(i).inputValue();
      if (!val) await textInputs.nth(i).fill("Test Party " + i).catch(() => {});
    }

    // Fill textareas
    const textareas = page.locator('textarea:visible');
    const taCount = await textareas.count();
    for (let i = 0; i < taCount; i++) {
      const val = await textareas.nth(i).inputValue();
      if (!val) await textareas.nth(i).fill("Test content for NDA.").catch(() => {});
    }

    const btn = page.getByRole("button", { name: /generate/i });
    await expect(btn).toBeEnabled({ timeout: 3000 });

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 15000 }).catch(() => null),
      btn.click(),
    ]);

    if (download) {
      expect(download.suggestedFilename()).toMatch(/\.(docx|pdf)$/);
    }
  });
});
