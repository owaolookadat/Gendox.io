import { getToolMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getToolJsonLd } from "@/lib/structured-data";

const meta = getToolMetadata("leave-application");
export const metadata = meta;

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd("leave-application", meta.title as string, meta.description as string);
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
