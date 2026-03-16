import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("resume");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
