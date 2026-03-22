import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import JsonLd from "@/components/JsonLd";
import MobileNav from "@/components/MobileNav";
import { getHomePageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "gendox — Free Online Tools & Document Generators",
  description:
    "Free online document generators, calculators, and converters. No sign-up required. Instant download.",
  alternates: { canonical: "https://gendox.io" },
  openGraph: {
    title: "gendox — Free Online Tools & Document Generators",
    description: "Free online document generators, PDF tools, calculators, and converters. No sign-up required. Instant download.",
    type: "website",
    url: "https://gendox.io",
    siteName: "gendox",
  },
  twitter: {
    card: "summary",
    title: "gendox — Free Online Tools & Document Generators",
    description: "Free online document generators, PDF tools, calculators, and converters. No sign-up required.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-gray-50">
        <JsonLd data={getHomePageJsonLd()} />

        {/* Sticky nav */}
        <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-extrabold text-blue-600 flex items-center gap-2" style={{ fontFamily: "'Manrope', sans-serif" }}>
              <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="6" fill="#2563EB" />
                <path d="M8 9h12M8 14h8M8 19h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              gendox
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/about"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors hidden sm:inline"
              >
                About
              </Link>
              <Link
                href="/pdf-tools/merge"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors hidden sm:inline"
              >
                PDF Tools
              </Link>
              <Link
                href="/calculators/profit-margin"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors hidden sm:inline"
              >
                Calculators
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors hidden sm:inline-block"
              >
                All Tools
              </Link>
              <MobileNav />
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>
        <Analytics />

        <footer className="border-t border-gray-200 bg-white mt-12">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <Link href="/" className="text-lg font-extrabold text-blue-600 flex items-center gap-2 mb-3" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  <svg className="w-6 h-6" viewBox="0 0 28 28" fill="none">
                    <rect width="28" height="28" rx="6" fill="#2563EB" />
                    <path d="M8 9h12M8 14h8M8 19h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  gendox
                </Link>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Free online tools &amp; document generators. No sign-up required.
                </p>
              </div>

              {/* Popular Tools */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Document Tools</h3>
                <ul className="space-y-2">
                  <li><Link href="/generators/resume" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Resume Generator</Link></li>
                  <li><Link href="/generators/invoice" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Invoice Generator</Link></li>
                  <li><Link href="/generators/cover-letter" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Cover Letter</Link></li>
                  <li><Link href="/generators/nda" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">NDA Generator</Link></li>
                </ul>
              </div>

              {/* PDF Tools */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">PDF Tools</h3>
                <ul className="space-y-2">
                  <li><Link href="/pdf-tools/merge" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Merge PDF</Link></li>
                  <li><Link href="/pdf-tools/split" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Split PDF</Link></li>
                  <li><Link href="/pdf-tools/jpg-to-pdf" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">JPG to PDF</Link></li>
                  <li><Link href="/pdf-tools/sign-pdf" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Sign PDF</Link></li>
                </ul>
              </div>

              {/* Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">About gendox</Link></li>
                  <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/calculators/profit-margin" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Profit Margin Calculator</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} gendox &mdash; Free Online Tools &amp; Document Generators
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
