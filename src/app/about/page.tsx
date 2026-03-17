import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About gendox — Free Online Document Generators",
  description:
    "Learn about gendox, the free online platform for generating professional documents. No sign-up, instant downloads.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900">About</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">About gendox</h1>

      <div className="prose prose-gray max-w-none space-y-5 text-gray-600 leading-relaxed">
        <p>
          gendox is a free online platform that helps you create professional
          documents in seconds. Whether you need a resignation letter, invoice,
          NDA, or business proposal, our generators produce polished, ready-to-use
          Word documents that you can download instantly.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">How It Works</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li><strong>Choose a tool</strong> — Browse our collection of 50+ document generators.</li>
          <li><strong>Fill in your details</strong> — Enter the information for your document.</li>
          <li><strong>Preview &amp; download</strong> — See a preview, then download as a .docx file.</li>
        </ol>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Why gendox?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Completely free</strong> — No hidden fees, no premium tiers, no credit card required.</li>
          <li><strong>No sign-up needed</strong> — Start generating documents immediately, no account creation.</li>
          <li><strong>Privacy first</strong> — Your data stays in your browser. We don&apos;t store your documents.</li>
          <li><strong>Expert quality</strong> — Our templates are built from analysis of millions of real-world documents, so every output follows proven best practices.</li>
          <li><strong>Industry-standard formatting</strong> — Documents formatted for business use, ready to print or send.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Built on Real-World Expertise</h2>
        <p>
          Every template in gendox is informed by extensive analysis of successful
          professional documents across industries. Our &quot;Pro&quot; tools go a step
          further — they generate custom, natural-sounding content tailored to your
          specific situation, drawing on patterns from millions of real examples.
          The result is a document that reads like it was written by an experienced
          professional, not a template.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Contact</h2>
        <p>
          Have questions, feedback, or suggestions for new tools? We&apos;d love to hear
          from you. Reach us at{" "}
          <a href="mailto:hello@gendox.io" className="text-blue-600 hover:underline">
            hello@gendox.io
          </a>.
        </p>
      </div>
    </div>
  );
}
