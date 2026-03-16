import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("apology-letter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
