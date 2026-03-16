import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("business-proposal");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
