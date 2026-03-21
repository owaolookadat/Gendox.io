import type { Metadata } from "next";
import JpgToPdfClient from "./Client";

export const metadata: Metadata = {
  title: "JPG to PDF — Convert Images to PDF Online Free | gendox",
  description: "Convert JPG, PNG, and other images to PDF online for free. Combine multiple images into one PDF. No sign-up needed.",
  openGraph: {
    title: "JPG to PDF — Convert Images to PDF Online Free | gendox",
    description: "Convert JPG, PNG, and other images to PDF online for free. Combine multiple images into one PDF. No sign-up needed.",
    type: "website",
  },
};

export default function JpgToPdfPage() {
  return <JpgToPdfClient />;
}
