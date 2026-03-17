import { Paragraph, TextRun } from "docx";
import {
  FONT,
  BODY_SIZE,
  NAME_SIZE,
  SPACING,
  SPACING_TIGHT,
  SPACING_NONE,
  COLOR_DARK,
  COLOR_GRAY,
  formatDate,
  todayFormatted,
  bodyText,
  boldBodyText,
  spacer,
  buildLetterDocument,
  richBodyText,
  senderName,
  signatureName,
  signatureTitle,
} from "./letter-utils";

export interface PerformanceReviewData {
  employeeName: string;
  employeeTitle: string;
  department: string;
  reviewerName: string;
  reviewPeriodStart: string;
  reviewPeriodEnd: string;
  overallRating: string;
  keyAchievements: string;
  areasForImprovement: string;
  goalsForNextPeriod: string;
  skillsAssessment: string;
  trainingNeeds: string;
  managerComments: string;
  employeeComments: string;
}

// ── Section heading helper ──

function sectionHeading(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_DARK,
        underline: {},
      }),
    ],
  });
}

// ── Detail row helper ──

function detailRow(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: SPACING_TIGHT,
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_DARK,
      }),
      new TextRun({
        text: value,
        size: BODY_SIZE,
        font: FONT,
      }),
    ],
  });
}

// ── Multi-line content (splits on newline into bullet-style paragraphs) ──

function contentParagraphs(text: string): Paragraph[] {
  if (!text) return [];
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length === 1) {
    return [bodyText(lines[0])];
  }
  return lines.map(
    (line) =>
      new Paragraph({
        spacing: SPACING_TIGHT,
        indent: { left: 360 },
        children: [
          new TextRun({
            text: `\u2022  ${line.trim()}`,
            size: BODY_SIZE,
            font: FONT,
          }),
        ],
      })
  );
}

// ── Rating-driven summary paragraph ──

function ratingSummaryParagraph(data: PerformanceReviewData): string {
  const name = data.employeeName;
  const period = `${formatDate(data.reviewPeriodStart)} to ${formatDate(data.reviewPeriodEnd)}`;

  switch (data.overallRating) {
    case "Exceeds Expectations":
      return (
        `It is with great pleasure that we present this performance review for ` +
        `${name}. During the review period of ${period}, ${name} has ` +
        `consistently exceeded expectations, demonstrating outstanding ` +
        `performance, exceptional initiative, and a level of dedication that ` +
        `sets a benchmark for the team. The contributions made have had a ` +
        `significant and measurable impact on the department's success.`
      );

    case "Meets Expectations":
      return (
        `This performance review covers the period of ${period} for ${name}. ` +
        `During this period, ${name} has met all role expectations and ` +
        `delivered solid, reliable performance. Responsibilities have been ` +
        `fulfilled competently and consistently, with a positive attitude ` +
        `and strong work ethic contributing to the team's overall success.`
      );

    case "Below Expectations":
      return (
        `This performance review covers the period of ${period} for ${name}. ` +
        `While we recognise ${name}'s effort, there are areas where performance ` +
        `has fallen below the expected standard for the role. This review is ` +
        `intended to provide constructive guidance, identify specific areas ` +
        `for development, and establish a clear path for improvement with ` +
        `appropriate support from the management team.`
      );

    default:
      return (
        `This performance review covers the period of ${period} for ${name}. ` +
        `The review provides a comprehensive assessment of performance, ` +
        `contributions, and areas for continued professional development ` +
        `during this evaluation period.`
      );
  }
}

// ── Rating-driven achievements preamble ──

function achievementsPreamble(rating: string): string {
  switch (rating) {
    case "Exceeds Expectations":
      return (
        "The following achievements are particularly noteworthy and reflect " +
        "an exceptional level of performance and commitment:"
      );
    case "Meets Expectations":
      return "Key accomplishments during the review period include:";
    case "Below Expectations":
      return "Contributions noted during the review period include:";
    default:
      return "Key achievements during the review period:";
  }
}

// ── Rating-driven improvement preamble ──

function improvementPreamble(rating: string): string {
  switch (rating) {
    case "Exceeds Expectations":
      return (
        "While performance has been outstanding, the following areas have been " +
        "identified as opportunities for further growth and development:"
      );
    case "Meets Expectations":
      return (
        "The following areas have been identified where focused development " +
        "could further enhance performance and contribution:"
      );
    case "Below Expectations":
      return (
        "The following areas require immediate attention and improvement. " +
        "A focused development plan will be established with clear milestones " +
        "and regular check-ins:"
      );
    default:
      return "Areas identified for improvement:";
  }
}

// ── Rating-driven closing paragraph ──

function closingParagraph(data: PerformanceReviewData): string {
  const name = data.employeeName;

  switch (data.overallRating) {
    case "Exceeds Expectations":
      return (
        `We commend ${name} for the exceptional performance demonstrated during ` +
        `this review period. The dedication and excellence shown are truly ` +
        `valued, and we look forward to continued success and potential ` +
        `advancement within the organisation.`
      );
    case "Meets Expectations":
      return (
        `We appreciate ${name}'s consistent contributions and positive approach ` +
        `during this period. We are confident in the potential for continued ` +
        `growth and look forward to seeing further professional development ` +
        `in the coming review period.`
      );
    case "Below Expectations":
      return (
        `We are committed to supporting ${name}'s development and providing ` +
        `the resources needed to achieve the expected performance standards. ` +
        `Regular progress meetings will be scheduled to track improvement, ` +
        `and additional support will be made available as needed.`
      );
    default:
      return (
        `We thank ${name} for the contributions made during this review period ` +
        `and look forward to continued progress in the next cycle.`
      );
  }
}

