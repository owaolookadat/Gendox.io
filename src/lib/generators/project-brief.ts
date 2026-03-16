import { Document, Packer, Paragraph, TextRun } from "docx";

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

export async function generateProjectBrief(data: ProjectBriefData): Promise<Blob> {
  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const paragraphs: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: "PROJECT BRIEF", bold: true, size: 32 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({ children: [new TextRun({ text: data.projectName, bold: true, size: 28 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({ children: [new TextRun({ text: `Project Owner: ${data.projectOwner}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: `Date: ${formattedDate}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // Background
    new Paragraph({ children: [new TextRun({ text: "1. Background / Context", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: data.backgroundContext, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // Problem Statement
    new Paragraph({ children: [new TextRun({ text: "2. Problem Statement", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: data.problemStatement, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // Objectives
    new Paragraph({ children: [new TextRun({ text: "3. Project Objectives", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: data.projectObjectives, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
  ];

  let sectionNum = 4;

  if (data.targetAudience) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${sectionNum}. Target Audience`, bold: true, size: 24 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.targetAudience, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    sectionNum++;
  }

  // Scope
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${sectionNum}. Scope`, bold: true, size: 24 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.scope, size: 22 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  sectionNum++;

  // Key Deliverables
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${sectionNum}. Key Deliverables`, bold: true, size: 24 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.keyDeliverables, size: 22 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  sectionNum++;

  // Timeline
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${sectionNum}. Timeline`, bold: true, size: 24 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.timeline, size: 22 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  sectionNum++;

  if (data.budget) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${sectionNum}. Budget`, bold: true, size: 24 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.budget, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    sectionNum++;
  }

  // Success Metrics
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${sectionNum}. Success Metrics`, bold: true, size: 24 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.successMetrics, size: 22 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  sectionNum++;

  if (data.stakeholders) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${sectionNum}. Stakeholders`, bold: true, size: 24 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.stakeholders, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    sectionNum++;
  }

  if (data.risksConstraints) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${sectionNum}. Risks & Constraints`, bold: true, size: 24 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.risksConstraints, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
