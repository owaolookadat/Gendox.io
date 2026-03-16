import { Document, Packer, Paragraph, TextRun } from "docx";

export interface CertificateOfCompletionData {
  recipientName: string;
  courseName: string;
  organizationName: string;
  completionDate: string;
  duration: string;
  description: string;
  skillsCovered: string;
  gradeScore: string;
  certificateNumber: string;
  issuedByName: string;
  issuedByTitle: string;
  dateOfIssue: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateCertificateOfCompletion(
  data: CertificateOfCompletionData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.organizationName, bold: true, size: 28 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: "CERTIFICATE OF COMPLETION",
          bold: true,
          size: 28,
          underline: {},
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "This is to certify that", size: 22 }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: data.recipientName, bold: true, size: 26 }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `has successfully completed the following course / programme:`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: data.courseName, bold: true, size: 24 }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: `Completion Date: ${formatDate(data.completionDate)}`, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Duration: ${data.duration}`, size: 22 }),
      ],
    }),
  ];

  if (data.description) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Description:", bold: true, size: 22 }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.description, size: 22 })],
      })
    );
  }

  if (data.skillsCovered) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Skills / Topics Covered:", bold: true, size: 22 }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.skillsCovered, size: 22 })],
      })
    );
  }

  if (data.gradeScore) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Grade / Score: ${data.gradeScore}`, bold: true, size: 22 }),
        ],
      })
    );
  }

  if (data.certificateNumber) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Certificate Number: ${data.certificateNumber}`, size: 22 }),
        ],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: `Date of Issue: ${formatDate(data.dateOfIssue)}`, size: 22 }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.issuedByName, bold: true, size: 22 })],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.issuedByTitle, size: 22 })],
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
