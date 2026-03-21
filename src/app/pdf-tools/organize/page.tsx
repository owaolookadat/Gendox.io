import type { Metadata } from "next";
import OrganizePdfClient from "./Client";

export const metadata: Metadata = {
  title: "Organize PDF — Reorder Pages Online Free | gendox",
  description: "Drag and drop to reorder PDF pages. Rearrange your document in seconds. Free, no sign-up, no file upload.",
  openGraph: {
    title: "Organize PDF — Reorder Pages Online Free | gendox",
    description: "Drag and drop to reorder PDF pages. Rearrange your document in seconds. Free, no sign-up, no file upload.",
    type: "website",
  },
};

export default function OrganizePdfPage() {
  return <OrganizePdfClient />;
}
