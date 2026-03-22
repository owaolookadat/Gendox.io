"use client";

import { useState, useCallback } from "react";
import PdfToolShell from "@/components/pdf/PdfToolShell";
import PdfUploadZone from "@/components/pdf/PdfUploadZone";
import PdfDownloadResult from "@/components/pdf/PdfDownloadResult";
import ProcessingOverlay from "@/components/pdf/ProcessingOverlay";
import { usePdfTool } from "@/hooks/usePdfTool";
import { getPdfPageCount } from "@/lib/pdf/pdf-utils";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";

type Quality = "normal" | "high";

export default function PdfToJpgClient() {
  const seo = getToolSeoContent("pdf-to-jpg");
  const relatedTools = getRelatedTools("pdf-to-jpg");
  const tool = usePdfTool();
  const [pageCount, setPageCount] = useState(0);
  const [quality, setQuality] = useState<Quality>("normal");

  const handleFileSelected = useCallback(
    async (files: File[]) => {
      tool.setFiles(files);
      const count = await getPdfPageCount(files[0]);
      setPageCount(count);
    },
    [tool]
  );

  const handleConvert = useCallback(async () => {
    tool.startProcessing();
    try {
      const { loadPdfjsDocument } = await import("@/lib/pdf/pdf-utils");
      const pdfjsDoc = await loadPdfjsDocument(tool.files[0]);
      const scale = quality === "high" ? 3 : 2;

      if (pageCount === 1) {
        // Single page — download as JPG directly
        const page = await pdfjsDoc.getPage(1);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: ctx, viewport } as any).promise;

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (b) => resolve(b!),
            "image/jpeg",
            quality === "high" ? 0.95 : 0.85
          );
        });
        tool.setResult(blob, "page-1.jpg");
      } else {
        // Multiple pages — create a ZIP
        const { default: JSZip } = await import("jszip");
        const zip = new JSZip();

        for (let i = 1; i <= pageCount; i++) {
          const page = await pdfjsDoc.getPage(i);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d")!;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: ctx, viewport } as any).promise;

          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob(
              (b) => resolve(b!),
              "image/jpeg",
              quality === "high" ? 0.95 : 0.85
            );
          });
          zip.file(`page-${i}.jpg`, blob);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        tool.setResult(zipBlob, "pages.zip");
      }
    } catch (err) {
      // If JSZip not installed, fall back to error
      if (
        err instanceof Error &&
        err.message.includes("Cannot find module")
      ) {
        tool.setProcessingError(
          "Multi-page export requires the jszip package. Single-page PDFs work fine."
        );
      } else {
        tool.setProcessingError(
          err instanceof Error ? err.message : "Failed to convert PDF"
        );
      }
    }
  }, [tool, quality, pageCount]);

  return (
    <PdfToolShell
      title="PDF to JPG"
      description="Convert each page of your PDF into a JPG image."
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
        <div className="space-y-6">
          <div className="text-sm text-gray-700">
            <p>
              <strong>{pageCount}</strong> page
              {pageCount !== 1 ? "s" : ""} detected.{" "}
              {pageCount > 1
                ? "Each page will be converted to a separate JPG and downloaded as a ZIP."
                : "The page will be converted to a JPG image."}
            </p>
          </div>

          {/* Quality selector */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Quality
            </label>
            <div className="flex gap-3">
              {(["normal", "high"] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md border transition-colors ${
                    quality === q
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {q === "normal" ? "Normal" : "High"}
                  <span className="block text-xs text-gray-400 mt-0.5">
                    {q === "normal" ? "Recommended" : "Larger file size"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {tool.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {tool.error}
            </div>
          )}

          <button
            onClick={handleConvert}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-base"
          >
            Convert to JPG
          </button>
        </div>
      )}

      {tool.isProcessing && (
        <ProcessingOverlay message="Converting pages to JPG..." />
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
