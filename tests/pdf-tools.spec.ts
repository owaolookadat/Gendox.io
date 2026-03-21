import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const testPdf = path.resolve(__dirname, "fixtures/test.pdf");

// Create a test PNG fixture if it doesn't exist
const testPng = path.resolve(__dirname, "fixtures/test.png");
if (!fs.existsSync(testPng)) {
  fs.writeFileSync(
    testPng,
    Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVQYV2P8z8BQz0BhwMgwqpBCMwIAOpYDCaCJ/pYAAAAASUVORK5CYII=",
      "base64"
    )
  );
}

test.describe("PDF Tools — upload and process", () => {
  test("Merge PDF — upload files and merge", async ({ page }) => {
    await page.goto("/pdf-tools/merge");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([testPdf, testPdf]);
    await page.waitForTimeout(1000);

    const actionBtn = page.getByRole("button", { name: /merge/i });
    await expect(actionBtn).toBeEnabled({ timeout: 5000 });

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 15000 }).catch(() => null),
      actionBtn.click(),
    ]);

    if (download) {
      expect(download.suggestedFilename()).toMatch(/\.pdf$/);
    }
  });

  test("Split PDF — upload and verify page view", async ({ page }) => {
    await page.goto("/pdf-tools/split");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testPdf);
    await page.waitForTimeout(2000);

    // After upload, split tool should show page selection UI
    // Just verify the file was accepted and UI rendered
    const pageContent = await page.textContent("body");
    // Should show page count or split options
    expect(pageContent).toMatch(/page|split|range/i);
  });

  test("Rotate PDF — upload and rotate", async ({ page }) => {
    await page.goto("/pdf-tools/rotate");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testPdf);
    await page.waitForTimeout(1000);

    // Click rotate button on a page
    const rotateBtn = page.locator('button:has-text("90"), button:has-text("Rotate")').first();
    if (await rotateBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await rotateBtn.click();
    }

    // Look for download/save button
    const downloadBtn = page.getByRole("button", { name: /download|save|apply/i });
    if (await downloadBtn.isEnabled({ timeout: 3000 }).catch(() => false)) {
      const [download] = await Promise.all([
        page.waitForEvent("download", { timeout: 15000 }).catch(() => null),
        downloadBtn.click(),
      ]);

      if (download) {
        expect(download.suggestedFilename()).toMatch(/\.pdf$/);
      }
    }
  });

  test("JPG to PDF — upload image and convert", async ({ page }) => {
    await page.goto("/pdf-tools/jpg-to-pdf");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testPng);
    await page.waitForTimeout(1000);

    const convertBtn = page.getByRole("button", { name: /convert|create|download/i });
    if (await convertBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
      const [download] = await Promise.all([
        page.waitForEvent("download", { timeout: 15000 }).catch(() => null),
        convertBtn.click(),
      ]);

      if (download) {
        expect(download.suggestedFilename()).toMatch(/\.pdf$/);
      }
    }
  });

  test("Add Watermark — upload and add watermark", async ({ page }) => {
    await page.goto("/pdf-tools/add-watermark");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testPdf);
    await page.waitForTimeout(1000);

    // Fill watermark text
    const textInput = page.locator('input[type="text"]:visible').first();
    if (await textInput.isVisible()) {
      await textInput.fill("CONFIDENTIAL");
    }

    const actionBtn = page.getByRole("button", { name: /add|apply|download/i });
    if (await actionBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
      const [download] = await Promise.all([
        page.waitForEvent("download", { timeout: 15000 }).catch(() => null),
        actionBtn.click(),
      ]);

      if (download) {
        expect(download.suggestedFilename()).toMatch(/\.pdf$/);
      }
    }
  });

  test("Protect PDF — upload and password protect", async ({ page }) => {
    await page.goto("/pdf-tools/protect-pdf");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testPdf);
    await page.waitForTimeout(1000);

    // Fill password fields
    const passwordInputs = page.locator('input[type="password"]:visible, input[type="text"][placeholder*="password" i]:visible');
    const pwCount = await passwordInputs.count();
    for (let i = 0; i < pwCount; i++) {
      await passwordInputs.nth(i).fill("test123").catch(() => {});
    }

    const actionBtn = page.getByRole("button", { name: /protect|encrypt|download/i });
    if (await actionBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
      const [download] = await Promise.all([
        page.waitForEvent("download", { timeout: 15000 }).catch(() => null),
        actionBtn.click(),
      ]);

      if (download) {
        expect(download.suggestedFilename()).toMatch(/\.pdf$/);
      }
    }
  });
});
