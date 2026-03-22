import { getToolMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getToolJsonLd } from "@/lib/structured-data";

const meta = getToolMetadata("add-page-numbers");
export const metadata = meta;

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd("add-page-numbers", meta.title as string, meta.description as string, "/pdf-tools/add-page-numbers");
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
