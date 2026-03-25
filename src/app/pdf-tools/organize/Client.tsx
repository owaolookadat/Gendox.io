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

export default function OrganizePdfClient() {
  const seo = getToolSeoContent("organize");
  const relatedTools = getRelatedTools("organize");
  const tool = usePdfTool();
  const [pageCount, setPageCount] = useState(0);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleFileSelected = useCallback(
    async (files: File[]) => {
      tool.setFiles(files);
      const count = await getPdfPageCount(files[0]);
      setPageCount(count);
      setPageOrder(Array.from({ length: count }, (_, i) => i + 1));
    },
    [tool]
  );

  const isReordered = pageOrder.some((p, i) => p !== i + 1);

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDrop = (toIndex: number) => {
    if (dragIndex !== null && dragIndex !== toIndex) {
      setPageOrder((prev) => {
        const next = [...prev];
        const [moved] = next.splice(dragIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleSave = useCallback(async () => {
    tool.startProcessing();
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await tool.files[0].arrayBuffer();
      const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const result = await PDFDocument.create();

      const indices = pageOrder.map((p) => p - 1);
      const pages = await result.copyPages(source, indices);
      pages.forEach((page) => result.addPage(page));

      const pdfBytes = await result.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      tool.setResult(blob, `organized-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      tool.setProcessingError(
        err instanceof Error ? err.message : "Failed to organize PDF"
      );
    }
  }, [tool, pageOrder]);

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
      title="Organize PDF"
      description="Drag and drop to reorder pages in your PDF document."
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
              {pageCount} page{pageCount !== 1 ? "s" : ""} — drag to reorder
            </p>
            {isReordered && (
              <button
                onClick={() =>
                  setPageOrder(Array.from({ length: pageCount }, (_, i) => i + 1))
                }
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                Reset order
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {pageOrder.map((originalPage, index) => (
              <div
                key={`pos-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`transition-all ${
                  dragOverIndex === index
                    ? "scale-105"
                    : dragIndex === index
                      ? "opacity-50"
                      : ""
                }`}
              >
                <PdfPageThumbnail
                  file={tool.files[0]}
                  pageNumber={originalPage}
                  width={140}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>
            ))}
          </div>

          {tool.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {tool.error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!isReordered}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            Save PDF
          </button>

          {!isReordered && (
            <p className="text-xs text-amber-600 text-center">
              Drag pages to reorder them.
            </p>
          )}
        </div>
      )}

      {tool.isProcessing && (
        <ProcessingOverlay message="Reorganizing pages..." />
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
