import { getToolMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getToolJsonLd } from "@/lib/structured-data";

const meta = getToolMetadata("pdf-to-jpg");
export const metadata = meta;

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd("pdf-to-jpg", meta.title as string, meta.description as string, "/pdf-tools/pdf-to-jpg");
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
