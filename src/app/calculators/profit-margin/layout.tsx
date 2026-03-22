import { getToolMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getToolJsonLd } from "@/lib/structured-data";

const meta = getToolMetadata("profit-margin");
export const metadata = meta;

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd("profit-margin", meta.title as string, meta.description as string, "/calculators/profit-margin");
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
