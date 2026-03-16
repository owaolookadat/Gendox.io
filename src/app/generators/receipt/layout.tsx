import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("receipt");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
