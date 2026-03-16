import { Document, Packer, Paragraph, TextRun } from "docx";

export interface ReferenceLetterData {
  referrerName: string;
  referrerTitle: string;
  referrerCompany: string;
  referrerEmail: string;
  candidateName: string;
  candidateRole: string;
  relationshipDuration: string;
  skills: string;
  achievements: string;
  personalQualities: string;
  recommendation: string;
}

export async function generateReferenceLetter(data: ReferenceLetterData): Promise<Blob> {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const paragraphs: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: data.referrerName, bold: true, size: 28 })] }),
    new Paragraph({ children: [new TextRun({ text: `${data.referrerTitle}, ${data.referrerCompany}`, size: 22, color: "666666" })] }),
    new Paragraph({ children: [new TextRun({ text: data.referrerEmail, size: 22, color: "666666" })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({ children: [new TextRun({ text: today, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({ children: [new TextRun({ text: "To Whom It May Concern,", size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: `I am writing to recommend ${data.candidateName}, who worked as ${data.candidateRole} at ${data.referrerCompany} for ${data.relationshipDuration}. During this time, I had the pleasure of working closely with ${data.candidateName} and can speak confidently to their professional abilities.`, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
  ];

  if (data.skills) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.skills, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  if (data.achievements) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.achievements, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  if (data.personalQualities) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.personalQualities, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  const rec = data.recommendation || `I wholeheartedly recommend ${data.candidateName} for any position they may pursue. Please do not hesitate to contact me if you require any further information.`;
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: rec, size: 22 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Yours sincerely,", size: 22 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.referrerName, bold: true, size: 22 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${data.referrerTitle}, ${data.referrerCompany}`, size: 22 })] }));

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
