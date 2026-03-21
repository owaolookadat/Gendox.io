import type { Metadata } from "next";
import PdfToJpgClient from "./Client";

export const metadata: Metadata = {
  title: "PDF to JPG — Convert PDF to Images Online Free | gendox",
  description: "Convert PDF pages to JPG images online for free. High quality output, no sign-up required. Runs in your browser.",
  openGraph: {
    title: "PDF to JPG — Convert PDF to Images Online Free | gendox",
    description: "Convert PDF pages to JPG images online for free. High quality output, no sign-up required. Runs in your browser.",
    type: "website",
  },
};

export default function PdfToJpgPage() {
  return <PdfToJpgClient />;
}
