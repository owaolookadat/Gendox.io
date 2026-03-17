import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";
import {
  FONT,
  BODY_SIZE,
  NAME_SIZE,
  SMALL_SIZE,
  SPACING,
  SPACING_TIGHT,
  SPACING_NONE,
  COLOR_DARK,
  COLOR_GRAY,
  COLOR_LIGHT,
  formatDate,
  spacer,
  buildLetterDocument,
} from "./letter-utils";

export interface MeetingMinutesData {
  meetingTitle: string;
  date: string;
  time: string;
  location: string;
  chairperson: string;
  attendees: string;
  absentees: string;
  agendaItems: string;
  discussionPoints: string;
  decisionsMade: string;
  actionItems: string;
  nextMeetingDate: string;
}

// ── Section separator ──

function sectionSeparator(): Paragraph {
  return new Paragraph({
    spacing: { before: 100, after: 200 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: "DDDDDD",
        space: 1,
      },
    },
    children: [],
  });
}

// ── Section heading ──

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 300, after: 150 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_DARK,
      }),
    ],
  });
}

// ── Detail row (label: value) ──

function detailRow(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({
        text: `${label}:`.padEnd(16),
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

// ── Bullet list from multiline text ──

function bulletItems(text: string): Paragraph[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
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

// ── Numbered items from multiline text ──

function numberedItems(text: string): Paragraph[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return lines.map((line, idx) => {
    // Strip any existing numbering (e.g. "1. " or "1) ")
    const cleaned = line.replace(/^\d+[.)]\s*/, "");
    return new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `${idx + 1}.  `,
          bold: true,
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
        new TextRun({
          text: cleaned,
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    });
  });
}

// ── Action items with owner parsing ──
// Supports formats like "Task description - John" or "Task description (John)"

function actionItemsList(text: string): Paragraph[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return lines.map((line) => {
    const cleaned = line.replace(/^[-•*]\s*/, "");

    // Try to parse owner from "task - Owner" or "task (Owner)"
    const dashMatch = cleaned.match(/^(.+?)\s*[-–—]\s*([A-Z][A-Za-z\s.]+)$/);
    const parenMatch = cleaned.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    const match = dashMatch || parenMatch;

    if (match) {
      const task = match[1].trim();
      const owner = match[2].trim();
      return new Paragraph({
        spacing: { after: 80 },
        bullet: { level: 0 },
        children: [
          new TextRun({
            text: task,
            size: BODY_SIZE,
            font: FONT,
            color: COLOR_DARK,
          }),
          new TextRun({
            text: `  [${owner}]`,
            bold: true,
            size: BODY_SIZE,
            font: FONT,
            color: COLOR_GRAY,
          }),
        ],
      });
    }

    return new Paragraph({
      spacing: { after: 80 },
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: cleaned,
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    });
  });
}

// ── Body paragraphs from multiline text ──

function bodyParagraphs(text: string): Paragraph[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map(
      (line) =>
        new Paragraph({
          spacing: { after: 120 },
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

// ── Main generator ──

export async function generateMeetingMinutes(
  data: MeetingMinutesData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [];

  // ── Document title ──
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: "MEETING MINUTES",
          bold: true,
          size: 36,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    })
  );

  // ── Meeting title ──
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: data.meetingTitle,
          bold: true,
          size: NAME_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
      ],
    })
  );

  paragraphs.push(sectionSeparator());

  // ── Meeting details ──
  paragraphs.push(detailRow("Date", formatDate(data.date)));
  paragraphs.push(detailRow("Time", data.time));
  paragraphs.push(detailRow("Location", data.location));
  paragraphs.push(detailRow("Chairperson", data.chairperson));

  paragraphs.push(sectionSeparator());

  // ── Attendees ──
  paragraphs.push(sectionHeading("Attendees"));
  paragraphs.push(...bulletItems(data.attendees));

  // ── Absentees ──
  if (data.absentees) {
    paragraphs.push(sectionHeading("Absentees"));
    paragraphs.push(...bulletItems(data.absentees));
  }

  paragraphs.push(sectionSeparator());

  // ── Agenda ──
  paragraphs.push(sectionHeading("Agenda"));
  paragraphs.push(...numberedItems(data.agendaItems));

  paragraphs.push(sectionSeparator());

  // ── Discussion Points ──
  paragraphs.push(sectionHeading("Discussion Points"));
  paragraphs.push(...bodyParagraphs(data.discussionPoints));

  paragraphs.push(sectionSeparator());

  // ── Decisions Made ──
  paragraphs.push(sectionHeading("Decisions Made"));
  paragraphs.push(...bulletItems(data.decisionsMade));

  paragraphs.push(sectionSeparator());

  // ── Action Items ──
  paragraphs.push(sectionHeading("Action Items"));
  paragraphs.push(...actionItemsList(data.actionItems));

  // ── Next Meeting ──
  if (data.nextMeetingDate) {
    paragraphs.push(sectionSeparator());
    paragraphs.push(sectionHeading("Next Meeting"));
    paragraphs.push(
      new Paragraph({
        spacing: SPACING,
        children: [
          new TextRun({
            text: formatDate(data.nextMeetingDate),
            size: BODY_SIZE,
            font: FONT,
            color: COLOR_DARK,
          }),
        ],
      })
    );
  }

  // ── Footer note ──
  paragraphs.push(spacer());
  paragraphs.push(
    new Paragraph({
      spacing: SPACING,
      children: [
        new TextRun({
          text: `Minutes prepared by ${data.chairperson} on ${formatDate(data.date)}.`,
          italics: true,
          size: SMALL_SIZE,
          font: FONT,
          color: COLOR_LIGHT,
        }),
      ],
    })
  );

  return await buildLetterDocument(paragraphs);
}
