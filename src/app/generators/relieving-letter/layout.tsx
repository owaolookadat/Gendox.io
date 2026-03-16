import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("relieving-letter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
