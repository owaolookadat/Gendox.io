import Link from "next/link";

interface FAQ {
  question: string;
  answer: string;
}

interface RelatedTool {
  title: string;
  slug: string;
  desc: string;
}

interface SeoContentBlockProps {
  heading: string;
  content: string;
  faqs: FAQ[];
  relatedTools: RelatedTool[];
}

export default function SeoContentBlock({ heading, content, faqs, relatedTools }: SeoContentBlockProps) {
  return (
    <div className="mt-12 max-w-2xl mx-auto px-4">
      {/* SEO Content */}
      <div className="prose prose-gray max-w-none mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">{heading}</h2>
        <p className="text-gray-600 leading-relaxed">{content}</p>
      </div>

      {/* FAQs */}
      {faqs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.slug.startsWith("/") ? tool.slug : `/generators/${tool.slug}`}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all"
              >
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{tool.title}</h3>
                <p className="text-xs text-gray-500">{tool.desc}</p>
                <span className="text-xs text-blue-600 font-medium mt-2 inline-block">Use Tool &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
