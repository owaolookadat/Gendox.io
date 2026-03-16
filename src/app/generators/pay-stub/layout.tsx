import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("pay-stub");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
