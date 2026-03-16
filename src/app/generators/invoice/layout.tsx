import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("invoice");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
