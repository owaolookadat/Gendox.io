import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";
import {
  FONT,
  BODY_SIZE,
  NAME_SIZE,
  SMALL_SIZE,
  SPACING,
  SPACING_TIGHT,
  COLOR_DARK,
  COLOR_GRAY,
  COLOR_LIGHT,
  formatDate,
  spacer,
  buildLetterDocument,
} from "./letter-utils";

export interface MemoData {
  from: string;
  to: string;
  cc: string;
  date: string;
  subject: string;
  priority: string;
  body: string;
  actionRequired: string;
}

// ── Priority helpers ──

function priorityColor(priority: string): string {
  switch (priority) {
    case "High":
      return "CC0000";
    case "Low":
      return COLOR_LIGHT;
    default:
      return COLOR_DARK;
  }
}

function closingSentence(priority: string): string {
  switch (priority) {
    case "High":
      return "Immediate attention to this matter is required. Please respond or take action at your earliest opportunity.";
    case "Low":
      return "This memo is provided for your information. No immediate action is required unless otherwise noted.";
    default:
      return "Please review the above and do not hesitate to reach out if you have any questions.";
  }
}

// ── Header field row ──

function headerField(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({
        text: `${label}:`.padEnd(12),
        bold: true,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_DARK,
      }),
      new TextRun({
        text: value,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
    ],
  });
}

// ── Gray separator line ──

function separator(): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 300 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: "CCCCCC",
        space: 1,
      },
    },
    children: [],
  });
}

// ── Bullet list from multiline text ──

function bulletList(text: string): Paragraph[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map(
      (line) =>
        new Paragraph({
          spacing: { after: 80 },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: line.replace(/^[-•*]\s*/, ""),
              size: BODY_SIZE,
              font: FONT,
              color: COLOR_DARK,
            }),
          ],
        })
    );
}

// ── Main generator ──

export async function generateMemo(data: MemoData): Promise<Blob> {
  const paragraphs: Paragraph[] = [];
  const isHigh = data.priority === "High";
  const isLow = data.priority === "Low";

  // ── Title ──
  const titleRuns: TextRun[] = [];
  if (isHigh) {
    titleRuns.push(
      new TextRun({
        text: "URGENT — ",
        bold: true,
        size: 36,
        font: FONT,
        color: "CC0000",
      })
    );
  }
  titleRuns.push(
    new TextRun({
      text: "MEMORANDUM",
      bold: true,
      size: 36,
      font: FONT,
      color: COLOR_DARK,
    })
  );

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: titleRuns,
    })
  );

  // ── Header fields ──
  paragraphs.push(headerField("TO", data.to));
  paragraphs.push(headerField("FROM", data.from));
  if (data.cc) {
    paragraphs.push(headerField("CC", data.cc));
  }
  paragraphs.push(headerField("DATE", formatDate(data.date)));
  paragraphs.push(headerField("RE", data.subject));

  if (data.priority !== "Normal") {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: "PRIORITY:".padEnd(12),
            bold: true,
            size: BODY_SIZE,
            font: FONT,
            color: COLOR_DARK,
          }),
          new TextRun({
            text: data.priority.toUpperCase(),
            bold: true,
            size: BODY_SIZE,
            font: FONT,
            color: priorityColor(data.priority),
          }),
        ],
      })
    );
  }

  // ── Separator ──
  paragraphs.push(separator());

  // ── Body paragraphs ──
  const bodyLines = data.body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  for (const line of bodyLines) {
    paragraphs.push(
      new Paragraph({
        spacing: SPACING,
        children: [
          new TextRun({
            text: line,
            size: BODY_SIZE,
            font: FONT,
            color: COLOR_DARK,
          }),
        ],
      })
    );
  }

  // ── Action items ──
  if (data.actionRequired) {
    paragraphs.push(separator());

    const actionHeadingText = isHigh
      ? "ACTION REQUIRED — IMMEDIATE"
      : "Action Required";

    paragraphs.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: actionHeadingText,
            bold: true,
            size: BODY_SIZE,
            font: FONT,
            color: isHigh ? "CC0000" : COLOR_DARK,
          }),
        ],
      })
    );

    paragraphs.push(...bulletList(data.actionRequired));
  }

  // ── Closing sentence ──
  paragraphs.push(spacer());
  paragraphs.push(
    new Paragraph({
      spacing: SPACING,
      children: [
        new TextRun({
          text: closingSentence(data.priority),
          italics: true,
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
      ],
    })
  );

  return await buildLetterDocument(paragraphs);
}
