import { Document, Packer, Paragraph, TextRun } from "docx";

export interface ExperienceCertificateData {
  companyName: string;
  companyAddress: string;
  employeeName: string;
  employeeDesignation: string;
  department: string;
  dateOfJoining: string;
  dateOfLeaving: string;
  duties: string;
  performanceSummary: string;
  issuerName: string;
  issuerDesignation: string;
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

export async function generateExperienceCertificate(
  data: ExperienceCertificateData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.companyName, bold: true, size: 28 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.companyAddress, size: 22, color: "666666" })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: `Date: ${formatDate(data.dateOfIssue)}`, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: "EXPERIENCE CERTIFICATE",
          bold: true,
          size: 26,
          underline: {},
        }),
      ],
      alignment: "center" as unknown as undefined,
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: "To Whom It May Concern,", size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `This is to certify that ${data.employeeName} was employed with ${data.companyName} as a ${data.employeeDesignation} in the ${data.department} department from ${formatDate(data.dateOfJoining)} to ${formatDate(data.dateOfLeaving)}.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `During their tenure, ${data.employeeName} was responsible for the following duties and responsibilities:`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: data.duties, size: 22 })],
    }),
  ];

  if (data.performanceSummary) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Performance Summary: ${data.performanceSummary}`,
            size: 22,
          }),
        ],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `We wish ${data.employeeName} all the best in their future endeavours.`,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: "Yours sincerely,", size: 22 })],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.issuerName, bold: true, size: 22 })],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.issuerDesignation, size: 22 })],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.companyName, size: 22 })],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
