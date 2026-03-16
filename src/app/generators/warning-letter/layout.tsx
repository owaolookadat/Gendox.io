import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("warning-letter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
