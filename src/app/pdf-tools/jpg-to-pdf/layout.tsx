import { getToolMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getToolJsonLd } from "@/lib/structured-data";

const meta = getToolMetadata("jpg-to-pdf");
export const metadata = meta;

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd("jpg-to-pdf", meta.title as string, meta.description as string, "/pdf-tools/jpg-to-pdf");
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
