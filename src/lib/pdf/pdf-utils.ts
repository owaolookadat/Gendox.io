import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

/**
 * Read a File as ArrayBuffer
 */
export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Load a File as a pdf-lib PDFDocument
 */
export async function loadPdfDocument(file: File): Promise<PDFDocument> {
  const buffer = await readFileAsArrayBuffer(file);
  return PDFDocument.load(buffer, { ignoreEncryption: true });
}

/**
 * Get page count from a PDF file without fully loading it
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const doc = await loadPdfDocument(file);
  return doc.getPageCount();
}

/**
 * Trigger download of a Blob
 */
export function downloadBlob(blob: Blob, filename: string) {
  saveAs(blob, filename);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/**
 * Validate file type
 */
export function isValidFileType(file: File, accept: string[]): boolean {
  return accept.some((type) => {
    if (type.startsWith(".")) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type === type;
  });
}

/**
 * Get pdfjs worker source path
 */
export function getPdfjsWorkerSrc(): string {
  return "/pdf.worker.min.mjs";
}

/**
 * Dynamically load pdfjs-dist (client-side only)
 */
export async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = getPdfjsWorkerSrc();
  return pdfjs;
}

/**
 * Load a PDF file using pdfjs for rendering
 */
export async function loadPdfjsDocument(file: File) {
  const pdfjs = await getPdfjs();
  const buffer = await readFileAsArrayBuffer(file);
  return pdfjs.getDocument({ data: buffer }).promise;
}

/**
 * Render a single PDF page to a canvas element
 */
export async function renderPageToCanvas(
  pdfjsDoc: Awaited<ReturnType<typeof loadPdfjsDocument>>,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  targetWidth: number = 200
) {
  const page = await pdfjsDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1 });
  const scale = targetWidth / viewport.width;
  const scaledViewport = page.getViewport({ scale });

  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await page.render({
    canvasContext: ctx,
    viewport: scaledViewport,
  } as any).promise;
}
