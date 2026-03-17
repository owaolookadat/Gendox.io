"use client";

import { useState } from "react";

interface DocumentPreviewProps {
  children: React.ReactNode;
  onDownload: () => Promise<void>;
  onEdit: () => void;
  documentTitle: string;
}

export default function DocumentPreview({
  children,
  onDownload,
  onEdit,
  documentTitle,
}: DocumentPreviewProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await onDownload();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{documentTitle}</h2>
        <button
          onClick={onEdit}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>

      {/* Paper preview */}
      <div className="bg-gray-100 rounded-lg p-4 sm:p-8">
        <div className="bg-white shadow-[0_0_40px_rgba(0,0,0,0.08)] border border-gray-200 rounded-sm mx-auto max-w-[700px] overflow-x-auto">
          <div className="min-w-[500px] px-10 py-12 sm:px-14 sm:py-16">
            {children}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center mt-3">
        Preview is approximate. Downloaded document may have minor formatting differences.
      </p>

      {/* Action bar */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Back to Edit
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          {downloading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download .docx
            </>
          )}
        </button>
      </div>
    </div>
  );
}
