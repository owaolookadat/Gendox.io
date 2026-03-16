import { getToolMetadata } from "@/lib/seo";

export const metadata = getToolMetadata("leave-application");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
