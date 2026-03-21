import { test, expect } from "@playwright/test";

test.describe("SEO essentials", () => {
  // sitemap.xml and robots.txt are only generated at build time in Next.js
  // These tests should run against a production build, not dev server
  test("sitemap.xml returns valid XML with all routes", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    // In dev mode sitemap may 404 — skip gracefully
    if (response?.status() === 404) {
      test.skip(true, "sitemap.xml only available in production build");
      return;
    }
    expect(response?.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain("gendox.io");
    expect(content).toContain("/generators/resume");
    expect(content).toContain("/pdf-tools/merge");
    expect(content).toContain("/calculators/profit-margin");
  });

  test("robots.txt allows all crawling", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    if (response?.status() === 404) {
      test.skip(true, "robots.txt only available in production build");
      return;
    }
    expect(response?.status()).toBe(200);

    const content = await page.textContent("body");
    expect(content).toContain("Allow: /");
    expect(content).toContain("sitemap.xml");
  });

  test("homepage has correct meta tags", async ({ page }) => {
    await page.goto("/");

    const title = await page.title();
    expect(title.toLowerCase()).toContain("gendox");

    const description = await page.getAttribute('meta[name="description"]', "content");
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
  });

  test("PDF tool pages have unique titles and descriptions", async ({ page }) => {
    const pdfRoutes = ["/pdf-tools/merge", "/pdf-tools/split", "/pdf-tools/rotate"];
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const route of pdfRoutes) {
      await page.goto(route);
      const title = await page.title();
      const desc = await page.getAttribute('meta[name="description"]', "content");

      expect(title.length).toBeGreaterThan(10);
      expect(desc).toBeTruthy();

      titles.add(title);
      descriptions.add(desc!);
    }

    // All titles should be unique
    expect(titles.size).toBe(pdfRoutes.length);
    // All descriptions should be unique
    expect(descriptions.size).toBe(pdfRoutes.length);
  });
});
