import Link from "next/link";
import { ShieldCheck, Zap, Monitor, Sparkles } from "lucide-react";
import SeoContentBlock from "../SeoContentBlock";

interface PdfToolShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  seoHeading?: string;
  seoContent?: string;
  faqs?: { question: string; answer: string }[];
  relatedTools?: { title: string; slug: string; desc: string }[];
}

export default function PdfToolShell({
  title,
  description,
  children,
  seoHeading,
  seoContent,
  faqs,
  relatedTools,
}: PdfToolShellProps) {
  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-1">/</span>
          <span>PDF Tools</span>
          <span className="mx-1">/</span>
          <span className="text-gray-900">{title}</span>
        </nav>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-4">{description}</p>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Free
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Zap className="w-3.5 h-3.5" />
            No Sign-Up
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Monitor className="w-3.5 h-3.5" />
            Runs in Browser
          </span>
        </div>

        {/* Tool content — wider than document generators */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {children}
        </div>
      </div>

      {/* SEO Content Block */}
      {seoHeading && seoContent && (
        <SeoContentBlock
          heading={seoHeading}
          content={seoContent}
          faqs={faqs ?? []}
          relatedTools={relatedTools ?? []}
        />
      )}
    </div>
  );
}
