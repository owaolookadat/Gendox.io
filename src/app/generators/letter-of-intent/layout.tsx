import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("letter-of-intent");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
