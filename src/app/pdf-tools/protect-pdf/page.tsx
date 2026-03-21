import type { Metadata } from "next";
import ProtectPdfClient from "./Client";

export const metadata: Metadata = {
  title: "Protect PDF — Password Protect PDF Online Free | gendox",
  description: "Add password protection to your PDF files online for free. Encrypt and secure your documents. No sign-up needed.",
  openGraph: {
    title: "Protect PDF — Password Protect PDF Online Free | gendox",
    description: "Add password protection to your PDF files online for free. Encrypt and secure your documents. No sign-up needed.",
    type: "website",
  },
};

export default function ProtectPdfPage() {
  return <ProtectPdfClient />;
}
