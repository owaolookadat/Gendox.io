"use client";

import { useRef, useEffect, useState } from "react";

interface PdfPageThumbnailProps {
  file: File;
  pageNumber: number;
  width?: number;
  selected?: boolean;
  selectedColor?: string; // "blue" | "red" - default blue
  rotation?: number; // 0, 90, 180, 270
  onClick?: () => void;
  overlay?: React.ReactNode;
  className?: string;
}

export default function PdfPageThumbnail({
  file,
  pageNumber,
  width = 160,
  selected = false,
  selectedColor = "blue",
  rotation = 0,
  onClick,
  overlay,
  className = "",
}: PdfPageThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!canvasRef.current) return;
      setLoading(true);
      setError(false);

      try {
        const { renderPageToCanvas, loadPdfjsDocument } = await import(
          "@/lib/pdf/pdf-utils"
        );
        const pdfjsDoc = await loadPdfjsDocument(file);
        if (cancelled) return;
        await renderPageToCanvas(pdfjsDoc, pageNumber, canvasRef.current, width);
        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [file, pageNumber, width]);

  const borderColor =
    selectedColor === "red"
      ? selected
        ? "border-red-500 ring-2 ring-red-200"
        : "border-gray-200"
      : selected
        ? "border-blue-500 ring-2 ring-blue-200"
        : "border-gray-200";

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center gap-1.5 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div
        className={`relative border-2 rounded-lg overflow-hidden bg-white shadow-sm transition-all ${borderColor} ${onClick ? "hover:shadow-md" : ""}`}
        style={{
          transform: rotation ? `rotate(${rotation}deg)` : undefined,
          transition: "transform 0.3s ease",
        }}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className={`block ${loading ? "invisible" : ""}`}
        />

        {/* Loading placeholder */}
        {loading && !error && (
          <div
            className="flex items-center justify-center bg-gray-100"
            style={{ width, height: width * 1.414 }}
          >
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="flex items-center justify-center bg-gray-100 text-gray-400 text-xs"
            style={{ width, height: width * 1.414 }}
          >
            Failed to load
          </div>
        )}

        {/* Selection overlay */}
        {selected && (
          <div
            className={`absolute inset-0 ${selectedColor === "red" ? "bg-red-500/10" : "bg-blue-500/10"}`}
          />
        )}

        {/* Custom overlay (rotation arrows, etc.) */}
        {overlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            {overlay}
          </div>
        )}
      </div>

      {/* Page number label */}
      <span className="text-xs text-gray-500 font-medium">{pageNumber}</span>
    </div>
  );
}
