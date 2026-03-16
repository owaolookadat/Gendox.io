import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("nda");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
