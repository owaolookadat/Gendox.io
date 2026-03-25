import type { Metadata } from "next";
import HubClient from "./HubClient";

export const metadata: Metadata = {
  title: "Free PDF Tools — Edit, Merge, Split, Sign & More | gendox",
  description:
    "All-in-one PDF toolbox. Upload your PDF once, then merge, split, rotate, sign, edit, add watermarks, and more. Free, no sign-up, runs in your browser.",
  alternates: { canonical: "https://gendox.io/pdf-tools" },
  openGraph: {
    title: "Free PDF Tools — Edit, Merge, Split, Sign & More | gendox",
    description:
      "All-in-one PDF toolbox. Upload once, pick an action. Free, no sign-up.",
    type: "website",
    url: "https://gendox.io/pdf-tools",
    siteName: "gendox",
  },
};

export default function PdfToolsPage() {
  return <HubClient />;
}
