import { Document, Packer, Paragraph, TextRun } from "docx";

export interface TerminationLetterData {
  companyName: string;
  employeeName: string;
  employeeTitle: string;
  terminationDate: string;
  reason: string;
  details: string;
  finalPayDate: string;
  benefitsEndDate: string;
  returnOfProperty: string;
  severanceDetails: string;
  hrContactName: string;
  hrContactEmail: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateTerminationLetter(
  data: TerminationLetterData
): Promise<Blob> {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.companyName, bold: true, size: 28 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: today, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: data.employeeName, size: 22 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.employeeTitle, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Dear ${data.employeeName},`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Re: Termination of Employment`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `This letter serves as formal notification that your employment with ${data.companyName} as ${data.employeeTitle} will be terminated effective ${formatDate(data.terminationDate)}.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Reason for Termination: ${data.reason}`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: data.details,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Your final pay will be processed on ${formatDate(data.finalPayDate)}. Company benefits will remain in effect until ${formatDate(data.benefitsEndDate)}.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
  ];

  if (data.returnOfProperty) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Return of Company Property: ${data.returnOfProperty}`,
            size: 22,
          }),
        ],
      })
    );
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  if (data.severanceDetails) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Severance: ${data.severanceDetails}`,
            size: 22,
          }),
        ],
      })
    );
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `If you have any questions regarding this matter, please contact ${data.hrContactName} at ${data.hrContactEmail}.`,
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
      children: [new TextRun({ text: data.hrContactName, bold: true, size: 22 })],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Human Resources, ${data.companyName}`,
          size: 22,
        }),
      ],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
