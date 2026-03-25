"use client";

import { useState, useCallback, useEffect } from "react";
import PdfToolShell from "@/components/pdf/PdfToolShell";
import PdfUploadZone from "@/components/pdf/PdfUploadZone";
import PdfDownloadResult from "@/components/pdf/PdfDownloadResult";
import ProcessingOverlay from "@/components/pdf/ProcessingOverlay";
import PdfPageThumbnail from "@/components/pdf/PdfPageThumbnail";
import { usePdfTool } from "@/hooks/usePdfTool";
import { getPdfPageCount } from "@/lib/pdf/pdf-utils";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import { retrieveTransferFile } from "@/lib/pdf/pdf-file-transfer";

export default function RemovePagesPdfClient() {
  const seo = getToolSeoContent("remove-pages");
  const relatedTools = getRelatedTools("remove-pages");
  const tool = usePdfTool();
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

  const handleFileSelected = useCallback(
    async (files: File[]) => {
      tool.setFiles(files);
      const count = await getPdfPageCount(files[0]);
      setPageCount(count);
      setSelectedPages(new Set());
    },
    [tool]
  );

  const togglePage = (page: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) {
        next.delete(page);
      } else {
        // Can't remove all pages
        if (next.size < pageCount - 1) {
          next.add(page);
        }
      }
      return next;
    });
  };

  const handleRemove = useCallback(async () => {
    tool.startProcessing();
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await tool.files[0].arrayBuffer();
      const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const result = await PDFDocument.create();

      const keepIndices = Array.from(
        { length: pageCount },
        (_, i) => i
      ).filter((i) => !selectedPages.has(i + 1));

      const pages = await result.copyPages(source, keepIndices);
      pages.forEach((page) => result.addPage(page));

      const pdfBytes = await result.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      tool.setResult(blob, `modified-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      tool.setProcessingError(
        err instanceof Error ? err.message : "Failed to remove pages"
      );
    }
  }, [tool, selectedPages, pageCount]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") === "hub") {
      retrieveTransferFile().then((file) => {
        if (file) tool.setFiles([file]);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PdfToolShell
      title="Remove Pages"
      description="Click on pages to select them for removal from your PDF."
      seoHeading={seo.heading}
      seoContent={seo.content}
      faqs={seo.faqs}
      relatedTools={relatedTools}
    >
      {tool.isUpload && (
        <PdfUploadZone
          onFilesSelected={handleFileSelected}
          accept={[".pdf", "application/pdf"]}
          label="Select PDF file"
          sublabel="or drag & drop your PDF here"
        />
      )}

      {tool.isConfigure && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {pageCount} page{pageCount !== 1 ? "s" : ""} total
            </p>
            {selectedPages.size > 0 && (
              <p className="text-sm font-medium text-red-600">
                {selectedPages.size} page{selectedPages.size !== 1 ? "s" : ""}{" "}
                selected for removal
              </p>
            )}
          </div>

          {/* Page thumbnails */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <PdfPageThumbnail
                key={page}
                file={tool.files[0]}
                pageNumber={page}
                width={140}
                selected={selectedPages.has(page)}
                selectedColor="red"
                onClick={() => togglePage(page)}
                overlay={
                  selectedPages.has(page) ? (
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  ) : undefined
                }
              />
            ))}
          </div>

          {tool.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {tool.error}
            </div>
          )}

          <button
            onClick={handleRemove}
            disabled={selectedPages.size === 0}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            Remove {selectedPages.size > 0 ? `${selectedPages.size} ` : ""}Page
            {selectedPages.size !== 1 ? "s" : ""}
          </button>

          {selectedPages.size === 0 && (
            <p className="text-xs text-amber-600 text-center">
              Click on pages to select them for removal.
            </p>
          )}
        </div>
      )}

      {tool.isProcessing && (
        <ProcessingOverlay message="Removing pages..." />
      )}

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
