import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("partnership-agreement");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
