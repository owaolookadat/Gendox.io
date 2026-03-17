import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";

// ── Shared constants ──

export const FONT = "Calibri";
export const BODY_SIZE = 24; // 12pt
export const NAME_SIZE = 28; // 14pt
export const SMALL_SIZE = 20; // 10pt
export const SPACING = { after: 200 };
export const SPACING_TIGHT = { after: 40 };
export const SPACING_NONE = { after: 0 };
export const COLOR_DARK = "1a1a1a";
export const COLOR_GRAY = "555555";
export const COLOR_LIGHT = "888888";

// ── Date formatting ──

export function formatDate(dateString: string): string {
  if (!dateString) return "[Date]";
  const date = new Date(dateString + (dateString.includes("T") ? "" : "T00:00:00"));
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function todayFormatted(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Simple deterministic hash for variant selection ──

export function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function pickVariant<T>(variants: T[], seed: string): T {
  return variants[simpleHash(seed) % variants.length];
}

// ── Paragraph builders ──

export function senderName(name: string): Paragraph {
  return new Paragraph({
    spacing: SPACING_TIGHT,
    children: [
      new TextRun({
        text: name,
        bold: true,
        size: NAME_SIZE,
        font: FONT,
        color: COLOR_DARK,
      }),
    ],
  });
}

export function contactLine(text: string): Paragraph {
  return new Paragraph({
    spacing: SPACING_TIGHT,
    children: [
      new TextRun({
        text,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
    ],
  });
}

export function addressLines(address: string): Paragraph[] {
  if (!address) return [];
  return address
    .split("\n")
    .filter((l) => l.trim())
    .map(
      (line) =>
        new Paragraph({
          spacing: SPACING_TIGHT,
          children: [
            new TextRun({
              text: line.trim(),
              size: BODY_SIZE,
              font: FONT,
              color: COLOR_GRAY,
            }),
          ],
        })
    );
}

export function spacer(): Paragraph {
  return new Paragraph({ spacing: SPACING, children: [] });
}

export function dateParagraph(date: string): Paragraph {
  return new Paragraph({
    spacing: SPACING,
    children: [
      new TextRun({
        text: date,
        size: BODY_SIZE,
        font: FONT,
      }),
    ],
  });
}

export function recipientLine(text: string): Paragraph {
  return new Paragraph({
    spacing: SPACING_TIGHT,
    children: [
      new TextRun({
        text,
        size: BODY_SIZE,
        font: FONT,
      }),
    ],
  });
}

export function salutation(recipientName: string, style: "formal" | "friendly" = "formal"): Paragraph {
  const text = style === "friendly" ? `Dear ${recipientName},` : `Dear ${recipientName},`;
  return new Paragraph({
    spacing: SPACING,
    children: [
      new TextRun({
        text,
        size: BODY_SIZE,
        font: FONT,
      }),
    ],
  });
}

export function subjectLine(text: string): Paragraph {
  return new Paragraph({
    spacing: SPACING,
    children: [
      new TextRun({
        text: `Re: ${text}`,
        bold: true,
        size: BODY_SIZE,
        font: FONT,
      }),
    ],
  });
}

export function bodyText(text: string): Paragraph {
  return new Paragraph({
    spacing: SPACING,
    children: [
      new TextRun({
        text,
        size: BODY_SIZE,
        font: FONT,
      }),
    ],
  });
}

export function boldBodyText(text: string): Paragraph {
  return new Paragraph({
    spacing: SPACING,
    children: [
      new TextRun({
        text,
        bold: true,
        size: BODY_SIZE,
        font: FONT,
      }),
    ],
  });
}

export function richBodyText(runs: TextRun[]): Paragraph {
  return new Paragraph({
    spacing: SPACING,
    children: runs,
  });
}

export function closing(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: `${text},`,
        size: BODY_SIZE,
        font: FONT,
      }),
    ],
  });
}

export function signatureSpace(): Paragraph[] {
  return [
    new Paragraph({ spacing: { after: 80 }, children: [] }),
    new Paragraph({ spacing: { after: 80 }, children: [] }),
  ];
}

export function signatureName(name: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: name,
        bold: true,
        size: BODY_SIZE,
        font: FONT,
      }),
    ],
  });
}

export function signatureTitle(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
    ],
  });
}

export function signatureCompany(company: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: company,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
    ],
  });
}

// ── Standard letter header block ──

interface LetterHeaderOptions {
  senderName: string;
  senderTitle?: string;
  senderCompany?: string;
  senderAddress?: string;
  senderEmail?: string;
  senderPhone?: string;
  date: string;
  recipientName: string;
  recipientTitle?: string;
  recipientCompany?: string;
  recipientAddress?: string;
}

export function letterHeader(opts: LetterHeaderOptions): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Sender block
  paragraphs.push(senderName(opts.senderName));
  if (opts.senderTitle) paragraphs.push(contactLine(opts.senderTitle));
  if (opts.senderCompany) paragraphs.push(contactLine(opts.senderCompany));
  if (opts.senderAddress) paragraphs.push(...addressLines(opts.senderAddress));
  if (opts.senderEmail) paragraphs.push(contactLine(opts.senderEmail));
  if (opts.senderPhone) paragraphs.push(contactLine(opts.senderPhone));

  // Spacer + date
  paragraphs.push(spacer());
  paragraphs.push(dateParagraph(opts.date));

  // Recipient block
  paragraphs.push(recipientLine(opts.recipientName));
  if (opts.recipientTitle) paragraphs.push(recipientLine(opts.recipientTitle));
  if (opts.recipientCompany) paragraphs.push(recipientLine(opts.recipientCompany));
  if (opts.recipientAddress) paragraphs.push(...addressLines(opts.recipientAddress));

  paragraphs.push(spacer());

  return paragraphs;
}

// ── Standard letter footer block ──

interface LetterFooterOptions {
  closingText: string;
  signerName: string;
  signerTitle?: string;
  signerCompany?: string;
}

export function letterFooter(opts: LetterFooterOptions): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  paragraphs.push(closing(opts.closingText));
  paragraphs.push(...signatureSpace());
  paragraphs.push(signatureName(opts.signerName));
  if (opts.signerTitle) paragraphs.push(signatureTitle(opts.signerTitle));
  if (opts.signerCompany) paragraphs.push(signatureCompany(opts.signerCompany));
  return paragraphs;
}

// ── Build document from paragraphs ──

export async function buildLetterDocument(paragraphs: Paragraph[]): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });
  return await Packer.toBlob(doc);
}
