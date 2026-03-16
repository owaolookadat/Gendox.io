import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("resignation-letter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
