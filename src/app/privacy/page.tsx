import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — gendox",
  description:
    "gendox privacy policy. Learn how we handle your data when you use our free document generators.",
  alternates: { canonical: "https://gendox.io/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: 17 March 2026</p>

      <div className="prose prose-gray max-w-none space-y-5 text-gray-600 leading-relaxed">
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Overview</h2>
        <p>
          gendox (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to
          protecting your privacy. This policy explains how we handle information
          when you use our website at gendox.io.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Information We Collect</h2>
        <p>
          <strong>Document data:</strong> The information you enter into our document
          generators (names, addresses, etc.) is processed in your browser and is not
          stored on our servers. For AI-powered tools, your form data is sent to our
          server temporarily to generate content and is not retained after the response
          is delivered.
        </p>
        <p>
          <strong>Analytics data:</strong> We use Vercel Analytics to collect anonymous
          usage data such as page views, device type, and browser type. This data is
          aggregated and cannot be used to identify individual users.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>To generate your requested documents</li>
          <li>To improve our tools and user experience</li>
          <li>To monitor and prevent abuse (rate limiting)</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Data Retention</h2>
        <p>
          We do not store the content of your generated documents. All document
          generation for template-based tools happens in your browser. For AI-powered
          tools, your data is processed in memory and discarded after the response.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Cookies</h2>
        <p>
          We use minimal cookies necessary for the website to function. Vercel
          Analytics may use cookies to track anonymous usage patterns.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Third-Party Services</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Vercel:</strong> Hosting and analytics</li>
          <li><strong>OpenAI:</strong> AI content generation (for AI-powered tools only)</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Your Rights</h2>
        <p>
          Since we don&apos;t store personal data from document generation, there is
          no personal data to access, modify, or delete. If you have any questions
          about your privacy, contact us at{" "}
          <a href="mailto:hello@gendox.io" className="text-blue-600 hover:underline">
            hello@gendox.io
          </a>.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. Any changes will be
          posted on this page with an updated revision date.
        </p>
      </div>
    </div>
  );
}
