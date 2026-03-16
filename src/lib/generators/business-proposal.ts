import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export interface BusinessProposalData {
  yourName: string;
  yourTitle: string;
  yourCompany: string;
  clientName: string;
  clientCompany: string;
  projectTitle: string;
  executiveSummary: string;
  problemStatement: string;
  proposedSolution: string;
  deliverables: string;
  timeline: string;
  budgetPricing: string;
  termsAndConditions: string;
}

function multiLineParagraphs(
  text: string,
  size: number = 20,
  color: string = "333333"
): Paragraph[] {
  return text.split("\n").map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line.trim(), size, color })],
        spacing: { after: 80 },
      })
  );
}

export async function generateBusinessProposal(
  data: BusinessProposalData
): Promise<Blob> {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const sectionHeading = (text: string) =>
    new Paragraph({
      children: [
        new TextRun({ text, bold: true, size: 26, color: "1a1a1a" }),
      ],
      spacing: { before: 400, after: 200 },
    });

  const doc = new Document({
    sections: [
      {
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: "BUSINESS PROPOSAL",
                bold: true,
                size: 36,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Project Title
          new Paragraph({
            children: [
              new TextRun({
                text: data.projectTitle,
                bold: true,
                size: 28,
                color: "333333",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Prepared by
          new Paragraph({
            children: [
              new TextRun({ text: "Prepared by:", size: 20, color: "555555" }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: data.yourName, bold: true, size: 22 }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${data.yourTitle}, ${data.yourCompany}`,
                size: 20,
                color: "555555",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Prepared for
          new Paragraph({
            children: [
              new TextRun({ text: "Prepared for:", size: 20, color: "555555" }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: data.clientName, bold: true, size: 22 }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.clientCompany,
                size: 20,
                color: "555555",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Date
          new Paragraph({
            children: [
              new TextRun({ text: `Date: ${today}`, size: 20, color: "555555" }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),

          // Executive Summary
          sectionHeading("Executive Summary"),
          ...multiLineParagraphs(data.executiveSummary),

          // Problem Statement
          sectionHeading("Problem Statement"),
          ...multiLineParagraphs(data.problemStatement),

          // Proposed Solution
          sectionHeading("Proposed Solution"),
          ...multiLineParagraphs(data.proposedSolution),

          // Deliverables
          sectionHeading("Deliverables"),
          ...multiLineParagraphs(data.deliverables),

          // Timeline
          sectionHeading("Timeline"),
          ...multiLineParagraphs(data.timeline),

          // Budget / Pricing
          sectionHeading("Budget / Pricing"),
          ...multiLineParagraphs(data.budgetPricing),

          // Terms & Conditions
          ...(data.termsAndConditions
            ? [
                sectionHeading("Terms & Conditions"),
                ...multiLineParagraphs(data.termsAndConditions),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
