import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("recommendation-letter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
