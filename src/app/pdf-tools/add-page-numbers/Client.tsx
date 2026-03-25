"use client";

import { useState, useCallback, useEffect } from "react";
import PdfToolShell from "@/components/pdf/PdfToolShell";
import PdfUploadZone from "@/components/pdf/PdfUploadZone";
import PdfDownloadResult from "@/components/pdf/PdfDownloadResult";
import ProcessingOverlay from "@/components/pdf/ProcessingOverlay";
import { usePdfTool } from "@/hooks/usePdfTool";
import { getPdfPageCount } from "@/lib/pdf/pdf-utils";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import { retrieveTransferFile } from "@/lib/pdf/pdf-file-transfer";

type Position = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
type NumberFormat = "number" | "pageN" | "pageNofM" | "custom";

const POSITIONS: { value: Position; label: string; row: number; col: number }[] = [
  { value: "top-left", label: "↖", row: 0, col: 0 },
  { value: "top-center", label: "↑", row: 0, col: 1 },
  { value: "top-right", label: "↗", row: 0, col: 2 },
  { value: "bottom-left", label: "↙", row: 1, col: 0 },
  { value: "bottom-center", label: "↓", row: 1, col: 1 },
  { value: "bottom-right", label: "↘", row: 1, col: 2 },
];

export default function AddPageNumbersClient() {
  const seo = getToolSeoContent("add-page-numbers");
  const relatedTools = getRelatedTools("add-page-numbers");
  const tool = usePdfTool();
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [format, setFormat] = useState<NumberFormat>("number");
  const [customFormat, setCustomFormat] = useState("Page {n} of {p}");
  const [fontSize, setFontSize] = useState(12);
  const [startNumber, setStartNumber] = useState(1);
  const [margin, setMargin] = useState(30);

  const handleFileSelected = useCallback(
    async (files: File[]) => {
      tool.setFiles(files);
      const count = await getPdfPageCount(files[0]);
      setPageCount(count);
    },
    [tool]
  );

  const getTextForPage = (pageNum: number, total: number): string => {
    const n = pageNum + startNumber - 1;
    switch (format) {
      case "number": return `${n}`;
      case "pageN": return `Page ${n}`;
      case "pageNofM": return `Page ${n} of ${total + startNumber - 1}`;
      case "custom": return customFormat.replace("{n}", `${n}`).replace("{p}", `${total + startNumber - 1}`);
    }
  };

  const handleAddNumbers = useCallback(async () => {
    tool.startProcessing();
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const bytes = await tool.files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const text = getTextForPage(i + 1, pages.length);
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x: number;
        let y: number;

        // X position
        if (position.includes("left")) x = margin;
        else if (position.includes("right")) x = width - textWidth - margin;
        else x = (width - textWidth) / 2;

        // Y position
        if (position.includes("top")) y = height - margin - fontSize;
        else y = margin;

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      tool.setResult(blob, `numbered-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      tool.setProcessingError(
        err instanceof Error ? err.message : "Failed to add page numbers"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, position, format, customFormat, fontSize, startNumber, margin, pageCount]);

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
      title="Add Page Numbers"
      description="Add page numbers to your PDF with customizable position, format, and size."
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
        <div className="space-y-5">
          <p className="text-sm text-gray-600">
            {pageCount} page{pageCount !== 1 ? "s" : ""} detected.
          </p>

          {/* Position selector — 2x3 grid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <div className="inline-grid grid-cols-3 gap-1.5 p-2 bg-gray-100 rounded-lg">
              {POSITIONS.map((pos) => (
                <button
                  key={pos.value}
                  onClick={() => setPosition(pos.value)}
                  className={`w-12 h-10 rounded text-sm font-medium transition-colors ${
                    position === pos.value
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as NumberFormat)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="number">1, 2, 3...</option>
              <option value="pageN">Page 1, Page 2...</option>
              <option value="pageNofM">Page 1 of N</option>
              <option value="custom">Custom format</option>
            </select>
          </div>

          {format === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Format
              </label>
              <input
                type="text"
                value={customFormat}
                onChange={(e) => setCustomFormat(e.target.value)}
                placeholder="Page {n} of {p}"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {"{n}"} for page number and {"{p}"} for total pages
              </p>
            </div>
          )}

          {/* Settings row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Font Size
              </label>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min={8}
                max={24}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Start Number
              </label>
              <input
                type="number"
                value={startNumber}
                onChange={(e) => setStartNumber(Number(e.target.value))}
                min={1}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Margin (px)
              </label>
              <input
                type="number"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                min={10}
                max={100}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          {tool.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {tool.error}
            </div>
          )}

          <button
            onClick={handleAddNumbers}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-base"
          >
            Add Page Numbers
          </button>
        </div>
      )}

      {tool.isProcessing && (
        <ProcessingOverlay message="Adding page numbers..." />
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
