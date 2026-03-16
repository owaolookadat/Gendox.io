import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("joining-letter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
