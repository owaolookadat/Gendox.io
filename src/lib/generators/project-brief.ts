import { Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";
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
  todayFormatted,
  spacer,
  buildLetterDocument,
} from "./letter-utils";

export interface ProjectBriefData {
  projectName: string;
  projectOwner: string;
  date: string;
  backgroundContext: string;
  problemStatement: string;
  projectObjectives: string;
  targetAudience: string;
  scope: string;
  keyDeliverables: string;
  timeline: string;
  budget: string;
  successMetrics: string;
  stakeholders: string;
  risksConstraints: string;
}

// ── Helpers ──

const HEADING_SIZE = 26; // 13pt
const TITLE_SIZE = 36; // 18pt
const META_LABEL_SIZE = 20; // 10pt

function numberedSectionHeading(num: number, text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 360, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 },
    },
    children: [
      new TextRun({
        text: `${num}.  `,
        bold: true,
        size: HEADING_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
      new TextRun({
        text,
        bold: true,
        size: HEADING_SIZE,
        font: FONT,
        color: COLOR_DARK,
      }),
    ],
  });
}

function bodyParagraph(text: string): Paragraph {
  return new Paragraph({
    spacing: SPACING,
    children: [
      new TextRun({
        text,
        size: BODY_SIZE,
        font: FONT,
        color: "333333",
      }),
    ],
  });
}

function multiLineParagraphs(text: string): Paragraph[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => bodyParagraph(line));
}

function bulletItem(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: 360 },
    children: [
      new TextRun({
        text: "\u2022  ",
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
      new TextRun({
        text,
        size: BODY_SIZE,
        font: FONT,
        color: "333333",
      }),
    ],
  });
}

function buildBulletList(text: string): Paragraph[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => bulletItem(line));
}

function metaRow(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: SPACING_TIGHT,
    children: [
      new TextRun({
        text: `${label}:  `,
        bold: true,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
      new TextRun({
        text: value,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_DARK,
      }),
    ],
  });
}

// ── Generator ──

export async function generateProjectBrief(
  data: ProjectBriefData
): Promise<Blob> {
  const formattedDate = data.date
    ? formatDate(data.date)
    : todayFormatted();

  const paragraphs: Paragraph[] = [];

  // ── Document header ──
  paragraphs.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "PROJECT BRIEF",
          size: META_LABEL_SIZE,
          font: FONT,
          color: COLOR_LIGHT,
          allCaps: true,
        }),
      ],
    })
  );

  // Project name prominently
  paragraphs.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: data.projectName,
          bold: true,
          size: TITLE_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    })
  );

  // Accent divider
  paragraphs.push(
    new Paragraph({
      spacing: { after: 200 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "2B579A", space: 6 },
      },
      children: [],
    })
  );

  // ── Metadata block ──
  paragraphs.push(metaRow("Project Owner", data.projectOwner));
  paragraphs.push(metaRow("Date", formattedDate));

  if (data.stakeholders) {
    paragraphs.push(metaRow("Key Stakeholders", data.stakeholders));
  }

  paragraphs.push(spacer());

  // ── Numbered sections ──
  let sectionNum = 1;

  // 1. Executive Summary (derived from problem statement)
  paragraphs.push(numberedSectionHeading(sectionNum++, "Executive Summary"));
  paragraphs.push(
    bodyParagraph(
      `This project brief outlines the ${data.projectName} initiative. ${data.problemStatement}`
    )
  );

  // 2. Background / Context
  paragraphs.push(numberedSectionHeading(sectionNum++, "Background & Context"));
  paragraphs.push(...multiLineParagraphs(data.backgroundContext));

  // 3. Project Objectives
  paragraphs.push(numberedSectionHeading(sectionNum++, "Project Objectives"));
  // Render as bullets if multi-line, otherwise as a paragraph
  const objectiveLines = data.projectObjectives
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (objectiveLines.length > 1) {
    paragraphs.push(...objectiveLines.map((line) => bulletItem(line)));
  } else {
    paragraphs.push(bodyParagraph(data.projectObjectives));
  }

  // 4. Target Audience (optional)
  if (data.targetAudience) {
    paragraphs.push(numberedSectionHeading(sectionNum++, "Target Audience"));
    paragraphs.push(...multiLineParagraphs(data.targetAudience));
  }

  // 5. Scope
  paragraphs.push(numberedSectionHeading(sectionNum++, "Scope"));
  paragraphs.push(...multiLineParagraphs(data.scope));

  // 6. Key Deliverables
  paragraphs.push(numberedSectionHeading(sectionNum++, "Key Deliverables"));
  paragraphs.push(...buildBulletList(data.keyDeliverables));

  // 7. Timeline & Milestones
  paragraphs.push(numberedSectionHeading(sectionNum++, "Timeline & Milestones"));
  paragraphs.push(...multiLineParagraphs(data.timeline));

  // 8. Budget (optional)
  if (data.budget) {
    paragraphs.push(numberedSectionHeading(sectionNum++, "Budget"));
    paragraphs.push(...multiLineParagraphs(data.budget));
  }

  // 9. Success Criteria
  paragraphs.push(numberedSectionHeading(sectionNum++, "Success Criteria"));
  const successLines = data.successMetrics
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (successLines.length > 1) {
    paragraphs.push(...successLines.map((line) => bulletItem(line)));
  } else {
    paragraphs.push(bodyParagraph(data.successMetrics));
  }

  // 10. Risks & Constraints (optional)
  if (data.risksConstraints) {
    paragraphs.push(
      numberedSectionHeading(sectionNum++, "Risks & Constraints")
    );
    const riskLines = data.risksConstraints
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (riskLines.length > 1) {
      paragraphs.push(...riskLines.map((line) => bulletItem(line)));
    } else {
      paragraphs.push(bodyParagraph(data.risksConstraints));
    }
  }

  // ── Document footer ──
  paragraphs.push(spacer());
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 120 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD", space: 6 },
      },
      children: [
        new TextRun({
          text: "Document Status:  ",
          bold: true,
          size: SMALL_SIZE,
          font: FONT,
          color: COLOR_LIGHT,
        }),
        new TextRun({
          text: "Draft",
          size: SMALL_SIZE,
          font: FONT,
          color: COLOR_LIGHT,
        }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      spacing: SPACING_TIGHT,
      children: [
        new TextRun({
          text: `Prepared by ${data.projectOwner}  |  ${formattedDate}`,
          size: SMALL_SIZE,
          font: FONT,
          color: COLOR_LIGHT,
        }),
      ],
    })
  );

  return await buildLetterDocument(paragraphs);
}
