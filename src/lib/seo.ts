import type { Metadata } from "next";

const toolMeta: Record<string, { title: string; description: string }> = {
  "resume": {
    title: "Free Resume / CV Generator — Create & Download Instantly | gendox",
    description: "Create a professional resume or CV online for free. Add experience, education, skills and download as Word document. No sign-up needed.",
  },
  "resignation-letter": {
    title: "Resignation Letter Generator — Free, Instant Download | gendox",
    description: "Generate a professional resignation letter in seconds. Free online tool, no sign-up required. Download as Word document instantly.",
  },
  "cover-letter": {
    title: "Cover Letter Generator — Free Online Tool | gendox",
    description: "Create a professional cover letter in seconds. Free online tool, no sign-up. Download as Word document instantly.",
  },
  "business-letter": {
    title: "Business Letter Generator — Free Online Tool | gendox",
    description: "Write a formal business letter online for free. No sign-up required. Download as Word document instantly.",
  },
  "reference-letter": {
    title: "Reference Letter Generator — Free Online Tool | gendox",
    description: "Create a professional reference letter in seconds. Free, no sign-up. Download as Word document.",
  },
  "recommendation-letter": {
    title: "Recommendation Letter Generator — Free Online Tool | gendox",
    description: "Write a strong recommendation letter online for free. No sign-up required. Instant Word document download.",
  },
  "offer-letter": {
    title: "Offer Letter Generator — Free Online Tool | gendox",
    description: "Generate a formal job offer letter instantly. Free online tool, no sign-up. Download as Word document.",
  },
  "termination-letter": {
    title: "Termination Letter Generator — Free Online Tool | gendox",
    description: "Create a professional termination letter in seconds. Free, no sign-up required. Download as Word document.",
  },
  "warning-letter": {
    title: "Warning Letter Generator — Free Online Tool | gendox",
    description: "Generate an employee warning letter online for free. No sign-up. Download as Word document instantly.",
  },
  "complaint-letter": {
    title: "Complaint Letter Generator — Free Online Tool | gendox",
    description: "Write a formal complaint letter in seconds. Free online tool, no sign-up. Download as Word document.",
  },
  "thank-you-letter": {
    title: "Thank You Letter Generator — Free Online Tool | gendox",
    description: "Create a professional thank you letter instantly. Free, no sign-up required. Download as Word document.",
  },
  "letter-of-intent": {
    title: "Letter of Intent Generator — Free Online Tool | gendox",
    description: "Draft a formal letter of intent online for free. No sign-up required. Download as Word document instantly.",
  },
  "apology-letter": {
    title: "Apology Letter Generator — Free Online Tool | gendox",
    description: "Write a sincere apology letter in seconds. Free online tool, no sign-up. Download as Word document.",
  },
  "authorization-letter": {
    title: "Authorization Letter Generator — Free Online Tool | gendox",
    description: "Create an authorization letter instantly. Free, no sign-up required. Download as Word document.",
  },
  "permission-letter": {
    title: "Permission Letter Generator — Free Online Tool | gendox",
    description: "Generate a formal permission request letter for free. No sign-up. Download as Word document instantly.",
  },
  "sponsorship-letter": {
    title: "Sponsorship Letter Generator — Free Online Tool | gendox",
    description: "Write a compelling sponsorship request letter online. Free, no sign-up. Download as Word document.",
  },
  "demand-letter": {
    title: "Demand Letter Generator — Free Online Tool | gendox",
    description: "Create a formal demand letter in seconds. Free online tool, no sign-up required. Download as Word document.",
  },
  "invoice": {
    title: "Free Invoice Generator — Create & Download Invoice Instantly | gendox",
    description: "Create a professional invoice online for free. Add your details, line items, and download as a Word document. No sign-up needed.",
  },
  "receipt": {
    title: "Receipt Generator — Free Online Tool | gendox",
    description: "Generate a professional receipt instantly. Free, no sign-up required. Download as Word document.",
  },
  "purchase-order": {
    title: "Purchase Order Generator — Free Online Tool | gendox",
    description: "Create a purchase order document online for free. No sign-up needed. Download as Word document instantly.",
  },
  "quotation": {
    title: "Quotation Generator — Free Online Tool | gendox",
    description: "Generate a professional price quotation in seconds. Free, no sign-up. Download as Word document.",
  },
  "business-proposal": {
    title: "Business Proposal Generator — Free Online Tool | gendox",
    description: "Draft a professional business proposal online for free. No sign-up required. Download as Word document.",
  },
  "meeting-minutes": {
    title: "Meeting Minutes Generator — Free Online Tool | gendox",
    description: "Document meeting minutes professionally in seconds. Free, no sign-up. Download as Word document.",
  },
  "memo": {
    title: "Memo Generator — Free Online Tool | gendox",
    description: "Create a professional internal memo instantly. Free online tool, no sign-up. Download as Word document.",
  },
  "press-release": {
    title: "Press Release Generator — Free Online Tool | gendox",
    description: "Write a professional press release in seconds. Free, no sign-up required. Download as Word document.",
  },
  "job-description": {
    title: "Job Description Generator — Free Online Tool | gendox",
    description: "Create a detailed job description online for free. No sign-up needed. Download as Word document instantly.",
  },
  "company-profile": {
    title: "Company Profile Generator — Free Online Tool | gendox",
    description: "Generate a professional company profile in seconds. Free, no sign-up. Download as Word document.",
  },
  "scope-of-work": {
    title: "Scope of Work Generator — Free Online Tool | gendox",
    description: "Define your project scope clearly with our free tool. No sign-up required. Download as Word document.",
  },
  "project-brief": {
    title: "Project Brief Generator — Free Online Tool | gendox",
    description: "Create a concise project brief online for free. No sign-up needed. Download as Word document instantly.",
  },
  "nda": {
    title: "NDA Generator — Free Non-Disclosure Agreement | gendox",
    description: "Generate a non-disclosure agreement in seconds. Free online tool, no sign-up. Download as Word document.",
  },
  "employment-contract": {
    title: "Employment Contract Generator — Free Online Tool | gendox",
    description: "Create an employment contract online for free. No sign-up required. Download as Word document instantly.",
  },
  "service-agreement": {
    title: "Service Agreement Generator — Free Online Tool | gendox",
    description: "Draft a professional service agreement in seconds. Free, no sign-up. Download as Word document.",
  },
  "rental-agreement": {
    title: "Rental Agreement Generator — Free Online Tool | gendox",
    description: "Generate a rental/lease agreement online for free. No sign-up needed. Download as Word document.",
  },
  "loan-agreement": {
    title: "Loan Agreement Generator — Free Online Tool | gendox",
    description: "Create a loan agreement document in seconds. Free, no sign-up required. Download as Word document.",
  },
  "partnership-agreement": {
    title: "Partnership Agreement Generator — Free Online Tool | gendox",
    description: "Draft a partnership agreement online for free. No sign-up. Download as Word document instantly.",
  },
  "bill-of-sale": {
    title: "Bill of Sale Generator — Free Online Tool | gendox",
    description: "Create a bill of sale document in seconds. Free online tool, no sign-up. Download as Word document.",
  },
  "promissory-note": {
    title: "Promissory Note Generator — Free Online Tool | gendox",
    description: "Generate a promissory note online for free. No sign-up required. Download as Word document instantly.",
  },
  "eviction-notice": {
    title: "Eviction Notice Generator — Free Online Tool | gendox",
    description: "Create a formal eviction notice in seconds. Free, no sign-up. Download as Word document.",
  },
  "power-of-attorney": {
    title: "Power of Attorney Generator — Free Online Tool | gendox",
    description: "Generate a power of attorney document for free. No sign-up required. Download as Word document.",
  },
  "affidavit": {
    title: "Affidavit Generator — Free Online Tool | gendox",
    description: "Create a sworn affidavit document in seconds. Free, no sign-up. Download as Word document.",
  },
  "consent-form": {
    title: "Consent Form Generator — Free Online Tool | gendox",
    description: "Generate a professional consent form online for free. No sign-up needed. Download as Word document.",
  },
  "waiver-form": {
    title: "Waiver Form Generator — Free Online Tool | gendox",
    description: "Create a liability waiver form in seconds. Free online tool, no sign-up. Download as Word document.",
  },
  "pay-stub": {
    title: "Pay Stub Generator — Free Online Tool | gendox",
    description: "Generate a professional pay stub instantly. Free, no sign-up required. Download as Word document.",
  },
  "experience-certificate": {
    title: "Experience Certificate Generator — Free Online Tool | gendox",
    description: "Create an experience certificate in seconds. Free, no sign-up. Download as Word document.",
  },
  "internship-certificate": {
    title: "Internship Certificate Generator — Free Online Tool | gendox",
    description: "Generate an internship certificate online for free. No sign-up needed. Download as Word document.",
  },
  "leave-application": {
    title: "Leave Application Generator — Free Online Tool | gendox",
    description: "Create a formal leave application in seconds. Free, no sign-up required. Download as Word document.",
  },
  "performance-review": {
    title: "Performance Review Generator — Free Online Tool | gendox",
    description: "Generate a performance review document for free. No sign-up. Download as Word document instantly.",
  },
  "joining-letter": {
    title: "Joining Letter Generator — Free Online Tool | gendox",
    description: "Create a joining/appointment letter online for free. No sign-up needed. Download as Word document.",
  },
  "relieving-letter": {
    title: "Relieving Letter Generator — Free Online Tool | gendox",
    description: "Generate a relieving letter in seconds. Free, no sign-up required. Download as Word document.",
  },
  "certificate-of-completion": {
    title: "Certificate of Completion Generator — Free Online Tool | gendox",
    description: "Create a certificate of completion online for free. No sign-up. Download as Word document instantly.",
  },
  "award-certificate": {
    title: "Award Certificate Generator — Free Online Tool | gendox",
    description: "Generate a professional award certificate in seconds. Free, no sign-up. Download as Word document.",
  },
  // PDF Tools
  "merge-pdf": {
    title: "Merge PDF — Combine PDF Files Online Free | gendox",
    description: "Merge multiple PDF files into one document online for free. No sign-up, no watermark. Fast, secure, and runs entirely in your browser.",
  },
  "split-pdf": {
    title: "Split PDF — Extract Pages from PDF Online Free | gendox",
    description: "Split a PDF into separate files by page ranges. Free online tool, no sign-up required. Runs in your browser — your files stay private.",
  },
  "rotate-pdf": {
    title: "Rotate PDF Pages Online Free | gendox",
    description: "Rotate individual or all pages in a PDF. 90°, 180°, 270° rotation. Free, no sign-up, no upload to servers.",
  },
  "remove-pages-pdf": {
    title: "Remove Pages from PDF Online Free | gendox",
    description: "Delete specific pages from a PDF file online for free. No sign-up needed. Your files never leave your browser.",
  },
  "extract-pages-pdf": {
    title: "Extract Pages from PDF Online Free | gendox",
    description: "Extract specific pages from a PDF into a new file. Free online tool, no sign-up. Processed entirely in your browser.",
  },
  "organize-pdf": {
    title: "Organize PDF — Reorder Pages Online Free | gendox",
    description: "Drag and drop to reorder PDF pages. Rearrange your document in seconds. Free, no sign-up, no file upload.",
  },
  "jpg-to-pdf": {
    title: "JPG to PDF — Convert Images to PDF Online Free | gendox",
    description: "Convert JPG, PNG, and other images to PDF online for free. Combine multiple images into one PDF. No sign-up needed.",
  },
  "pdf-to-jpg": {
    title: "PDF to JPG — Convert PDF to Images Online Free | gendox",
    description: "Convert PDF pages to JPG images online for free. High quality output, no sign-up required. Runs in your browser.",
  },
  "add-page-numbers-pdf": {
    title: "Add Page Numbers to PDF Online Free | gendox",
    description: "Add page numbers to any PDF document for free. Choose position and format. No sign-up, processed in your browser.",
  },
  "add-watermark-pdf": {
    title: "Add Watermark to PDF Online Free | gendox",
    description: "Add text watermarks to PDF files online for free. Customize text, size, and opacity. No sign-up required.",
  },
  "protect-pdf": {
    title: "Protect PDF — Password Protect PDF Online Free | gendox",
    description: "Add password protection to your PDF files online for free. Encrypt and secure your documents. No sign-up needed.",
  },
  "sign-pdf": {
    title: "Sign PDF — Add Signature to PDF Online Free | gendox",
    description: "Draw or type your signature and add it to any PDF. Free online tool, no sign-up. Your documents stay private.",
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
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
    },
  };
}
