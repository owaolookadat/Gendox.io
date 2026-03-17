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
  todayFormatted,
  formatDate,
  spacer,
  buildLetterDocument,
} from "./letter-utils";

export interface JobDescriptionData {
  companyName: string;
  jobTitle: string;
  department: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  jobSummary: string;
  keyResponsibilities: string;
  requiredQualifications: string;
  preferredQualifications: string;
  benefits: string;
  applicationDeadline: string;
  howToApply: string;
}

// ── Helpers ──

const HEADING_SIZE = 26; // 13pt
const TITLE_SIZE = 36; // 18pt
const META_LABEL_SIZE = 20; // 10pt

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 360, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 },
    },
    children: [
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

export async function generateJobDescription(
  data: JobDescriptionData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [];

  // ── Company header ──
  paragraphs.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: data.companyName.toUpperCase(),
          bold: true,
          size: NAME_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    })
  );

  // Document type label
  paragraphs.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "JOB DESCRIPTION",
          size: META_LABEL_SIZE,
          font: FONT,
          color: COLOR_LIGHT,
          allCaps: true,
        }),
      ],
    })
  );

  // Divider
  paragraphs.push(
    new Paragraph({
      spacing: { after: 240 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "2B579A", space: 6 },
      },
      children: [],
    })
  );

  // ── Job title prominently ──
  paragraphs.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: data.jobTitle,
          bold: true,
          size: TITLE_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    })
  );

  // ── Metadata block ──
  paragraphs.push(metaRow("Department", data.department));
  paragraphs.push(metaRow("Location", data.location));
  paragraphs.push(metaRow("Employment Type", data.employmentType));

  if (data.salaryRange) {
    paragraphs.push(metaRow("Salary Range", data.salaryRange));
  }

  if (data.applicationDeadline) {
    paragraphs.push(
      metaRow("Application Deadline", formatDate(data.applicationDeadline))
    );
  }

  paragraphs.push(spacer());

  // ── About the Role ──
  paragraphs.push(sectionHeading("About the Role"));
  paragraphs.push(bodyParagraph(data.jobSummary));

  // ── Key Responsibilities ──
  paragraphs.push(sectionHeading("Key Responsibilities"));
  paragraphs.push(...buildBulletList(data.keyResponsibilities));

  // ── Required Qualifications ──
  paragraphs.push(sectionHeading("Required Qualifications"));
  paragraphs.push(...buildBulletList(data.requiredQualifications));

  // ── Preferred Qualifications ──
  if (data.preferredQualifications) {
    paragraphs.push(sectionHeading("Nice-to-Have Qualifications"));
    paragraphs.push(...buildBulletList(data.preferredQualifications));
  }

  // ── Benefits ──
  if (data.benefits) {
    paragraphs.push(sectionHeading("What We Offer"));
    const benefitLines = data.benefits
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (benefitLines.length > 1) {
      paragraphs.push(...benefitLines.map((line) => bulletItem(line)));
    } else {
      paragraphs.push(bodyParagraph(data.benefits));
    }
  }

  // ── How to Apply ──
  paragraphs.push(sectionHeading("How to Apply"));
  paragraphs.push(bodyParagraph(data.howToApply));

  // ── Equal Opportunity Statement ──
  paragraphs.push(spacer());
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 0 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD", space: 6 },
      },
      children: [
        new TextRun({
          text: `${data.companyName} is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees. All qualified applicants will receive consideration for employment without regard to race, colour, religion, gender, sexual orientation, national origin, disability, or veteran status.`,
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
