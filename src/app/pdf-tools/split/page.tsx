import type { Metadata } from "next";
import SplitPdfClient from "./Client";

export const metadata: Metadata = {
  title: "Split PDF — Extract Pages from PDF Online Free | gendox",
  description: "Split a PDF into separate files by page ranges. Free online tool, no sign-up required. Runs in your browser — your files stay private.",
  openGraph: {
    title: "Split PDF — Extract Pages from PDF Online Free | gendox",
    description: "Split a PDF into separate files by page ranges. Free online tool, no sign-up required. Runs in your browser — your files stay private.",
    type: "website",
  },
};

export default function SplitPdfPage() {
  return <SplitPdfClient />;
}
