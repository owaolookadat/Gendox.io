"use client";

import { useState, useCallback } from "react";
import PdfToolShell from "@/components/pdf/PdfToolShell";
import PdfUploadZone from "@/components/pdf/PdfUploadZone";
import PdfDownloadResult from "@/components/pdf/PdfDownloadResult";
import ProcessingOverlay from "@/components/pdf/ProcessingOverlay";
import PdfPageThumbnail from "@/components/pdf/PdfPageThumbnail";
import { usePdfTool } from "@/hooks/usePdfTool";
import { getPdfPageCount } from "@/lib/pdf/pdf-utils";
import { CheckCircle2 } from "lucide-react";

export default function ExtractPagesPdfClient() {
  const tool = usePdfTool();
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState("");
  const [mode, setMode] = useState<"click" | "range">("click");

  const handleFileSelected = useCallback(
    async (files: File[]) => {
      tool.setFiles(files);
      const count = await getPdfPageCount(files[0]);
      setPageCount(count);
      setSelectedPages(new Set());
      setRangeInput("");
    },
    [tool]
  );

  const togglePage = (page: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  const parseRange = (input: string): number[] => {
    const pages = new Set<number>();
    const parts = input.split(",").map((s) => s.trim());
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(pageCount, end); i++) {
            pages.add(i);
          }
        }
      } else {
        const n = Number(part);
        if (!isNaN(n) && n >= 1 && n <= pageCount) pages.add(n);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const getSelectedIndices = (): number[] => {
    if (mode === "range") {
      return parseRange(rangeInput).map((p) => p - 1);
    }
    return Array.from(selectedPages)
      .sort((a, b) => a - b)
      .map((p) => p - 1);
  };

  const selectionCount =
    mode === "range" ? parseRange(rangeInput).length : selectedPages.size;

  const handleExtract = useCallback(async () => {
    tool.startProcessing();
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await tool.files[0].arrayBuffer();
      const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const result = await PDFDocument.create();

      const indices = getSelectedIndices();
      const pages = await result.copyPages(source, indices);
      pages.forEach((page) => result.addPage(page));

      const pdfBytes = await result.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      tool.setResult(blob, "extracted.pdf");
    } catch (err) {
      tool.setProcessingError(
        err instanceof Error ? err.message : "Failed to extract pages"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, selectedPages, rangeInput, mode, pageCount]);

  return (
    <PdfToolShell
      title="Extract Pages"
      description="Select specific pages to extract from your PDF into a new document."
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
          {/* Mode toggle */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <button
              onClick={() => setMode("click")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === "click"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Click to Select
            </button>
            <button
              onClick={() => setMode("range")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === "range"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Page Range
            </button>
          </div>

          {mode === "range" ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Enter page ranges (e.g., 1-3, 5, 8-10)
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="1-3, 5, 8-10"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">
                Total pages in document: {pageCount}
                {rangeInput && ` · Selected: ${parseRange(rangeInput).length}`}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  {pageCount} page{pageCount !== 1 ? "s" : ""} total
                </p>
                {selectedPages.size > 0 && (
                  <p className="text-sm font-medium text-blue-600">
                    {selectedPages.size} selected
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                  (page) => (
                    <PdfPageThumbnail
                      key={page}
                      file={tool.files[0]}
                      pageNumber={page}
                      width={140}
                      selected={selectedPages.has(page)}
                      selectedColor="blue"
                      onClick={() => togglePage(page)}
                      overlay={
                        selectedPages.has(page) ? (
                          <CheckCircle2 className="w-7 h-7 text-blue-500 drop-shadow" />
                        ) : undefined
                      }
                    />
                  )
                )}
              </div>
            </>
          )}

          {tool.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {tool.error}
            </div>
          )}

          <button
            onClick={handleExtract}
            disabled={selectionCount === 0}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            Extract {selectionCount > 0 ? `${selectionCount} ` : ""}Page
            {selectionCount !== 1 ? "s" : ""}
          </button>
        </div>
      )}

      {tool.isProcessing && (
        <ProcessingOverlay message="Extracting pages..." />
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
