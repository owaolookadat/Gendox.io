import type { TextAnnotationData } from "@/components/pdf/editor/TextAnnotation";

interface DrawingData {
  pageIndex: number;
  dataUrl: string;
}

interface FormFieldValue {
  fieldName: string;
  value: string | boolean;
}

export async function saveEditedPdf(
  originalFile: File,
  annotations: TextAnnotationData[],
  drawings: DrawingData[],
  formValues: FormFieldValue[]
): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const bytes = await originalFile.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

  // Fill form fields
  if (formValues.length > 0) {
    try {
      const form = pdf.getForm();
      for (const fv of formValues) {
        try {
          const field = form.getField(fv.fieldName);
          if (!field) continue;
          const type = field.constructor.name;
          if (type === "PDFTextField" && typeof fv.value === "string") {
            (field as ReturnType<typeof form.getTextField>).setText(fv.value);
          } else if (type === "PDFCheckBox" && typeof fv.value === "boolean") {
            const cb = field as ReturnType<typeof form.getCheckBox>;
            fv.value ? cb.check() : cb.uncheck();
          } else if (type === "PDFDropdown" && typeof fv.value === "string") {
            (field as ReturnType<typeof form.getDropdown>).select(fv.value);
          }
        } catch {
          // skip fields that can't be filled
        }
      }
      form.flatten();
    } catch {
      // PDF may not have a valid form
    }
  }

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();

  // Embed text annotations
  for (const ann of annotations) {
    if (ann.pageIndex >= pages.length || !ann.content) continue;
    const page = pages[ann.pageIndex];
    const { width, height } = page.getSize();
    const x = (ann.x / 100) * width;
    const y = height - (ann.y / 100) * height - ann.fontSize; // flip Y axis

    // Parse hex color
    const hex = ann.fontColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    page.drawText(ann.content, {
      x,
      y,
      size: ann.fontSize,
      font,
      color: rgb(r, g, b),
    });
  }

  // Embed drawings
  for (const drawing of drawings) {
    if (drawing.pageIndex >= pages.length) continue;
    const page = pages[drawing.pageIndex];
    const { width, height } = page.getSize();

    try {
      // Convert data URL to bytes
      const base64 = drawing.dataUrl.split(",")[1];
      const binaryStr = atob(base64);
      const drawingBytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        drawingBytes[i] = binaryStr.charCodeAt(i);
      }

      const image = await pdf.embedPng(drawingBytes);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
        opacity: 1,
      });
    } catch {
      // skip drawings that fail to embed
    }
  }

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
}
