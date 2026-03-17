import Link from "next/link";
import { ShieldCheck, Zap, FileDown, Sparkles } from "lucide-react";
import SeoContentBlock from "./SeoContentBlock";

interface ToolShellProps {
  title: string;
  description: string;
  category: string;
  children: React.ReactNode;
  seoHeading?: string;
  seoContent?: string;
  faqs?: { question: string; answer: string }[];
  relatedTools?: { title: string; slug: string; desc: string }[];
  aiPowered?: boolean; // shows "Pro" badge
}

export default function ToolShell({
  title,
  description,
  category,
  children,
  seoHeading,
  seoContent,
  faqs,
  relatedTools,
  aiPowered,
}: ToolShellProps) {
  return (
    <div>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-1">/</span>
          <span>{category}</span>
          <span className="mx-1">/</span>
          <span className="text-gray-900">{title}</span>
        </nav>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          {title}
          {aiPowered && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-50 to-blue-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-3 h-3" />
              Pro
            </span>
          )}
        </h1>
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
            <FileDown className="w-3.5 h-3.5" />
            Instant Download
          </span>
        </div>

        {/* Tool content */}
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
