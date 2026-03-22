"use client";

import { useState, useCallback } from "react";
import PdfToolShell from "@/components/pdf/PdfToolShell";
import PdfUploadZone from "@/components/pdf/PdfUploadZone";
import PdfDownloadResult from "@/components/pdf/PdfDownloadResult";
import ProcessingOverlay from "@/components/pdf/ProcessingOverlay";
import PdfPageThumbnail from "@/components/pdf/PdfPageThumbnail";
import { usePdfTool } from "@/hooks/usePdfTool";
import { getPdfPageCount } from "@/lib/pdf/pdf-utils";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import { RotateCcw, RotateCw } from "lucide-react";

export default function RotatePdfClient() {
  const seo = getToolSeoContent("rotate");
  const relatedTools = getRelatedTools("rotate");
  const tool = usePdfTool();
  const [pageCount, setPageCount] = useState(0);
  const [rotations, setRotations] = useState<Record<number, number>>({});

  const handleFileSelected = useCallback(
    async (files: File[]) => {
      tool.setFiles(files);
      const count = await getPdfPageCount(files[0]);
      setPageCount(count);
      setRotations({});
    },
    [tool]
  );

  const rotateLeft = (page: number) => {
    setRotations((prev) => ({
      ...prev,
      [page]: ((prev[page] || 0) - 90 + 360) % 360,
    }));
  };

  const rotateRight = (page: number) => {
    setRotations((prev) => ({
      ...prev,
      [page]: ((prev[page] || 0) + 90) % 360,
    }));
  };

  const rotateAllLeft = () => {
    setRotations((prev) => {
      const next = { ...prev };
      for (let i = 1; i <= pageCount; i++) {
        next[i] = ((next[i] || 0) - 90 + 360) % 360;
      }
      return next;
    });
  };

  const rotateAllRight = () => {
    setRotations((prev) => {
      const next = { ...prev };
      for (let i = 1; i <= pageCount; i++) {
        next[i] = ((next[i] || 0) + 90) % 360;
      }
      return next;
    });
  };

  const hasRotations = Object.values(rotations).some((r) => r !== 0);

  const handleRotate = useCallback(async () => {
    tool.startProcessing();
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const bytes = await tool.files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = pdf.getPages();

      for (let i = 0; i < pages.length; i++) {
        const rotation = rotations[i + 1] || 0;
        if (rotation !== 0) {
          const current = pages[i].getRotation().angle;
          pages[i].setRotation(degrees(current + rotation));
        }
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      tool.setResult(blob, `rotated-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      tool.setProcessingError(
        err instanceof Error ? err.message : "Failed to rotate PDF"
      );
    }
  }, [tool, rotations]);

  return (
    <PdfToolShell
      title="Rotate PDF"
      description="Rotate PDF pages individually or all at once. Click the arrows to rotate."
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
          {/* Bulk controls */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {pageCount} page{pageCount !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={rotateAllLeft}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50"
              >
                <RotateCcw className="w-4 h-4" />
                Rotate all left
              </button>
              <button
                onClick={rotateAllRight}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50"
              >
                <RotateCw className="w-4 h-4" />
                Rotate all right
              </button>
            </div>
          </div>

          {/* Page thumbnails */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <div key={page} className="flex flex-col items-center gap-1">
                <PdfPageThumbnail
                  file={tool.files[0]}
                  pageNumber={page}
                  width={140}
                  rotation={rotations[page] || 0}
                />
                <div className="flex items-center gap-1 mt-1">
                  <button
                    onClick={() => rotateLeft(page)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Rotate left"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => rotateRight(page)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Rotate right"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {tool.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {tool.error}
            </div>
          )}

          <button
            onClick={handleRotate}
            disabled={!hasRotations}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            Rotate PDF
          </button>

          {!hasRotations && (
            <p className="text-xs text-amber-600 text-center">
              Click the arrows to rotate at least one page.
            </p>
          )}
        </div>
      )}

      {tool.isProcessing && <ProcessingOverlay message="Rotating PDF..." />}

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
