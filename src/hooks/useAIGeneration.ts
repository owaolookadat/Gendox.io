"use client";

import { useState, useCallback } from "react";

interface UseAIGenerationReturn {
  aiContent: string | null;
  isGenerating: boolean;
  error: string | null;
  generate: (tool: string, data: Record<string, unknown>) => Promise<string | null>;
  clearAI: () => void;
}

export function useAIGeneration(): UseAIGenerationReturn {
  const [aiContent, setAiContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (tool: string, data: Record<string, unknown>): Promise<string | null> => {
      setIsGenerating(true);
      setError(null);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool, data }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Unknown error" }));
          // If AI is not configured (503), return null so fallback can work
          if (res.status === 503) {
            setError(null);
            return null;
          }
          throw new Error(err.error || `HTTP ${res.status}`);
        }

        const json = await res.json();
        setAiContent(json.content);
        return json.content;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to generate";
        setError(msg);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const clearAI = useCallback(() => {
    setAiContent(null);
    setError(null);
  }, []);

  return { aiContent, isGenerating, error, generate, clearAI };
}
