import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gendox — Free Online Tools & Document Generators",
  description:
    "Free online document generators, calculators, and converters. No sign-up required. Instant download.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Gendox
            </Link>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200 bg-white mt-12">
          <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Gendox &mdash; Free Online Tools
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-gray-600">
              About
            </a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-gray-600">
              Privacy Policy
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
