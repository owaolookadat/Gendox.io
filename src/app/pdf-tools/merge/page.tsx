import type { Metadata } from "next";
import MergePdfClient from "./Client";

export const metadata: Metadata = {
  title: "Merge PDF — Combine PDF Files Online Free | gendox",
  description: "Merge multiple PDF files into one document online for free. No sign-up, no watermark. Fast, secure, and runs entirely in your browser.",
  openGraph: {
    title: "Merge PDF — Combine PDF Files Online Free | gendox",
    description: "Merge multiple PDF files into one document online for free. No sign-up, no watermark. Fast, secure, and runs entirely in your browser.",
    type: "website",
  },
};

export default function MergePdfPage() {
  return <MergePdfClient />;
}
