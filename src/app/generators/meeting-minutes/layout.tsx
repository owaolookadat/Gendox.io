import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("meeting-minutes");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
