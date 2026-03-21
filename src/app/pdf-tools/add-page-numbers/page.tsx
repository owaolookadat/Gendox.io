import type { Metadata } from "next";
import AddPageNumbersClient from "./Client";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF Online Free | gendox",
  description: "Add page numbers to any PDF document for free. Choose position and format. No sign-up, processed in your browser.",
  openGraph: {
    title: "Add Page Numbers to PDF Online Free | gendox",
    description: "Add page numbers to any PDF document for free. Choose position and format. No sign-up, processed in your browser.",
    type: "website",
  },
};

export default function AddPageNumbersPage() {
  return <AddPageNumbersClient />;
}
