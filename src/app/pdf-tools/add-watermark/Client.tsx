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

type WatermarkMode = "text" | "image";
type Position = "top-left" | "top-center" | "top-right" | "center-left" | "center" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right";

const POSITIONS: { value: Position; label: string }[] = [
  { value: "top-left", label: "↖" },
  { value: "top-center", label: "↑" },
  { value: "top-right", label: "↗" },
  { value: "center-left", label: "←" },
  { value: "center", label: "●" },
  { value: "center-right", label: "→" },
  { value: "bottom-left", label: "↙" },
  { value: "bottom-center", label: "↓" },
  { value: "bottom-right", label: "↘" },
];

export default function AddWatermarkClient() {
  const seo = getToolSeoContent("add-watermark");
  const relatedTools = getRelatedTools("add-watermark");
  const tool = usePdfTool();
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<WatermarkMode>("text");
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.25);
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState<Position>("center");

  const handleFileSelected = useCallback(
    async (files: File[]) => {
      tool.setFiles(files);
      const count = await getPdfPageCount(files[0]);
      setPageCount(count);
    },
    [tool]
  );

  const handleAddWatermark = useCallback(async () => {
    if (mode === "text" && !text.trim()) return;
    tool.startProcessing();
    try {
      const { PDFDocument, rgb, StandardFonts, degrees } = await import("pdf-lib");
      const bytes = await tool.files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x: number;
        let y: number;

        // Calculate position
        if (position.includes("left")) x = 40;
        else if (position.includes("right")) x = width - textWidth - 40;
        else x = (width - textWidth) / 2;

        if (position.includes("top")) y = height - 60 - fontSize;
        else if (position.includes("bottom")) y = 40;
        else y = (height - fontSize) / 2;

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.7, 0.7, 0.7),
          opacity,
          rotate: degrees(rotation),
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      tool.setResult(blob, `watermarked-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      tool.setProcessingError(
        err instanceof Error ? err.message : "Failed to add watermark"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, mode, text, fontSize, opacity, rotation, position]);

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
      title="Add Watermark"
      description="Stamp a text watermark across all pages of your PDF."
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
            {pageCount} page{pageCount !== 1 ? "s" : ""} — watermark will be applied to all pages.
          </p>

          {/* Mode tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode("text")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === "text"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Text Watermark
            </button>
            <button
              disabled
              className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-400 border border-gray-100 cursor-not-allowed"
              title="Coming soon"
            >
              Image Watermark
            </button>
          </div>

          {/* Text input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Watermark Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., CONFIDENTIAL, DRAFT"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Position grid — 3x3 */}
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

          {/* Settings row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Font Size
              </label>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min={12}
                max={120}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Opacity
              </label>
              <input
                type="range"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                min={0.05}
                max={0.75}
                step={0.05}
                className="w-full mt-2"
              />
              <p className="text-xs text-gray-400 text-center">{Math.round(opacity * 100)}%</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Rotation
              </label>
              <select
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
              >
                <option value={0}>0°</option>
                <option value={45}>45°</option>
                <option value={90}>90°</option>
                <option value={-45}>-45°</option>
              </select>
            </div>
          </div>

          {tool.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {tool.error}
            </div>
          )}

          <button
            onClick={handleAddWatermark}
            disabled={!text.trim()}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            Add Watermark
          </button>
        </div>
      )}

      {tool.isProcessing && (
        <ProcessingOverlay message="Adding watermark..." />
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
