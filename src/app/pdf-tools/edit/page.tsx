import type { Metadata } from "next";
import EditPdfClient from "./Client";

export const metadata: Metadata = {
  title: "Edit PDF Online Free — Fill Forms, Add Text & Annotate | gendox",
  description:
    "Edit PDF files online for free. Fill forms, add text, draw annotations, and download the modified PDF. No sign-up, no software to install. Runs in your browser.",
  alternates: { canonical: "https://gendox.io/pdf-tools/edit" },
  openGraph: {
    title: "Edit PDF Online Free — Fill Forms, Add Text & Annotate | gendox",
    description:
      "Edit PDF files online for free. Fill forms, add text, draw annotations. No sign-up required.",
    type: "website",
    url: "https://gendox.io/pdf-tools/edit",
    siteName: "gendox",
  },
};

export default function EditPdfPage() {
  return <EditPdfClient />;
}
