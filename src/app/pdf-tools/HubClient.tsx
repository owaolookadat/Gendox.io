"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PdfUploadZone from "@/components/pdf/PdfUploadZone";
import { storeTransferFile } from "@/lib/pdf/pdf-file-transfer";
import { formatFileSize } from "@/lib/pdf/pdf-utils";
import {
  Scissors,
  RotateCw,
  Trash2,
  FileOutput,
  GripVertical,
  Stamp,
  Hash,
  Lock,
  PenTool,
  FileEdit,
  FileText,
  Merge,
  Image,
  ImageDown,
  ShieldCheck,
  Zap,
  Monitor,
  ArrowRight,
  X,
} from "lucide-react";

interface ToolAction {
  title: string;
  slug: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const singleFileActions: ToolAction[] = [
  { title: "Edit PDF", slug: "edit", desc: "Fill forms, add text & draw", icon: <FileEdit className="w-5 h-5" />, color: "text-blue-600", bgColor: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
  { title: "Split PDF", slug: "split", desc: "Extract page ranges", icon: <Scissors className="w-5 h-5" />, color: "text-purple-600", bgColor: "bg-purple-50 hover:bg-purple-100 border-purple-200" },
  { title: "Rotate Pages", slug: "rotate", desc: "Rotate individual pages", icon: <RotateCw className="w-5 h-5" />, color: "text-teal-600", bgColor: "bg-teal-50 hover:bg-teal-100 border-teal-200" },
  { title: "Remove Pages", slug: "remove-pages", desc: "Delete unwanted pages", icon: <Trash2 className="w-5 h-5" />, color: "text-red-600", bgColor: "bg-red-50 hover:bg-red-100 border-red-200" },
  { title: "Extract Pages", slug: "extract-pages", desc: "Pull out specific pages", icon: <FileOutput className="w-5 h-5" />, color: "text-orange-600", bgColor: "bg-orange-50 hover:bg-orange-100 border-orange-200" },
  { title: "Organize Pages", slug: "organize", desc: "Drag to reorder pages", icon: <GripVertical className="w-5 h-5" />, color: "text-indigo-600", bgColor: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200" },
  { title: "Add Watermark", slug: "add-watermark", desc: "Text overlay on pages", icon: <Stamp className="w-5 h-5" />, color: "text-amber-600", bgColor: "bg-amber-50 hover:bg-amber-100 border-amber-200" },
  { title: "Add Page Numbers", slug: "add-page-numbers", desc: "Number your pages", icon: <Hash className="w-5 h-5" />, color: "text-cyan-600", bgColor: "bg-cyan-50 hover:bg-cyan-100 border-cyan-200" },
  { title: "Protect PDF", slug: "protect-pdf", desc: "Add password encryption", icon: <Lock className="w-5 h-5" />, color: "text-green-600", bgColor: "bg-green-50 hover:bg-green-100 border-green-200" },
  { title: "Sign PDF", slug: "sign-pdf", desc: "Draw or type signature", icon: <PenTool className="w-5 h-5" />, color: "text-pink-600", bgColor: "bg-pink-50 hover:bg-pink-100 border-pink-200" },
];

const allTools = [
  { title: "Merge PDF", slug: "merge", desc: "Combine multiple PDFs into one document.", icon: <Merge className="w-5 h-5" /> },
  { title: "Split PDF", slug: "split", desc: "Extract pages or ranges into separate PDFs.", icon: <Scissors className="w-5 h-5" /> },
  { title: "Edit PDF", slug: "edit", desc: "Fill forms, add text, draw, and annotate PDFs.", icon: <FileEdit className="w-5 h-5" /> },
  { title: "Rotate PDF", slug: "rotate", desc: "Rotate individual or all pages.", icon: <RotateCw className="w-5 h-5" /> },
  { title: "Remove Pages", slug: "remove-pages", desc: "Delete unwanted pages from a PDF.", icon: <Trash2 className="w-5 h-5" /> },
  { title: "Extract Pages", slug: "extract-pages", desc: "Pull specific pages into a new PDF.", icon: <FileOutput className="w-5 h-5" /> },
  { title: "Organize PDF", slug: "organize", desc: "Drag and drop to reorder pages.", icon: <GripVertical className="w-5 h-5" /> },
  { title: "JPG to PDF", slug: "jpg-to-pdf", desc: "Convert images to a PDF document.", icon: <Image className="w-5 h-5" /> },
  { title: "PDF to JPG", slug: "pdf-to-jpg", desc: "Convert PDF pages to JPG images.", icon: <ImageDown className="w-5 h-5" /> },
  { title: "Add Page Numbers", slug: "add-page-numbers", desc: "Stamp page numbers on your PDF.", icon: <Hash className="w-5 h-5" /> },
  { title: "Add Watermark", slug: "add-watermark", desc: "Add text watermarks to pages.", icon: <Stamp className="w-5 h-5" /> },
  { title: "Protect PDF", slug: "protect-pdf", desc: "Add password protection.", icon: <Lock className="w-5 h-5" /> },
  { title: "Sign PDF", slug: "sign-pdf", desc: "Draw or type your signature on a PDF.", icon: <PenTool className="w-5 h-5" /> },
];

export default function HubClient() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [navigating, setNavigating] = useState<string | null>(null);

  const handleFileSelected = useCallback((files: File[]) => {
    if (files.length > 0) setFile(files[0]);
  }, []);

  const handleActionClick = useCallback(
    async (slug: string) => {
      if (!file) return;
      setNavigating(slug);
      try {
        await storeTransferFile(file);
        router.push(`/pdf-tools/${slug}?from=hub`);
      } catch {
        setNavigating(null);
      }
    },
    [file, router]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900">PDF Tools</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        All-in-One PDF Tools
      </h1>
      <p className="text-gray-600 mb-4">
        Upload your PDF once, then choose what you want to do with it. Free, no sign-up, runs entirely in your browser.
      </p>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Free
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Zap className="w-3.5 h-3.5" /> No Sign-Up
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          <Monitor className="w-3.5 h-3.5" /> Runs in Browser
        </span>
      </div>

      {/* Upload + Action Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-10">
        {!file ? (
          <PdfUploadZone
            onFilesSelected={handleFileSelected}
            accept={[".pdf"]}
            multiple={false}
            label="Select PDF file"
            sublabel="or drag & drop your PDF here"
          />
        ) : (
          <>
            {/* Selected file header */}
            <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action grid */}
            <h2 className="text-sm font-semibold text-gray-900 mb-3">What do you want to do?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {singleFileActions.map((action) => (
                <button
                  key={action.slug}
                  onClick={() => handleActionClick(action.slug)}
                  disabled={navigating !== null}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${action.bgColor} ${
                    navigating === action.slug ? "opacity-70 scale-95" : ""
                  } ${navigating !== null && navigating !== action.slug ? "opacity-50" : ""}`}
                >
                  <span className={action.color}>{action.icon}</span>
                  <span className="text-xs font-medium text-gray-900">{action.title}</span>
                  <span className="text-[10px] text-gray-500 leading-tight">{action.desc}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* All tools directory */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">All PDF Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/pdf-tools/${tool.slug}`}
              className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-red-300 hover:shadow-md transition-all"
            >
              <span className="text-red-500 mt-0.5">{tool.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                  {tool.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-400 mt-0.5 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* SEO content */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Free Online PDF Editor & Toolkit
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          gendox PDF Tools lets you edit, merge, split, rotate, sign, and protect PDF files directly in your browser.
          No software to install, no sign-up required, and your files never leave your device.
          Whether you need to fill out a form, combine documents, or add a signature, our tools handle it all for free.
        </p>
        <h3 className="text-base font-semibold text-gray-900 mb-2">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {[
            { q: "Are these PDF tools really free?", a: "Yes, all PDF tools are 100% free with no usage limits. No sign-up or credit card required." },
            { q: "Are my files safe?", a: "Your files never leave your browser. All processing happens locally on your device — nothing is uploaded to any server." },
            { q: "What file size can I process?", a: "You can process PDF files up to 100 MB. For best performance, we recommend files under 50 MB." },
            { q: "Can I use these tools on mobile?", a: "Yes, all tools are fully responsive and work on phones, tablets, and desktops." },
          ].map((faq) => (
            <details key={faq.q} className="group">
              <summary className="text-sm font-medium text-gray-800 cursor-pointer hover:text-blue-600">
                {faq.q}
              </summary>
              <p className="text-sm text-gray-600 mt-1 ml-4">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
