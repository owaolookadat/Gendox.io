import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("rental-agreement");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
