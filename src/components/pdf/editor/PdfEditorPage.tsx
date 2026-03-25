"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { EditorTool } from "./EditorToolbar";
import TextAnnotation, { type TextAnnotationData } from "./TextAnnotation";
import DrawingCanvas from "./DrawingCanvas";

interface PdfEditorPageProps {
  file: File;
  pageIndex: number;
  zoom: number;
  activeTool: EditorTool;
  annotations: TextAnnotationData[];
  selectedAnnotationId: string | null;
  onAnnotationAdd: (annotation: Omit<TextAnnotationData, "id">) => void;
  onAnnotationUpdate: (id: string, updates: Partial<TextAnnotationData>) => void;
  onAnnotationSelect: (id: string | null) => void;
  onAnnotationDelete: (id: string) => void;
  onDrawingComplete: (pageIndex: number, dataUrl: string) => void;
  drawings: { pageIndex: number; dataUrl: string }[];
}

export default function PdfEditorPage({
  file,
  pageIndex,
  zoom,
  activeTool,
  annotations,
  selectedAnnotationId,
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationSelect,
  onAnnotationDelete,
  onDrawingComplete,
  drawings,
}: PdfEditorPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState(false);

  // Render PDF page to canvas
  useEffect(() => {
    let cancelled = false;
    setRendered(false);
    setError(false);

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const data = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data }).promise;
        const page = await pdf.getPage(pageIndex + 1);

        if (cancelled) return;

        const targetWidth = Math.min(800, window.innerWidth - 64) * zoom;
        const viewport = page.getViewport({ scale: 1 });
        const scale = targetWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: ctx, viewport: scaledViewport } as any).promise;
        if (cancelled) return;

        setDimensions({ width: scaledViewport.width, height: scaledViewport.height });
        setRendered(true);
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => { cancelled = true; };
  }, [file, pageIndex, zoom]);

  // Handle click on page overlay (add text annotation)
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (activeTool !== "text") {
        onAnnotationSelect(null);
        return;
      }

      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / dimensions.width) * 100;
      const y = ((e.clientY - rect.top) / dimensions.height) * 100;

      onAnnotationAdd({
        pageIndex,
        x: Math.max(0, Math.min(90, x)),
        y: Math.max(0, Math.min(90, y)),
        content: "",
        fontSize: 14,
        fontColor: "#000000",
      });
    },
    [activeTool, dimensions, pageIndex, onAnnotationAdd, onAnnotationSelect]
  );

  const handleDrawingComplete = useCallback(
    (dataUrl: string) => {
      onDrawingComplete(pageIndex, dataUrl);
    },
    [pageIndex, onDrawingComplete]
  );

  const pageAnnotations = annotations.filter((a) => a.pageIndex === pageIndex);
  const pageDrawings = drawings.filter((d) => d.pageIndex === pageIndex);

  return (
    <div className="flex justify-center mb-4">
      <div
        ref={containerRef}
        className="relative inline-block shadow-lg border border-gray-300 bg-white"
        style={{ width: dimensions.width || "auto", height: dimensions.height || "auto" }}
      >
        {/* PDF canvas */}
        <canvas ref={canvasRef} className="block" />

        {/* Loading */}
        {!rendered && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-600 text-sm">
            Failed to render page
          </div>
        )}

        {/* Drawings overlay (saved drawings as images) */}
        {pageDrawings.map((d, i) => (
          <img
            key={i}
            src={d.dataUrl}
            alt=""
            className="absolute inset-0 pointer-events-none"
            style={{ width: dimensions.width, height: dimensions.height }}
          />
        ))}

        {/* Interactive overlay */}
        {rendered && (
          <div
            className={`absolute inset-0 ${
              activeTool === "text" ? "cursor-text" : activeTool === "draw" ? "cursor-crosshair" : "cursor-default"
            }`}
            onClick={handleOverlayClick}
          >
            {/* Text annotations */}
            {pageAnnotations.map((ann) => (
              <TextAnnotation
                key={ann.id}
                annotation={ann}
                isSelected={selectedAnnotationId === ann.id}
                containerWidth={dimensions.width}
                containerHeight={dimensions.height}
                onSelect={() => onAnnotationSelect(ann.id)}
                onUpdate={(updates) => onAnnotationUpdate(ann.id, updates)}
                onDelete={() => onAnnotationDelete(ann.id)}
                isSelectTool={activeTool === "select"}
              />
            ))}

            {/* Drawing canvas */}
            <DrawingCanvas
              width={dimensions.width}
              height={dimensions.height}
              isActive={activeTool === "draw"}
              onDrawingComplete={handleDrawingComplete}
            />
          </div>
        )}

        {/* Page number label */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
          Page {pageIndex + 1}
        </div>
      </div>
    </div>
  );
}
