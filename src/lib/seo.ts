import type { Metadata } from "next";

const BASE_URL = "https://gendox.io";

const toolMeta: Record<string, { title: string; description: string; path?: string }> = {
  "resume": {
    title: "Free Resume / CV Generator — Create & Download Instantly | gendox",
    description: "Create a professional resume or CV online for free. Add experience, education, skills and download as Word document. No sign-up needed.",
    path: "/generators/resume",
  },
  "resignation-letter": {
    title: "Resignation Letter Generator — Free, Instant Download | gendox",
    description: "Generate a professional resignation letter in seconds. Free online tool, no sign-up required. Download as Word document instantly.",
    path: "/generators/resignation-letter",
  },
  "cover-letter": {
    title: "Cover Letter Generator — Free Online Tool | gendox",
    description: "Create a professional cover letter in seconds. Free online tool, no sign-up. Download as Word document instantly.",
    path: "/generators/cover-letter",
  },
  "business-letter": {
    title: "Business Letter Generator — Free Online Tool | gendox",
    description: "Write a formal business letter online for free. No sign-up required. Download as Word document instantly.",
    path: "/generators/business-letter",
  },
  "reference-letter": {
    title: "Reference Letter Generator — Free Online Tool | gendox",
    description: "Create a professional reference letter in seconds. Free, no sign-up. Download as Word document.",
    path: "/generators/reference-letter",
  },
  "recommendation-letter": {
    title: "Recommendation Letter Generator — Free Online Tool | gendox",
    description: "Write a strong recommendation letter online for free. No sign-up required. Instant Word document download.",
    path: "/generators/recommendation-letter",
  },
  "offer-letter": {
    title: "Offer Letter Generator — Free Online Tool | gendox",
    description: "Generate a formal job offer letter instantly. Free online tool, no sign-up. Download as Word document.",
    path: "/generators/offer-letter",
  },
  "termination-letter": {
    title: "Termination Letter Generator — Free Online Tool | gendox",
    description: "Create a professional termination letter in seconds. Free, no sign-up required. Download as Word document.",
    path: "/generators/termination-letter",
  },
  "warning-letter": {
    title: "Warning Letter Generator — Free Online Tool | gendox",
    description: "Generate an employee warning letter online for free. No sign-up. Download as Word document instantly.",
    path: "/generators/warning-letter",
  },
  "complaint-letter": {
    title: "Complaint Letter Generator — Free Online Tool | gendox",
    description: "Write a formal complaint letter in seconds. Free online tool, no sign-up. Download as Word document.",
    path: "/generators/complaint-letter",
  },
  "thank-you-letter": {
    title: "Thank You Letter Generator — Free Online Tool | gendox",
    description: "Create a professional thank you letter instantly. Free, no sign-up required. Download as Word document.",
    path: "/generators/thank-you-letter",
  },
  "letter-of-intent": {
    title: "Letter of Intent Generator — Free Online Tool | gendox",
    description: "Draft a formal letter of intent online for free. No sign-up required. Download as Word document instantly.",
    path: "/generators/letter-of-intent",
  },
  "apology-letter": {
    title: "Apology Letter Generator — Free Online Tool | gendox",
    description: "Write a sincere apology letter in seconds. Free online tool, no sign-up. Download as Word document.",
    path: "/generators/apology-letter",
  },
  "authorization-letter": {
    title: "Authorization Letter Generator — Free Online Tool | gendox",
    description: "Create an authorization letter instantly. Free, no sign-up required. Download as Word document.",
    path: "/generators/authorization-letter",
  },
  "permission-letter": {
    title: "Permission Letter Generator — Free Online Tool | gendox",
    description: "Generate a formal permission request letter for free. No sign-up. Download as Word document instantly.",
    path: "/generators/permission-letter",
  },
  "sponsorship-letter": {
    title: "Sponsorship Letter Generator — Free Online Tool | gendox",
    description: "Write a compelling sponsorship request letter online. Free, no sign-up. Download as Word document.",
    path: "/generators/sponsorship-letter",
  },
  "demand-letter": {
    title: "Demand Letter Generator — Free Online Tool | gendox",
    description: "Create a formal demand letter in seconds. Free online tool, no sign-up required. Download as Word document.",
    path: "/generators/demand-letter",
  },
  "invoice": {
    title: "Free Invoice Generator — Create & Download Invoice Instantly | gendox",
    description: "Create a professional invoice online for free. Add your details, line items, and download as a Word document. No sign-up needed.",
    path: "/generators/invoice",
  },
  "receipt": {
    title: "Receipt Generator — Free Online Tool | gendox",
    description: "Generate a professional receipt instantly. Free, no sign-up required. Download as Word document.",
    path: "/generators/receipt",
  },
  "purchase-order": {
    title: "Purchase Order Generator — Free Online Tool | gendox",
    description: "Create a purchase order document online for free. No sign-up needed. Download as Word document instantly.",
    path: "/generators/purchase-order",
  },
  "quotation": {
    title: "Quotation Generator — Free Online Tool | gendox",
    description: "Generate a professional price quotation in seconds. Free, no sign-up. Download as Word document.",
    path: "/generators/quotation",
  },
  "business-proposal": {
    title: "Business Proposal Generator — Free Online Tool | gendox",
    description: "Draft a professional business proposal online for free. No sign-up required. Download as Word document.",
    path: "/generators/business-proposal",
  },
  "meeting-minutes": {
    title: "Meeting Minutes Generator — Free Online Tool | gendox",
    description: "Document meeting minutes professionally in seconds. Free, no sign-up. Download as Word document.",
    path: "/generators/meeting-minutes",
  },
  "memo": {
    title: "Memo Generator — Free Online Tool | gendox",
    description: "Create a professional internal memo instantly. Free online tool, no sign-up. Download as Word document.",
    path: "/generators/memo",
  },
  "press-release": {
    title: "Press Release Generator — Free Online Tool | gendox",
    description: "Write a professional press release in seconds. Free, no sign-up required. Download as Word document.",
    path: "/generators/press-release",
  },
  "job-description": {
    title: "Job Description Generator — Free Online Tool | gendox",
    description: "Create a detailed job description online for free. No sign-up needed. Download as Word document instantly.",
    path: "/generators/job-description",
  },
  "company-profile": {
    title: "Company Profile Generator — Free Online Tool | gendox",
    description: "Generate a professional company profile in seconds. Free, no sign-up. Download as Word document.",
    path: "/generators/company-profile",
  },
  "scope-of-work": {
    title: "Scope of Work Generator — Free Online Tool | gendox",
    description: "Define your project scope clearly with our free tool. No sign-up required. Download as Word document.",
    path: "/generators/scope-of-work",
  },
  "project-brief": {
    title: "Project Brief Generator — Free Online Tool | gendox",
    description: "Create a concise project brief online for free. No sign-up needed. Download as Word document instantly.",
    path: "/generators/project-brief",
  },
  "nda": {
    title: "NDA Generator — Free Non-Disclosure Agreement | gendox",
    description: "Generate a non-disclosure agreement in seconds. Free online tool, no sign-up. Download as Word document.",
    path: "/generators/nda",
  },
  "employment-contract": {
    title: "Employment Contract Generator — Free Online Tool | gendox",
    description: "Create an employment contract online for free. No sign-up required. Download as Word document instantly.",
    path: "/generators/employment-contract",
  },
  "service-agreement": {
    title: "Service Agreement Generator — Free Online Tool | gendox",
    description: "Draft a professional service agreement in seconds. Free, no sign-up. Download as Word document.",
    path: "/generators/service-agreement",
  },
  "rental-agreement": {
    title: "Rental Agreement Generator — Free Online Tool | gendox",
    description: "Generate a rental/lease agreement online for free. No sign-up needed. Download as Word document.",
    path: "/generators/rental-agreement",
  },
  "loan-agreement": {
    title: "Loan Agreement Generator — Free Online Tool | gendox",
    description: "Create a loan agreement document in seconds. Free, no sign-up required. Download as Word document.",
    path: "/generators/loan-agreement",
  },
  "partnership-agreement": {
    title: "Partnership Agreement Generator — Free Online Tool | gendox",
    description: "Draft a partnership agreement online for free. No sign-up. Download as Word document instantly.",
    path: "/generators/partnership-agreement",
  },
  "bill-of-sale": {
    title: "Bill of Sale Generator — Free Online Tool | gendox",
    description: "Create a bill of sale document in seconds. Free online tool, no sign-up. Download as Word document.",
    path: "/generators/bill-of-sale",
  },
  "promissory-note": {
    title: "Promissory Note Generator — Free Online Tool | gendox",
    description: "Generate a promissory note online for free. No sign-up required. Download as Word document instantly.",
    path: "/generators/promissory-note",
  },
  "eviction-notice": {
    title: "Eviction Notice Generator — Free Online Tool | gendox",
    description: "Create a formal eviction notice in seconds. Free, no sign-up. Download as Word document.",
    path: "/generators/eviction-notice",
  },
  "power-of-attorney": {
    title: "Power of Attorney Generator — Free Online Tool | gendox",
    description: "Generate a power of attorney document for free. No sign-up required. Download as Word document.",
    path: "/generators/power-of-attorney",
  },
  "affidavit": {
    title: "Affidavit Generator — Free Online Tool | gendox",
    description: "Create a sworn affidavit document in seconds. Free, no sign-up. Download as Word document.",
    path: "/generators/affidavit",
  },
  "consent-form": {
    title: "Consent Form Generator — Free Online Tool | gendox",
    description: "Generate a professional consent form online for free. No sign-up needed. Download as Word document.",
    path: "/generators/consent-form",
  },
  "waiver-form": {
    title: "Waiver Form Generator — Free Online Tool | gendox",
    description: "Create a liability waiver form in seconds. Free online tool, no sign-up. Download as Word document.",
    path: "/generators/waiver-form",
  },
  "pay-stub": {
    title: "Pay Stub Generator — Free Online Tool | gendox",
    description: "Generate a professional pay stub instantly. Free, no sign-up required. Download as Word document.",
    path: "/generators/pay-stub",
  },
  "experience-certificate": {
    title: "Experience Certificate Generator — Free Online Tool | gendox",
    description: "Create an experience certificate in seconds. Free, no sign-up. Download as Word document.",
    path: "/generators/experience-certificate",
  },
  "internship-certificate": {
    title: "Internship Certificate Generator — Free Online Tool | gendox",
    description: "Generate an internship certificate online for free. No sign-up needed. Download as Word document.",
    path: "/generators/internship-certificate",
  },
  "leave-application": {
    title: "Leave Application Generator — Free Online Tool | gendox",
    description: "Create a formal leave application in seconds. Free, no sign-up required. Download as Word document.",
    path: "/generators/leave-application",
  },
  "performance-review": {
    title: "Performance Review Generator — Free Online Tool | gendox",
    description: "Generate a performance review document for free. No sign-up. Download as Word document instantly.",
    path: "/generators/performance-review",
  },
  "joining-letter": {
    title: "Joining Letter Generator — Free Online Tool | gendox",
    description: "Create a joining/appointment letter online for free. No sign-up needed. Download as Word document.",
    path: "/generators/joining-letter",
  },
  "relieving-letter": {
    title: "Relieving Letter Generator — Free Online Tool | gendox",
    description: "Generate a relieving letter in seconds. Free, no sign-up required. Download as Word document.",
    path: "/generators/relieving-letter",
  },
  "certificate-of-completion": {
    title: "Certificate of Completion Generator — Free Online Tool | gendox",
    description: "Create a certificate of completion online for free. No sign-up. Download as Word document instantly.",
    path: "/generators/certificate-of-completion",
  },
  "award-certificate": {
    title: "Award Certificate Generator — Free Online Tool | gendox",
    description: "Generate a professional award certificate in seconds. Free, no sign-up. Download as Word document.",
    path: "/generators/award-certificate",
  },
  // PDF Tools — keys match URL slugs exactly
  "merge": {
    title: "Merge PDF — Combine PDF Files Online Free | gendox",
    description: "Merge multiple PDF files into one document online for free. No sign-up, no watermark. Fast, secure, and runs entirely in your browser.",
    path: "/pdf-tools/merge",
  },
  "split": {
    title: "Split PDF — Extract Pages from PDF Online Free | gendox",
    description: "Split a PDF into separate files by page ranges. Free online tool, no sign-up required. Runs in your browser — your files stay private.",
    path: "/pdf-tools/split",
  },
  "rotate": {
    title: "Rotate PDF Pages Online Free | gendox",
    description: "Rotate individual or all pages in a PDF. 90°, 180°, 270° rotation. Free, no sign-up, no upload to servers.",
    path: "/pdf-tools/rotate",
  },
  "remove-pages": {
    title: "Remove Pages from PDF Online Free | gendox",
    description: "Delete specific pages from a PDF file online for free. No sign-up needed. Your files never leave your browser.",
    path: "/pdf-tools/remove-pages",
  },
  "extract-pages": {
    title: "Extract Pages from PDF Online Free | gendox",
    description: "Extract specific pages from a PDF into a new file. Free online tool, no sign-up. Processed entirely in your browser.",
    path: "/pdf-tools/extract-pages",
  },
  "organize": {
    title: "Organize PDF — Reorder Pages Online Free | gendox",
    description: "Drag and drop to reorder PDF pages. Rearrange your document in seconds. Free, no sign-up, no file upload.",
    path: "/pdf-tools/organize",
  },
  "jpg-to-pdf": {
    title: "JPG to PDF — Convert Images to PDF Online Free | gendox",
    description: "Convert JPG, PNG, and other images to PDF online for free. Combine multiple images into one PDF. No sign-up needed.",
    path: "/pdf-tools/jpg-to-pdf",
  },
  "pdf-to-jpg": {
    title: "PDF to JPG — Convert PDF to Images Online Free | gendox",
    description: "Convert PDF pages to JPG images online for free. High quality output, no sign-up required. Runs in your browser.",
    path: "/pdf-tools/pdf-to-jpg",
  },
  "add-page-numbers": {
    title: "Add Page Numbers to PDF Online Free | gendox",
    description: "Add page numbers to any PDF document for free. Choose position and format. No sign-up, processed in your browser.",
    path: "/pdf-tools/add-page-numbers",
  },
  "add-watermark": {
    title: "Add Watermark to PDF Online Free | gendox",
    description: "Add text watermarks to PDF files online for free. Customize text, size, and opacity. No sign-up required.",
    path: "/pdf-tools/add-watermark",
  },
  "protect-pdf": {
    title: "Protect PDF — Password Protect PDF Online Free | gendox",
    description: "Add password protection to your PDF files online for free. Encrypt and secure your documents. No sign-up needed.",
    path: "/pdf-tools/protect-pdf",
  },
  "sign-pdf": {
    title: "Sign PDF — Add Signature to PDF Online Free | gendox",
    description: "Draw or type your signature and add it to any PDF. Free online tool, no sign-up. Your documents stay private.",
    path: "/pdf-tools/sign-pdf",
  },
  // Calculator
  "profit-margin": {
    title: "Profit Margin Calculator — Free Online Tool | gendox",
    description: "Calculate gross profit margin, net profit margin, and markup instantly. Free online calculator, no sign-up required.",
    path: "/calculators/profit-margin",
  },
};

export function getToolMetadata(slug: string): Metadata {
  const meta = toolMeta[slug];
  if (!meta) {
    return {
      title: "Free Document Generator | gendox",
      description: "Generate professional documents online for free. No sign-up required.",
    };
  }

  const canonical = meta.path ? `${BASE_URL}${meta.path}` : undefined;

  return {
    title: meta.title,
    description: meta.description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      url: canonical,
      siteName: "gendox",
    },
    twitter: {
      card: "summary",
      title: meta.title,
      description: meta.description,
    },
  };
}
