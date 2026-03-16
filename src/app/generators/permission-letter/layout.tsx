import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("permission-letter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
