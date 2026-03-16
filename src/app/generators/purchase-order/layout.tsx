import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("purchase-order");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
