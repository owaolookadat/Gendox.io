import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("complaint-letter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
