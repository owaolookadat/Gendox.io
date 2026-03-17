import { Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";
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
  todayFormatted,
  spacer,
  buildLetterDocument,
} from "./letter-utils";

export interface ScopeOfWorkData {
  projectTitle: string;
  clientName: string;
  clientCompany: string;
  providerName: string;
  providerCompany: string;
  projectDescription: string;
  objectives: string;
  deliverables: string;
  timeline: string;
  budgetPaymentTerms: string;
  assumptions: string;
  exclusions: string;
  acceptanceCriteria: string;
  includeSignatures: boolean;
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
        text: text.toUpperCase(),
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

function partyBlock(role: string, name: string, company: string): Paragraph[] {
  return [
    new Paragraph({
      spacing: SPACING_TIGHT,
      children: [
        new TextRun({
          text: `${role}:`,
          bold: true,
          size: SMALL_SIZE,
          font: FONT,
          color: COLOR_LIGHT,
          allCaps: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: SPACING_TIGHT,
      children: [
        new TextRun({
          text: name,
          bold: true,
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: company,
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
      ],
    }),
  ];
}

function signatureBlock(role: string, name: string, company: string): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [
        new TextRun({
          text: `${role}:`,
          bold: true,
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    }),
    spacer(),
    new Paragraph({
      spacing: SPACING_TIGHT,
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999", space: 2 },
      },
      children: [
        new TextRun({
          text: "                                                            ",
          size: BODY_SIZE,
          font: FONT,
        }),
      ],
    }),
    new Paragraph({
      spacing: SPACING_TIGHT,
      children: [
        new TextRun({
          text: "Signature",
          size: SMALL_SIZE,
          font: FONT,
          color: COLOR_LIGHT,
        }),
      ],
    }),
    spacer(),
    new Paragraph({
      spacing: SPACING_TIGHT,
      children: [
        new TextRun({
          text: "Name:  ",
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
        new TextRun({
          text: name,
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    }),
    new Paragraph({
      spacing: SPACING_TIGHT,
      children: [
        new TextRun({
          text: "Company:  ",
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
        new TextRun({
          text: company,
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 320 },
      children: [
        new TextRun({
          text: "Date:  ____________________________",
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
      ],
    }),
  ];
}

// ── Generator ──

export async function generateScopeOfWork(
  data: ScopeOfWorkData
): Promise<Blob> {
  const today = todayFormatted();
  const paragraphs: Paragraph[] = [];

  // ── Document header ──
  paragraphs.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "SCOPE OF WORK",
          size: META_LABEL_SIZE,
          font: FONT,
          color: COLOR_LIGHT,
          allCaps: true,
        }),
      ],
    })
  );

  // Project title prominently
  paragraphs.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: data.projectTitle,
          bold: true,
          size: TITLE_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    })
  );

  // Date
  paragraphs.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: `Date: ${today}`,
          size: SMALL_SIZE,
          font: FONT,
          color: COLOR_LIGHT,
        }),
      ],
    })
  );

  // Accent divider
  paragraphs.push(
    new Paragraph({
      spacing: { after: 280 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "2B579A", space: 6 },
      },
      children: [],
    })
  );

  // ── Parties ──
  paragraphs.push(
    new Paragraph({
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: "PARTIES",
          bold: true,
          size: HEADING_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    })
  );

  paragraphs.push(...partyBlock("Provider", data.providerName, data.providerCompany));
  paragraphs.push(...partyBlock("Client", data.clientName, data.clientCompany));

  // ── Numbered sections ──
  let sectionNum = 1;

  // 1. Project Description
  paragraphs.push(numberedSectionHeading(sectionNum++, "Project Description"));
  paragraphs.push(...multiLineParagraphs(data.projectDescription));

  // 2. Objectives
  paragraphs.push(numberedSectionHeading(sectionNum++, "Objectives"));
  paragraphs.push(...multiLineParagraphs(data.objectives));

  // 3. Deliverables
  paragraphs.push(numberedSectionHeading(sectionNum++, "Deliverables"));
  paragraphs.push(...buildBulletList(data.deliverables));

  // 4. Timeline & Milestones
  paragraphs.push(numberedSectionHeading(sectionNum++, "Timeline & Milestones"));
  paragraphs.push(...multiLineParagraphs(data.timeline));

  // 5. Budget & Payment Terms
  paragraphs.push(numberedSectionHeading(sectionNum++, "Budget & Payment Terms"));
  paragraphs.push(...multiLineParagraphs(data.budgetPaymentTerms));

  // 6. Assumptions & Dependencies (optional)
  if (data.assumptions) {
    paragraphs.push(
      numberedSectionHeading(sectionNum++, "Assumptions & Dependencies")
    );
    paragraphs.push(...multiLineParagraphs(data.assumptions));
  }

  // 7. Exclusions (optional)
  if (data.exclusions) {
    paragraphs.push(numberedSectionHeading(sectionNum++, "Exclusions"));
    paragraphs.push(...buildBulletList(data.exclusions));
  }

  // 8. Acceptance Criteria
  paragraphs.push(numberedSectionHeading(sectionNum++, "Acceptance Criteria"));
  paragraphs.push(...multiLineParagraphs(data.acceptanceCriteria));

  // 9. Change Management
  paragraphs.push(numberedSectionHeading(sectionNum++, "Change Management"));
  paragraphs.push(
    bodyParagraph(
      "Any changes to the scope, deliverables, timeline, or budget outlined in this document must be submitted in writing and agreed upon by both parties before implementation. Changes may impact the project timeline and budget, and any such impacts will be communicated and documented in a formal change order."
    )
  );

  // ── Signature blocks ──
  if (data.includeSignatures) {
    paragraphs.push(spacer());
    paragraphs.push(
      new Paragraph({
        spacing: { before: 360, after: 200 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: "CCCCCC",
            space: 4,
          },
        },
        children: [
          new TextRun({
            text: "AGREED AND ACCEPTED",
            bold: true,
            size: HEADING_SIZE,
            font: FONT,
            color: COLOR_DARK,
          }),
        ],
      })
    );

    paragraphs.push(
      bodyParagraph(
        "By signing below, both parties acknowledge and agree to the terms and conditions set forth in this Scope of Work."
      )
    );

    paragraphs.push(
      ...signatureBlock("Client", data.clientName, data.clientCompany)
    );
    paragraphs.push(
      ...signatureBlock("Provider", data.providerName, data.providerCompany)
    );
  }

  return await buildLetterDocument(paragraphs);
}
