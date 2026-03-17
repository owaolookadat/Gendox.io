"use client";

import { useState, useCallback } from "react";

export type PdfToolState = "upload" | "configure" | "processing" | "done";

interface PdfToolResult {
  blob: Blob;
  filename: string;
}

export function usePdfTool() {
  const [state, setState] = useState<PdfToolState>("upload");
  const [files, setFilesState] = useState<File[]>([]);
  const [result, setResultState] = useState<PdfToolResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const setFiles = useCallback((newFiles: File[]) => {
    setFilesState(newFiles);
    setError(null);
    if (newFiles.length > 0) {
      setState("configure");
    }
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    setFilesState((prev) => [...prev, ...newFiles]);
    setError(null);
    setState("configure");
  }, []);

  const removeFile = useCallback((index: number) => {
    setFilesState((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setState("upload");
      return next;
    });
  }, []);

  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setFilesState((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const startProcessing = useCallback(() => {
    setState("processing");
    setError(null);
    setProgress(0);
  }, []);

  const setResult = useCallback((blob: Blob, filename: string) => {
    setResultState({ blob, filename });
    setState("done");
    setProgress(100);
  }, []);

  const setProcessingError = useCallback((msg: string) => {
    setError(msg);
    setState("configure");
    setProgress(0);
  }, []);

  const reset = useCallback(() => {
    setState("upload");
    setFilesState([]);
    setResultState(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
    state,
    files,
    result,
    error,
    progress,
    isUpload: state === "upload",
    isConfigure: state === "configure",
    isProcessing: state === "processing",
    isDone: state === "done",
    setFiles,
    addFiles,
    removeFile,
    reorderFiles,
    startProcessing,
    setResult,
    setProcessingError,
    setProgress,
    reset,
  };
}