export async function generatePerformanceReview(
  data: PerformanceReviewData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [];
  const today = todayFormatted();

  // ── Title ──
  paragraphs.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: "PERFORMANCE REVIEW",
          bold: true,
          size: NAME_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "Confidential",
          italics: true,
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
      ],
    })
  );

  // ── Employee details block ──
  paragraphs.push(detailRow("Employee", data.employeeName));
  paragraphs.push(detailRow("Title", data.employeeTitle));
  paragraphs.push(detailRow("Department", data.department));
  paragraphs.push(detailRow("Reviewer", data.reviewerName));
  paragraphs.push(
    detailRow(
      "Review Period",
      `${formatDate(data.reviewPeriodStart)} to ${formatDate(data.reviewPeriodEnd)}`
    )
  );
  paragraphs.push(detailRow("Review Date", today));

  // ── Overall Rating (prominent) ──
  paragraphs.push(spacer());
  paragraphs.push(
    new Paragraph({
      spacing: SPACING,
      children: [
        new TextRun({
          text: "Overall Rating:  ",
          bold: true,
          size: NAME_SIZE,
          font: FONT,
          color: COLOR_DARK,
        }),
        new TextRun({
          text: data.overallRating,
          bold: true,
          size: NAME_SIZE,
          font: FONT,
          color: COLOR_DARK,
          underline: {},
        }),
      ],
    })
  );

  // ── Summary (rating-driven) ──
  paragraphs.push(sectionHeading("Summary"));
  paragraphs.push(bodyText(ratingSummaryParagraph(data)));

  // ── Key Achievements ──
  if (data.keyAchievements) {
    paragraphs.push(sectionHeading("Key Achievements"));
    paragraphs.push(bodyText(achievementsPreamble(data.overallRating)));
    paragraphs.push(...contentParagraphs(data.keyAchievements));
  }

  // ── Areas for Improvement ──
  if (data.areasForImprovement) {
    paragraphs.push(sectionHeading("Areas for Improvement"));
    paragraphs.push(bodyText(improvementPreamble(data.overallRating)));
    paragraphs.push(...contentParagraphs(data.areasForImprovement));
  }

  // ── Goals for Next Period ──
  if (data.goalsForNextPeriod) {
    paragraphs.push(sectionHeading("Goals for Next Period"));
    paragraphs.push(
      bodyText(
        "The following goals have been established for the upcoming review period " +
        "to support continued professional development and team objectives:"
      )
    );
    paragraphs.push(...contentParagraphs(data.goalsForNextPeriod));
  }

  // ── Skills Assessment ──
  if (data.skillsAssessment) {
    paragraphs.push(sectionHeading("Skills Assessment"));
    paragraphs.push(...contentParagraphs(data.skillsAssessment));
  }

  // ── Training Needs ──
  if (data.trainingNeeds) {
    paragraphs.push(sectionHeading("Training & Development Needs"));
    paragraphs.push(
      bodyText(
        "The following training and development activities are recommended " +
        "to support skill enhancement and career progression:"
      )
    );
    paragraphs.push(...contentParagraphs(data.trainingNeeds));
  }

  // ── Manager Comments ──
  if (data.managerComments) {
    paragraphs.push(sectionHeading("Manager Comments"));
    paragraphs.push(bodyText(data.managerComments));
  }

  // ── Employee Comments ──
  if (data.employeeComments) {
    paragraphs.push(sectionHeading("Employee Comments"));
    paragraphs.push(bodyText(data.employeeComments));
  }

  // ── Closing (rating-driven) ──
  paragraphs.push(spacer());
  paragraphs.push(bodyText(closingParagraph(data)));

  // ── Signature blocks ──
  paragraphs.push(spacer());
  paragraphs.push(spacer());

  // Manager signature
  paragraphs.push(
    new Paragraph({
      spacing: SPACING_TIGHT,
      children: [
        new TextRun({
          text: "________________________",
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
      ],
    })
  );
  paragraphs.push(signatureName(data.reviewerName));
  paragraphs.push(
    new Paragraph({
      spacing: SPACING_TIGHT,
      children: [
        new TextRun({
          text: "Manager / Reviewer",
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
      ],
    })
  );
  paragraphs.push(detailRow("Date", today));

  paragraphs.push(spacer());

  // Employee acknowledgement
  paragraphs.push(
    new Paragraph({
      spacing: SPACING_TIGHT,
      children: [
        new TextRun({
          text: "________________________",
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
      ],
    })
  );
  paragraphs.push(signatureName(data.employeeName));
  paragraphs.push(
    new Paragraph({
      spacing: SPACING_TIGHT,
      children: [
        new TextRun({
          text: "Employee",
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
      ],
    })
  );
  paragraphs.push(detailRow("Date", today));

  return buildLetterDocument(paragraphs);
}
