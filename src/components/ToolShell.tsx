import Link from "next/link";
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-4">{description}</p>

        {/* Trust badges */}
        <div className="flex gap-2 mb-6">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Free
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            No Sign-Up
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Instant Download
          </span>
        </div>

        {/* Tool content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
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
