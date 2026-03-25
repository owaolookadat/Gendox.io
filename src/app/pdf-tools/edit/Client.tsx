"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import PdfUploadZone from "@/components/pdf/PdfUploadZone";
import PdfDownloadResult from "@/components/pdf/PdfDownloadResult";
import EditorToolbar, { type EditorTool } from "@/components/pdf/editor/EditorToolbar";
import PdfEditorPage from "@/components/pdf/editor/PdfEditorPage";
import type { TextAnnotationData } from "@/components/pdf/editor/TextAnnotation";
import { saveEditedPdf } from "@/lib/pdf/pdf-editor-save";
import { retrieveTransferFile } from "@/lib/pdf/pdf-file-transfer";
import { ShieldCheck, Zap, Monitor } from "lucide-react";

interface FormFieldValue {
  fieldName: string;
  value: string | boolean;
}

type EditorState = "upload" | "editing" | "saving" | "done";

export default function EditPdfClient() {
  const [state, setState] = useState<EditorState>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<EditorTool>("select");
  const [annotations, setAnnotations] = useState<TextAnnotationData[]>([]);
  const [drawings, setDrawings] = useState<{ pageIndex: number; dataUrl: string }[]>([]);
  const [formValues] = useState<FormFieldValue[]>([]);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nextIdRef = useRef(1);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Load file from hub transfer
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") === "hub") {
      retrieveTransferFile().then((f) => {
        if (f) handleFileSelected([f]);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileSelected = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setError(null);

    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const data = await f.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      setTotalPages(pdf.numPages);
      setState("editing");
    } catch {
      setError("Could not load this PDF. It may be corrupted or password-protected.");
    }
  }, []);

  const handleAnnotationAdd = useCallback(
    (ann: Omit<TextAnnotationData, "id">) => {
      const id = `ann-${nextIdRef.current++}`;
      const newAnn: TextAnnotationData = { ...ann, id };
      setAnnotations((prev) => [...prev, newAnn]);
      setSelectedAnnotationId(id);
    },
    []
  );

  const handleAnnotationUpdate = useCallback(
    (id: string, updates: Partial<TextAnnotationData>) => {
      setAnnotations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
      );
    },
    []
  );

  const handleAnnotationDelete = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    setSelectedAnnotationId(null);
  }, []);

  const handleDrawingComplete = useCallback(
    (pageIndex: number, dataUrl: string) => {
      setDrawings((prev) => [...prev, { pageIndex, dataUrl }]);
    },
    []
  );

  const handleClearAnnotations = useCallback(() => {
    setAnnotations([]);
    setDrawings([]);
    setSelectedAnnotationId(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    const el = pageRefs.current.get(page - 1);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleSave = useCallback(async () => {
    if (!file) return;
    setState("saving");
    setError(null);

    try {
      const blob = await saveEditedPdf(file, annotations, drawings, formValues);
      const name = file.name.replace(/\.pdf$/i, "");
      setResult({ blob, filename: `${name}-edited.pdf` });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save PDF");
      setState("editing");
    }
  }, [file, annotations, drawings, formValues]);

  const handleReset = useCallback(() => {
    setFile(null);
    setTotalPages(0);
    setCurrentPage(1);
    setZoom(1);
    setActiveTool("select");
    setAnnotations([]);
    setDrawings([]);
    setSelectedAnnotationId(null);
    setResult(null);
    setError(null);
    setState("upload");
  }, []);

  // Upload state
  if (state === "upload") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/pdf-tools" className="hover:text-blue-600">PDF Tools</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-900">Edit PDF</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit PDF</h1>
        <p className="text-gray-600 mb-4">
          Open any PDF to fill forms, add text, draw annotations, and download the edited file. Free, no sign-up required.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Free
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Zap className="w-3.5 h-3.5" /> No Sign-Up
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Monitor className="w-3.5 h-3.5" /> Runs in Browser
          </span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <PdfUploadZone
            onFilesSelected={handleFileSelected}
            accept={[".pdf"]}
            multiple={false}
            label="Select PDF to edit"
            sublabel="or drag & drop your PDF here"
          />
          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}
        </div>
      </div>
    );
  }

  // Done state
  if (state === "done" && result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <PdfDownloadResult
          blob={result.blob}
          filename={result.filename}
          onReset={handleReset}
        />
      </div>
    );
  }

  // Editor state
  return (
    <div className="min-h-screen bg-gray-100">
      <EditorToolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        zoom={zoom}
        onZoomChange={setZoom}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSave={handleSave}
        onReset={handleReset}
        hasFormFields={false}
        isSaving={state === "saving"}
        hasAnnotations={annotations.length > 0 || drawings.length > 0}
        onClearAnnotations={handleClearAnnotations}
      />

      {error && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6">
        {file &&
          Array.from({ length: totalPages }, (_, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) pageRefs.current.set(i, el);
              }}
            >
              <PdfEditorPage
                file={file}
                pageIndex={i}
                zoom={zoom}
                activeTool={activeTool}
                annotations={annotations}
                selectedAnnotationId={selectedAnnotationId}
                onAnnotationAdd={handleAnnotationAdd}
                onAnnotationUpdate={handleAnnotationUpdate}
                onAnnotationSelect={setSelectedAnnotationId}
                onAnnotationDelete={handleAnnotationDelete}
                onDrawingComplete={handleDrawingComplete}
                drawings={drawings}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
