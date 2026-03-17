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

type SplitMode = "range" | "pages";

export default function SplitPdfPage() {
  const tool = usePdfTool();
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<SplitMode>("range");
  const [rangeInput, setRangeInput] = useState("");
  const [mergeRanges, setMergeRanges] = useState(true);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

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

  const parseRanges = (input: string): number[][] => {
    const ranges: number[][] = [];
    const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= pageCount) {
          const pages: number[] = [];
          for (let i = start; i <= end; i++) pages.push(i);
          ranges.push(pages);
        }
      } else {
        const n = Number(part);
        if (!isNaN(n) && n >= 1 && n <= pageCount) ranges.push([n]);
      }
    }
    return ranges;
  };

  const getSelectionCount = () => {
    if (mode === "range") {
      return parseRanges(rangeInput).reduce((sum, r) => sum + r.length, 0);
    }
    return selectedPages.size;
  };

  const handleSplit = useCallback(async () => {
    tool.startProcessing();
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await tool.files[0].arrayBuffer();
      const source = await PDFDocument.load(bytes, { ignoreEncryption: true });

      let pagesToExtract: number[];

      if (mode === "range") {
        const ranges = parseRanges(rangeInput);
        if (mergeRanges) {
          // Merge all ranges into one file
          pagesToExtract = ranges.flat();
        } else {
          pagesToExtract = ranges.flat();
        }
      } else {
        pagesToExtract = Array.from(selectedPages).sort((a, b) => a - b);
      }

      const result = await PDFDocument.create();
      const indices = pagesToExtract.map((p) => p - 1);
      const pages = await result.copyPages(source, indices);
      pages.forEach((page) => result.addPage(page));

      const pdfBytes = await result.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      tool.setResult(blob, "split.pdf");
    } catch (err) {
      tool.setProcessingError(
        err instanceof Error ? err.message : "Failed to split PDF"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, mode, rangeInput, mergeRanges, selectedPages, pageCount]);

  return (
    <PdfToolShell
      title="Split PDF"
      description="Extract specific pages or ranges from your PDF into a new document."
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
          {/* Mode tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
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
            <button
              onClick={() => setMode("pages")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === "pages"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Select Pages
            </button>
          </div>

          {mode === "range" ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter page ranges
                </label>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="e.g., 1-3, 5, 8-10"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Total pages: {pageCount}
                </p>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={mergeRanges}
                  onChange={(e) => setMergeRanges(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Merge all ranges into one PDF
                </span>
              </label>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  {pageCount} page{pageCount !== 1 ? "s" : ""}
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
            onClick={handleSplit}
            disabled={getSelectionCount() === 0}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            Split PDF
          </button>
        </div>
      )}

      {tool.isProcessing && <ProcessingOverlay message="Splitting PDF..." />}

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
