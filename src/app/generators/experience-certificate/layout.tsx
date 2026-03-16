import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("experience-certificate");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
