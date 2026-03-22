import { getToolMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getToolJsonLd } from "@/lib/structured-data";

const meta = getToolMetadata("rotate");
export const metadata = meta;

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd("rotate", meta.title as string, meta.description as string, "/pdf-tools/rotate");
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
