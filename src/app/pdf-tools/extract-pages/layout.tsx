import { getToolMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getToolJsonLd } from "@/lib/structured-data";

const meta = getToolMetadata("extract-pages");
export const metadata = meta;

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd("extract-pages", meta.title as string, meta.description as string, "/pdf-tools/extract-pages");
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
