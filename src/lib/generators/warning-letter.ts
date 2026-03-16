import { Document, Packer, Paragraph, TextRun } from "docx";

export interface WarningLetterData {
  companyName: string;
  managerName: string;
  managerTitle: string;
  employeeName: string;
  employeeTitle: string;
  warningLevel: string;
  dateOfIncident: string;
  descriptionOfIssue: string;
  previousWarnings: string;
  expectedImprovement: string;
  deadlineForImprovement: string;
  consequences: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateWarningLetter(
  data: WarningLetterData
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
      children: [new TextRun({ text: `CONFIDENTIAL`, bold: true, size: 22 })],
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
          text: `Re: ${data.warningLevel} Warning`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `This letter serves as a ${data.warningLevel.toLowerCase()} warning regarding your conduct and/or performance at ${data.companyName}.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Date of Incident: ${formatDate(data.dateOfIncident)}`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Description of Issue:`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: data.descriptionOfIssue,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
  ];

  if (data.previousWarnings) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Previous Warnings:`,
            bold: true,
            size: 22,
          }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.previousWarnings,
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
          text: `Expected Improvement:`,
          bold: true,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.expectedImprovement,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `You are expected to demonstrate the required improvement by ${formatDate(data.deadlineForImprovement)}.`,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Consequences if Not Improved:`,
          bold: true,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.consequences,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Please sign below to acknowledge receipt of this warning. Your signature does not indicate agreement with the contents, only that you have received this notice.",
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
      children: [
        new TextRun({ text: data.managerName, bold: true, size: 22 }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${data.managerTitle}, ${data.companyName}`,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Employee Acknowledgement: ________________________  Date: ____________",
          size: 22,
        }),
      ],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
