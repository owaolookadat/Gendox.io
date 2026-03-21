import type { Metadata } from "next";
import ExtractPagesPdfClient from "./Client";

export const metadata: Metadata = {
  title: "Extract Pages from PDF Online Free | gendox",
  description: "Extract specific pages from a PDF into a new file. Free online tool, no sign-up. Processed entirely in your browser.",
  openGraph: {
    title: "Extract Pages from PDF Online Free | gendox",
    description: "Extract specific pages from a PDF into a new file. Free online tool, no sign-up. Processed entirely in your browser.",
    type: "website",
  },
};

export default function ExtractPagesPdfPage() {
  return <ExtractPagesPdfClient />;
}
