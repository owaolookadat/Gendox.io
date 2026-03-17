"use client";

import { useState, useCallback } from "react";

type FlowState = "editing" | "previewing";

interface UseDocumentFlowReturn {
  state: FlowState;
  isEditing: boolean;
  isPreviewing: boolean;
  showPreview: () => void;
  goBackToEdit: () => void;
}

export function useDocumentFlow(): UseDocumentFlowReturn {
  const [state, setState] = useState<FlowState>("editing");

  const showPreview = useCallback(() => {
    setState("previewing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBackToEdit = useCallback(() => {
    setState("editing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return {
    state,
    isEditing: state === "editing",
    isPreviewing: state === "previewing",
    showPreview,
    goBackToEdit,
  };
}
