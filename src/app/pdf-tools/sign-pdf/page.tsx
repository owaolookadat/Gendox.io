import type { Metadata } from "next";
import SignPdfClient from "./Client";

export const metadata: Metadata = {
  title: "Sign PDF — Add Signature to PDF Online Free | gendox",
  description: "Draw or type your signature and add it to any PDF. Free online tool, no sign-up. Your documents stay private.",
  openGraph: {
    title: "Sign PDF — Add Signature to PDF Online Free | gendox",
    description: "Draw or type your signature and add it to any PDF. Free online tool, no sign-up. Your documents stay private.",
    type: "website",
  },
};

export default function SignPdfPage() {
  return <SignPdfClient />;
}
