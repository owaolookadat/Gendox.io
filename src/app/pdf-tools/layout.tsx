import type { Metadata } from "next";

const pdfToolMeta: Record<string, { title: string; description: string }> = {
  merge: {
    title: "Merge PDF — Combine PDF Files Online Free | gendox",
    description: "Merge multiple PDF files into one document online for free. No sign-up, no watermark. Fast, secure, and runs entirely in your browser.",
  },
  split: {
    title: "Split PDF — Extract Pages from PDF Online Free | gendox",
    description: "Split a PDF into separate files by page ranges. Free online tool, no sign-up required. Runs in your browser — your files stay private.",
  },
  rotate: {
    title: "Rotate PDF Pages Online Free | gendox",
    description: "Rotate individual or all pages in a PDF. 90°, 180°, 270° rotation. Free, no sign-up, no upload to servers.",
  },
  "remove-pages": {
    title: "Remove Pages from PDF Online Free | gendox",
    description: "Delete specific pages from a PDF file online for free. No sign-up needed. Your files never leave your browser.",
  },
  "extract-pages": {
    title: "Extract Pages from PDF Online Free | gendox",
    description: "Extract specific pages from a PDF into a new file. Free online tool, no sign-up. Processed entirely in your browser.",
  },
  organize: {
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
  "add-page-numbers": {
    title: "Add Page Numbers to PDF Online Free | gendox",
    description: "Add page numbers to any PDF document for free. Choose position and format. No sign-up, processed in your browser.",
  },
  "add-watermark": {
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
  edit: {
    title: "Edit PDF Online Free — Fill Forms, Add Text & Annotate | gendox",
    description: "Edit PDF files online for free. Fill forms, add text, draw annotations, and download the modified PDF. No sign-up required.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool?: string[] }>;
}): Promise<Metadata> {
  // This layout wraps /pdf-tools/[slug]/page.tsx routes
  // We can't access the slug from params in a layout, so we use a default
  return {
    title: "Free PDF Tools — Edit, Merge, Split & More | gendox",
    description: "Free online PDF tools. Merge, split, rotate, compress, convert PDFs and more. No sign-up, no watermark. Runs entirely in your browser.",
    openGraph: {
      title: "Free PDF Tools — Edit, Merge, Split & More | gendox",
      description: "Free online PDF tools. Merge, split, rotate, compress, convert PDFs and more. No sign-up, no watermark.",
      type: "website",
    },
  };
}

// Export the meta lookup for use by individual page metadata files
export { pdfToolMeta };

export default function PdfToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
