import { test, expect } from "@playwright/test";

// All routes that should load without errors
const allRoutes = [
  // Homepage & utility
  "/",
  "/about",
  "/privacy",

  // Calculator
  "/calculators/profit-margin",

  // Generators
  "/generators/resume",
  "/generators/resignation-letter",
  "/generators/cover-letter",
  "/generators/business-letter",
  "/generators/reference-letter",
  "/generators/recommendation-letter",
  "/generators/offer-letter",
  "/generators/termination-letter",
  "/generators/warning-letter",
  "/generators/complaint-letter",
  "/generators/thank-you-letter",
  "/generators/letter-of-intent",
  "/generators/apology-letter",
  "/generators/authorization-letter",
  "/generators/permission-letter",
  "/generators/sponsorship-letter",
  "/generators/demand-letter",
  "/generators/invoice",
  "/generators/receipt",
  "/generators/purchase-order",
  "/generators/quotation",
  "/generators/business-proposal",
  "/generators/meeting-minutes",
  "/generators/memo",
  "/generators/press-release",
  "/generators/job-description",
  "/generators/company-profile",
  "/generators/scope-of-work",
  "/generators/project-brief",
  "/generators/nda",
  "/generators/employment-contract",
  "/generators/service-agreement",
  "/generators/rental-agreement",
  "/generators/loan-agreement",
  "/generators/partnership-agreement",
  "/generators/bill-of-sale",
  "/generators/promissory-note",
  "/generators/eviction-notice",
  "/generators/power-of-attorney",
  "/generators/affidavit",
  "/generators/consent-form",
  "/generators/waiver-form",
  "/generators/pay-stub",
  "/generators/experience-certificate",
  "/generators/internship-certificate",
  "/generators/leave-application",
  "/generators/performance-review",
  "/generators/joining-letter",
  "/generators/relieving-letter",
  "/generators/certificate-of-completion",
  "/generators/award-certificate",

  // PDF Tools
  "/pdf-tools/merge",
  "/pdf-tools/split",
  "/pdf-tools/rotate",
  "/pdf-tools/remove-pages",
  "/pdf-tools/extract-pages",
  "/pdf-tools/organize",
  "/pdf-tools/jpg-to-pdf",
  "/pdf-tools/pdf-to-jpg",
  "/pdf-tools/add-page-numbers",
  "/pdf-tools/add-watermark",
  "/pdf-tools/protect-pdf",
  "/pdf-tools/sign-pdf",
];

test.describe("All pages load without errors", () => {
  for (const route of allRoutes) {
    test(`${route} loads successfully`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));

      const response = await page.goto(route, { waitUntil: "domcontentloaded" });

      // Page returns 200
      expect(response?.status()).toBe(200);

      // Page has a title
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      // No H1 missing
      const h1 = page.locator("h1").first();
      if (route !== "/") {
        await expect(h1).toBeVisible({ timeout: 5000 });
      }

      // No console errors (ignoring hydration warnings)
      const realErrors = errors.filter(
        (e) => !e.includes("Hydration") && !e.includes("hydrat")
      );
      expect(realErrors).toHaveLength(0);
    });
  }
});
