import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="mb-6">
        <span className="text-7xl font-extrabold text-blue-600">404</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try searching for a tool or browse our collection.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Browse All Tools
        </Link>
        <Link
          href="/generators/resume"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Try Resume Generator
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-400 mb-4">Popular tools you might be looking for:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { name: "Invoice", slug: "invoice" },
            { name: "Cover Letter", slug: "cover-letter" },
            { name: "Resignation Letter", slug: "resignation-letter" },
            { name: "NDA", slug: "nda" },
            { name: "Business Proposal", slug: "business-proposal" },
          ].map((tool) => (
            <Link
              key={tool.slug}
              href={`/generators/${tool.slug}`}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
