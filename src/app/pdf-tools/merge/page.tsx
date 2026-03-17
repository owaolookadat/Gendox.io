"use client";

import { useState, useCallback } from "react";
import PdfToolShell from "@/components/pdf/PdfToolShell";
import PdfUploadZone from "@/components/pdf/PdfUploadZone";
import PdfDownloadResult from "@/components/pdf/PdfDownloadResult";
import ProcessingOverlay from "@/components/pdf/ProcessingOverlay";
import { usePdfTool } from "@/hooks/usePdfTool";
import { formatFileSize } from "@/lib/pdf/pdf-utils";
import { GripVertical, X, Plus, FileText } from "lucide-react";

export default function MergePdfPage() {
  const tool = usePdfTool();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleMerge = useCallback(async () => {
    tool.startProcessing();
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();

      for (const file of tool.files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }

      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      tool.setResult(blob, "merged.pdf");
    } catch (err) {
      tool.setProcessingError(
        err instanceof Error ? err.message : "Failed to merge PDFs"
      );
    }
  }, [tool]);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (toIndex: number) => {
    if (dragIndex !== null && dragIndex !== toIndex) {
      tool.reorderFiles(dragIndex, toIndex);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <PdfToolShell
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Drag to reorder."
    >
      {/* Step 1: Upload */}
      {tool.isUpload && (
        <PdfUploadZone
          onFilesSelected={tool.setFiles}
          accept={[".pdf", "application/pdf"]}
          multiple
          maxFiles={20}
          label="Select PDF files"
          sublabel="or drag & drop PDF files here"
        />
      )}

      {/* Step 2: Configure — file list with reorder */}
      {tool.isConfigure && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {tool.files.length} file{tool.files.length !== 1 ? "s" : ""}{" "}
              selected
            </p>
            <button
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf,application/pdf";
                input.multiple = true;
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) tool.addFiles(Array.from(files));
                };
                input.click();
              }}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add more files
            </button>
          </div>

          {/* File list */}
          <div className="space-y-2">
            {tool.files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  dragOverIndex === index
                    ? "border-blue-400 bg-blue-50"
                    : dragIndex === index
                      ? "border-gray-300 bg-gray-50 opacity-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab shrink-0" />
                <FileText className="w-5 h-5 text-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => tool.removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {tool.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {tool.error}
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleMerge}
            disabled={tool.files.length < 2}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            Merge PDF
          </button>

          {tool.files.length < 2 && (
            <p className="text-xs text-amber-600 text-center">
              Add at least 2 PDF files to merge.
            </p>
          )}
        </div>
      )}

      {/* Step 3: Processing */}
      {tool.isProcessing && <ProcessingOverlay message="Merging PDFs..." />}

      {/* Step 4: Download */}
      {tool.isDone && tool.result && (
        <PdfDownloadResult
          blob={tool.result.blob}
          filename={tool.result.filename}
          onReset={tool.reset}
        />
      )}
    </PdfToolShell>
  );
}
