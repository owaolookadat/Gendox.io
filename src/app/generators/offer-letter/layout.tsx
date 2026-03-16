import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("offer-letter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
