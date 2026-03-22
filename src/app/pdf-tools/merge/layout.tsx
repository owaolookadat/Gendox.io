import { getToolMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getToolJsonLd } from "@/lib/structured-data";

const meta = getToolMetadata("merge");
export const metadata = meta;

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd("merge", meta.title as string, meta.description as string, "/pdf-tools/merge");
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
