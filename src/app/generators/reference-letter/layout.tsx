import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("reference-letter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
