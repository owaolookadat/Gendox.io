import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("power-of-attorney");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
