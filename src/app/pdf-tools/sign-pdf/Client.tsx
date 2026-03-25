"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import PdfToolShell from "@/components/pdf/PdfToolShell";
import PdfUploadZone from "@/components/pdf/PdfUploadZone";
import PdfDownloadResult from "@/components/pdf/PdfDownloadResult";
import ProcessingOverlay from "@/components/pdf/ProcessingOverlay";
import { usePdfTool } from "@/hooks/usePdfTool";
import { getPdfPageCount } from "@/lib/pdf/pdf-utils";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import { retrieveTransferFile } from "@/lib/pdf/pdf-file-transfer";
import { Eraser, Type, Pen } from "lucide-react";

type SignMode = "draw" | "type";
type SignStep = "create" | "place";

export default function SignPdfClient() {
  const seo = getToolSeoContent("sign-pdf");
  const relatedTools = getRelatedTools("sign-pdf");
  const tool = usePdfTool();
  const [pageCount, setPageCount] = useState(0);
  const [step, setStep] = useState<SignStep>("create");
  const [signMode, setSignMode] = useState<SignMode>("draw");
  const [typedName, setTypedName] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const [sigPosition, setSigPosition] = useState({ x: 50, y: 85 }); // percentage
  const [sigScale, setSigScale] = useState(30); // percentage of page width

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleFileSelected = useCallback(
    async (files: File[]) => {
      tool.setFiles(files);
      const count = await getPdfPageCount(files[0]);
      setPageCount(count);
      setStep("create");
      setSignatureDataUrl(null);
      setHasDrawn(false);
    },
    [tool]
  );

  // Drawing handlers
  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * (canvas.width / rect.width),
        y: (e.touches[0].clientY - rect.top) * (canvas.height / rect.height),
      };
    }
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    setHasDrawn(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const endDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 500;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [step, signMode]);

  const confirmSignature = () => {
    if (signMode === "draw") {
      const dataUrl = canvasRef.current?.toDataURL("image/png");
      if (dataUrl) setSignatureDataUrl(dataUrl);
    } else if (typedName.trim()) {
      // Render typed name as image
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 400, 100);
      ctx.font = "italic 40px 'Georgia', serif";
      ctx.fillStyle = "#1a1a1a";
      ctx.fillText(typedName, 10, 60);
      setSignatureDataUrl(canvas.toDataURL("image/png"));
    }
    setStep("place");
  };

  const handleSign = useCallback(async () => {
    if (!signatureDataUrl) return;
    tool.startProcessing();
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await tool.files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

      // Convert data URL to bytes
      const sigResponse = await fetch(signatureDataUrl);
      const sigBytes = await sigResponse.arrayBuffer();
      const sigImage = await pdf.embedPng(new Uint8Array(sigBytes));

      const page = pdf.getPages()[selectedPage - 1];
      const { width, height } = page.getSize();

      const sigWidth = (width * sigScale) / 100;
      const sigHeight = sigWidth * (sigImage.height / sigImage.width);
      const x = (width * sigPosition.x) / 100 - sigWidth / 2;
      const y = height - (height * sigPosition.y) / 100 - sigHeight / 2;

      page.drawImage(sigImage, {
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: sigWidth,
        height: sigHeight,
      });

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      tool.setResult(blob, `signed-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      tool.setProcessingError(
        err instanceof Error ? err.message : "Failed to sign PDF"
      );
    }
  }, [tool, signatureDataUrl, selectedPage, sigPosition, sigScale]);

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
      title="Sign PDF"
      description="Draw or type your signature and place it on your PDF document."
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

      {tool.isConfigure && step === "create" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Step 1: Create your signature
          </h3>

          {/* Mode toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setSignMode("draw")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
                signMode === "draw"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Pen className="w-4 h-4" />
              Draw
            </button>
            <button
              onClick={() => setSignMode("type")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
                signMode === "type"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Type className="w-4 h-4" />
              Type
            </button>
          </div>

          {signMode === "draw" ? (
            <div>
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white relative">
                <canvas
                  ref={canvasRef}
                  className="w-full cursor-crosshair touch-none"
                  style={{ height: "160px" }}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-gray-400 text-sm">
                      Draw your signature here
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={clearCanvas}
                className="flex items-center gap-1 mt-2 text-sm text-gray-500 hover:text-red-500"
              >
                <Eraser className="w-4 h-4" />
                Clear
              </button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Type your full name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              {typedName && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-2xl italic font-serif text-gray-900">
                    {typedName}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={confirmSignature}
            disabled={signMode === "draw" ? !hasDrawn : !typedName.trim()}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to placement →
          </button>
        </div>
      )}

      {tool.isConfigure && step === "place" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Step 2: Place your signature
            </h3>
            <button
              onClick={() => setStep("create")}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ← Change signature
            </button>
          </div>

          {/* Signature preview */}
          {signatureDataUrl && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={signatureDataUrl}
                alt="Your signature"
                className="h-12 mx-auto"
              />
            </div>
          )}

          {/* Page selector */}
          {pageCount > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page
              </label>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {Array.from({ length: pageCount }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Page {i + 1} of {pageCount}
                    {i + 1 === pageCount ? " (last page)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Position controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Horizontal position
              </label>
              <input
                type="range"
                value={sigPosition.x}
                onChange={(e) =>
                  setSigPosition((p) => ({ ...p, x: Number(e.target.value) }))
                }
                min={10}
                max={90}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Left</span>
                <span>Right</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Vertical position
              </label>
              <input
                type="range"
                value={sigPosition.y}
                onChange={(e) =>
                  setSigPosition((p) => ({ ...p, y: Number(e.target.value) }))
                }
                min={10}
                max={95}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Top</span>
                <span>Bottom</span>
              </div>
            </div>
          </div>

          {/* Size control */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Signature size: {sigScale}%
            </label>
            <input
              type="range"
              value={sigScale}
              onChange={(e) => setSigScale(Number(e.target.value))}
              min={10}
              max={60}
              className="w-full"
            />
          </div>

          {tool.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {tool.error}
            </div>
          )}

          <button
            onClick={handleSign}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-base"
          >
            Sign PDF
          </button>
        </div>
      )}

      {tool.isProcessing && <ProcessingOverlay message="Signing PDF..." />}

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
