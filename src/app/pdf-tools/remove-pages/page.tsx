import type { Metadata } from "next";
import RemovePagesPdfClient from "./Client";

export const metadata: Metadata = {
  title: "Remove Pages from PDF Online Free | gendox",
  description: "Delete specific pages from a PDF file online for free. No sign-up needed. Your files never leave your browser.",
  openGraph: {
    title: "Remove Pages from PDF Online Free | gendox",
    description: "Delete specific pages from a PDF file online for free. No sign-up needed. Your files never leave your browser.",
    type: "website",
  },
};

export default function RemovePagesPdfPage() {
  return <RemovePagesPdfClient />;
}
