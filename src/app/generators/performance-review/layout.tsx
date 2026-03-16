import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("performance-review");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
