"use client";

import {
  MousePointer2,
  Type,
  Pencil,
  FileInput,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCcw,
  Eraser,
} from "lucide-react";

export type EditorTool = "select" | "text" | "draw" | "form";

interface EditorToolbarProps {
  activeTool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSave: () => void;
  onReset: () => void;
  hasFormFields: boolean;
  isSaving: boolean;
  hasAnnotations: boolean;
  onClearAnnotations: () => void;
}

const tools: { id: EditorTool; icon: React.ReactNode; label: string; alwaysShow?: boolean }[] = [
  { id: "select", icon: <MousePointer2 className="w-4 h-4" />, label: "Select", alwaysShow: true },
  { id: "text", icon: <Type className="w-4 h-4" />, label: "Text", alwaysShow: true },
  { id: "draw", icon: <Pencil className="w-4 h-4" />, label: "Draw", alwaysShow: true },
  { id: "form", icon: <FileInput className="w-4 h-4" />, label: "Forms" },
];

export default function EditorToolbar({
  activeTool,
  onToolChange,
  zoom,
  onZoomChange,
  currentPage,
  totalPages,
  onPageChange,
  onSave,
  onReset,
  hasFormFields,
  isSaving,
  hasAnnotations,
  onClearAnnotations,
}: EditorToolbarProps) {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="sticky top-12 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
        {/* Tool buttons */}
        <div className="flex items-center gap-1">
          {tools
            .filter((t) => t.alwaysShow || (t.id === "form" && hasFormFields))
            .map((t) => (
              <button
                key={t.id}
                onClick={() => onToolChange(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTool === t.id
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100 border border-transparent"
                }`}
                title={t.label}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}

          {hasAnnotations && (
            <button
              onClick={onClearAnnotations}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 border border-transparent transition-colors ml-1"
              title="Clear all annotations"
            >
              <Eraser className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-600 min-w-[60px] text-center">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom + actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
            disabled={zoom <= 0.5}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-600 min-w-[40px] text-center">{zoomPercent}%</span>
          <button
            onClick={() => onZoomChange(Math.min(2, zoom + 0.25))}
            disabled={zoom >= 2}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition-colors"
            title="Start over"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {isSaving ? "Saving..." : "Save PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
