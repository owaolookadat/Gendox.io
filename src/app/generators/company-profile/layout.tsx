import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("company-profile");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
