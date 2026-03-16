import { Document, Packer, Paragraph, TextRun } from "docx";

export interface AwardCertificateData {
  recipientName: string;
  awardTitle: string;
  organizationName: string;
  date: string;
  category: string;
  description: string;
  presentedByName: string;
  presentedByTitle: string;
  certificateNumber: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateAwardCertificate(
  data: AwardCertificateData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.organizationName, bold: true, size: 28 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: "CERTIFICATE OF AWARD",
          bold: true,
          size: 28,
          underline: {},
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "This certificate is proudly presented to", size: 22 }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: data.recipientName, bold: true, size: 28 }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "in recognition of", size: 22 }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: data.awardTitle, bold: true, size: 26 }),
      ],
    }),
  ];

  if (data.category !== "Custom") {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Category: ${data.category}`, size: 22, color: "666666" }),
        ],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.description, size: 22 })],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: `Date: ${formatDate(data.date)}`, size: 22 }),
      ],
    })
  );

  if (data.certificateNumber) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Certificate No: ${data.certificateNumber}`, size: 22 }),
        ],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.presentedByName, bold: true, size: 22 })],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.presentedByTitle, size: 22 })],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.organizationName, size: 22 })],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
