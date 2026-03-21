import type { Metadata } from "next";
import RotatePdfClient from "./Client";

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online Free | gendox",
  description: "Rotate individual or all pages in a PDF. 90°, 180°, 270° rotation. Free, no sign-up, no upload to servers.",
  openGraph: {
    title: "Rotate PDF Pages Online Free | gendox",
    description: "Rotate individual or all pages in a PDF. 90°, 180°, 270° rotation. Free, no sign-up, no upload to servers.",
    type: "website",
  },
};

export default function RotatePdfPage() {
  return <RotatePdfClient />;
}
