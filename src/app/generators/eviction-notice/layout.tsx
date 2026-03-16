import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("eviction-notice");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
