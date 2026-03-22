"use client";

import { useState, useCallback } from "react";
import PdfToolShell from "@/components/pdf/PdfToolShell";
import PdfUploadZone from "@/components/pdf/PdfUploadZone";
import PdfDownloadResult from "@/components/pdf/PdfDownloadResult";
import ProcessingOverlay from "@/components/pdf/ProcessingOverlay";
import { usePdfTool } from "@/hooks/usePdfTool";
import { GripVertical, X, Plus } from "lucide-react";

type PageOrientation = "portrait" | "landscape";
type PageSize = "fit" | "a4" | "letter";
type Margin = "none" | "small" | "large";

const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

const MARGINS = {
  none: 0,
  small: 36,
  large: 72,
};

export default function JpgToPdfClient() {
  const tool = usePdfTool();
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [margin, setMargin] = useState<Margin>("none");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      tool.setFiles(files);
      // Generate preview URLs
      const urls = files.map((f) => URL.createObjectURL(f));
      setPreviews(urls);
    },
    [tool]
  );

  const handleAddFiles = useCallback(
    (files: File[]) => {
      tool.addFiles(files);
      setPreviews((prev) => [
        ...prev,
        ...files.map((f) => URL.createObjectURL(f)),
      ]);
    },
    [tool]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      URL.revokeObjectURL(previews[index]);
      setPreviews((prev) => prev.filter((_, i) => i !== index));
      tool.removeFile(index);
    },
    [tool, previews]
  );

  const handleConvert = useCallback(async () => {
    tool.startProcessing();
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();

      for (const file of tool.files) {
        const bytes = await file.arrayBuffer();
        const uint8 = new Uint8Array(bytes);

        // Detect image type and embed
        let image;
        const isPng =
          file.type === "image/png" ||
          file.name.toLowerCase().endsWith(".png");
        if (isPng) {
          image = await doc.embedPng(uint8);
        } else {
          image = await doc.embedJpg(uint8);
        }

        const imgWidth = image.width;
        const imgHeight = image.height;
        const marginPx = MARGINS[margin];

        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === "fit") {
          pageWidth = imgWidth + marginPx * 2;
          pageHeight = imgHeight + marginPx * 2;
          if (orientation === "landscape" && pageWidth < pageHeight) {
            [pageWidth, pageHeight] = [pageHeight, pageWidth];
          } else if (orientation === "portrait" && pageWidth > pageHeight) {
            [pageWidth, pageHeight] = [pageHeight, pageWidth];
          }
        } else {
          const size = PAGE_SIZES[pageSize];
          if (orientation === "landscape") {
            pageWidth = size.height;
            pageHeight = size.width;
          } else {
            pageWidth = size.width;
            pageHeight = size.height;
          }
        }

        const page = doc.addPage([pageWidth, pageHeight]);
        const availW = pageWidth - marginPx * 2;
        const availH = pageHeight - marginPx * 2;

        // Scale image to fit within available space
        let drawW = imgWidth;
        let drawH = imgHeight;
        if (pageSize !== "fit") {
          const scaleX = availW / imgWidth;
          const scaleY = availH / imgHeight;
          const scale = Math.min(scaleX, scaleY, 1); // don't upscale
          drawW = imgWidth * scale;
          drawH = imgHeight * scale;
        }

        // Center on page
        const x = marginPx + (availW - drawW) / 2;
        const y = marginPx + (availH - drawH) / 2;

        page.drawImage(image, { x, y, width: drawW, height: drawH });
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      tool.setResult(blob, `images-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      tool.setProcessingError(
        err instanceof Error ? err.message : "Failed to convert images"
      );
    }
  }, [tool, orientation, pageSize, margin]);

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDrop = (toIndex: number) => {
    if (dragIndex !== null && dragIndex !== toIndex) {
      tool.reorderFiles(dragIndex, toIndex);
      setPreviews((prev) => {
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

  return (
    <PdfToolShell
      title="JPG to PDF"
      description="Convert JPG and PNG images to a PDF document. Drag to reorder pages."
    >
      {/* Step 1: Upload */}
      {tool.isUpload && (
        <PdfUploadZone
          onFilesSelected={handleFilesSelected}
          accept={[".jpg", ".jpeg", ".png", "image/jpeg", "image/png"]}
          multiple
          maxFiles={20}
          maxSizeMB={50}
          label="Select images"
          sublabel="or drag & drop JPG/PNG images here"
          icon="image"
        />
      )}

      {/* Step 2: Configure */}
      {tool.isConfigure && (
        <div className="space-y-6">
          {/* Image thumbnails grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">
                {tool.files.length} image{tool.files.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".jpg,.jpeg,.png,image/jpeg,image/png";
                  input.multiple = true;
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files) handleAddFiles(Array.from(files));
                  };
                  input.click();
                }}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add more images
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {tool.files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group rounded-lg border-2 overflow-hidden transition-all ${
                    dragOverIndex === index
                      ? "border-blue-400 bg-blue-50"
                      : dragIndex === index
                        ? "border-gray-300 opacity-50"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previews[index]}
                    alt={file.name}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  {/* Overlay controls */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-4 h-4 text-white drop-shadow cursor-grab" />
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 p-0.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove file"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  {/* Number badge */}
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            {/* Orientation */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Orientation
              </label>
              <div className="flex gap-2">
                {(["portrait", "landscape"] as const).map((o) => (
                  <button
                    key={o}
                    onClick={() => setOrientation(o)}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md border transition-colors ${
                      orientation === o
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {o === "portrait" ? "Portrait" : "Landscape"}
                  </button>
                ))}
              </div>
            </div>

            {/* Page size */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Page Size
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as PageSize)}
                className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs bg-white"
              >
                <option value="fit">Fit (same as image)</option>
                <option value="a4">A4</option>
                <option value="letter">US Letter</option>
              </select>
            </div>

            {/* Margin */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Margin
              </label>
              <select
                value={margin}
                onChange={(e) => setMargin(e.target.value as Margin)}
                className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs bg-white"
              >
                <option value="none">No margin</option>
                <option value="small">Small</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          {tool.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {tool.error}
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleConvert}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-base"
          >
            Convert to PDF
          </button>
        </div>
      )}

      {/* Step 3: Processing */}
      {tool.isProcessing && (
        <ProcessingOverlay message="Converting images to PDF..." />
      )}

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
