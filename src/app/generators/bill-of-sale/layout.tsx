import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("bill-of-sale");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
