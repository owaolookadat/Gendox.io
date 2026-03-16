import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("quotation");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
