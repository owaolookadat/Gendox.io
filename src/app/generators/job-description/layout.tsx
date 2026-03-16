import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("job-description");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
