import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("cover-letter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
