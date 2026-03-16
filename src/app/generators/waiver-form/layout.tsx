import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("waiver-form");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
