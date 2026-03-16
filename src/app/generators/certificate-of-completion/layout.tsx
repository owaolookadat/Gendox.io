import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("certificate-of-completion");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
