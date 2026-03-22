import { getToolMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getToolJsonLd } from "@/lib/structured-data";

const meta = getToolMetadata("sign-pdf");
export const metadata = meta;

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd("sign-pdf", meta.title as string, meta.description as string, "/pdf-tools/sign-pdf");
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
