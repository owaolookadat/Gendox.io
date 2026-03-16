import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("thank-you-letter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
