import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("project-brief");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
