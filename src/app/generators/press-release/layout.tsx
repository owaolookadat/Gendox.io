import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("press-release");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
