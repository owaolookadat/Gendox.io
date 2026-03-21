import { MetadataRoute } from "next";

const BASE_URL = "https://gendox.io";

const highPriorityRoutes = [
  "/generators/resume",
  "/generators/invoice",
  "/generators/cover-letter",
  "/generators/resignation-letter",
  "/generators/nda",
  "/generators/rental-agreement",
  "/pdf-tools/merge",
  "/pdf-tools/split",
  "/pdf-tools/jpg-to-pdf",
  "/pdf-tools/pdf-to-jpg",
];

const allGeneratorRoutes = [
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
];

const allPdfToolRoutes = [
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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homepage: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];

  const generatorEntries: MetadataRoute.Sitemap = allGeneratorRoutes.map(
    (route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: highPriorityRoutes.includes(route) ? 0.9 : 0.8,
    })
  );

  const pdfToolEntries: MetadataRoute.Sitemap = allPdfToolRoutes.map(
    (route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: highPriorityRoutes.includes(route) ? 0.9 : 0.8,
    })
  );

  const otherPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/calculators/profit-margin`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  return [...homepage, ...generatorEntries, ...pdfToolEntries, ...otherPages];
}
