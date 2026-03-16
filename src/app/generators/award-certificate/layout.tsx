import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("award-certificate");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
