import type { Metadata } from "next";
import AddWatermarkClient from "./Client";

export const metadata: Metadata = {
  title: "Add Watermark to PDF Online Free | gendox",
  description: "Add text watermarks to PDF files online for free. Customize text, size, and opacity. No sign-up required.",
  openGraph: {
    title: "Add Watermark to PDF Online Free | gendox",
    description: "Add text watermarks to PDF files online for free. Customize text, size, and opacity. No sign-up required.",
    type: "website",
  },
};

export default function AddWatermarkPage() {
  return <AddWatermarkClient />;
}
