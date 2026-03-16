import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export interface PressReleaseData {
  companyName: string;
  companyAddress: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  releaseDate: string;
  headline: string;
  subheadline: string;
  cityLocation: string;
  bodyParagraph1: string;
  bodyParagraph2: string;
  bodyParagraph3: string;
  boilerplate: string;
}

export async function generatePressRelease(data: PressReleaseData): Promise<Blob> {
  const formattedDate = data.releaseDate
    ? new Date(data.releaseDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "FOR IMMEDIATE RELEASE", bold: true, size: 28 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: `Contact: ${data.contactName}`, size: 22 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: `Email: ${data.contactEmail}`, size: 22 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: `Phone: ${data.contactPhone}`, size: 22 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: `Date: ${formattedDate}`, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: data.headline, bold: true, size: 32 })],
    }),
  ];

  if (data.subheadline) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: data.subheadline, italics: true, size: 24, color: "666666" })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Lead paragraph with city/location dateline
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: `${data.cityLocation}, ${formattedDate}`, bold: true, size: 22 }),
        new TextRun({ text: ` — ${data.bodyParagraph1}`, size: 22 }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  paragraphs.push(
    new Paragraph({ children: [new TextRun({ text: data.bodyParagraph2, size: 22 })] })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  if (data.bodyParagraph3) {
    paragraphs.push(
      new Paragraph({ children: [new TextRun({ text: data.bodyParagraph3, size: 22 })] })
    );
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  // Boilerplate
  paragraphs.push(
    new Paragraph({ children: [new TextRun({ text: `About ${data.companyName}`, bold: true, size: 22 })] })
  );
  paragraphs.push(
    new Paragraph({ children: [new TextRun({ text: data.boilerplate, size: 22 })] })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Company address
  const addressLines = data.companyAddress.split("\n").filter(Boolean);
  for (const line of addressLines) {
    paragraphs.push(
      new Paragraph({ children: [new TextRun({ text: line, size: 22, color: "666666" })] })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Standard press release ending
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "###", bold: true, size: 28 })],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
