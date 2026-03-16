import { Document, Packer, Paragraph, TextRun } from "docx";

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

function buildBulletList(text: string, size: number): Paragraph[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: `  •  ${line}`, size })],
        })
    );
}

export async function generateScopeOfWork(data: ScopeOfWorkData): Promise<Blob> {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const paragraphs: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: "SCOPE OF WORK", bold: true, size: 32 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({ children: [new TextRun({ text: `Project: ${data.projectTitle}`, bold: true, size: 26 })] }),
    new Paragraph({ children: [new TextRun({ text: `Date: ${today}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // Parties
    new Paragraph({ children: [new TextRun({ text: "Parties", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: `Client: ${data.clientName}, ${data.clientCompany}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: `Provider: ${data.providerName}, ${data.providerCompany}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // Project Description
    new Paragraph({ children: [new TextRun({ text: "1. Project Description", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: data.projectDescription, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // Objectives
    new Paragraph({ children: [new TextRun({ text: "2. Objectives", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: data.objectives, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // Deliverables
    new Paragraph({ children: [new TextRun({ text: "3. Deliverables", bold: true, size: 24 })] }),
    ...buildBulletList(data.deliverables, 22),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // Timeline
    new Paragraph({ children: [new TextRun({ text: "4. Timeline & Milestones", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: data.timeline, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // Budget
    new Paragraph({ children: [new TextRun({ text: "5. Budget & Payment Terms", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: data.budgetPaymentTerms, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
  ];

  let sectionNum = 6;

  if (data.assumptions) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${sectionNum}. Assumptions`, bold: true, size: 24 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.assumptions, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    sectionNum++;
  }

  if (data.exclusions) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${sectionNum}. Exclusions`, bold: true, size: 24 })] }));
    paragraphs.push(...buildBulletList(data.exclusions, 22));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    sectionNum++;
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${sectionNum}. Acceptance Criteria`, bold: true, size: 24 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.acceptanceCriteria, size: 22 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  if (data.includeSignatures) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "AGREED AND ACCEPTED", bold: true, size: 24 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

    // Client signature
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Client:", bold: true, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Signature: ___________________________", size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `Name: ${data.clientName}`, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `Company: ${data.clientCompany}`, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Date: ___________________________", size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

    // Provider signature
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Provider:", bold: true, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Signature: ___________________________", size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `Name: ${data.providerName}`, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `Company: ${data.providerCompany}`, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Date: ___________________________", size: 22 })] }));
  }

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
