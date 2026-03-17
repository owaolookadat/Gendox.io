"use client";

import { CheckCircle, Download, RotateCcw } from "lucide-react";
import { formatFileSize, downloadBlob } from "@/lib/pdf/pdf-utils";

interface PdfDownloadResultProps {
  blob: Blob;
  filename: string;
  onReset: () => void;
}

export default function PdfDownloadResult({
  blob,
  filename,
  onReset,
}: PdfDownloadResultProps) {
  const handleDownload = () => {
    downloadBlob(blob, filename);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>

      {/* Message */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          Your file is ready!
        </h3>
        <p className="text-sm text-gray-500">
          {filename} · {formatFileSize(blob.size)}
        </p>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-base shadow-sm"
      >
        <Download className="w-5 h-5" />
        Download
      </button>

      {/* Reset link */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Process another file
      </button>
    </div>
  );
}
