import { Document, Packer, Paragraph, TextRun } from "docx";

export interface JoiningLetterData {
  companyName: string;
  companyAddress: string;
  employeeName: string;
  jobTitle: string;
  department: string;
  dateOfJoining: string;
  reportingTo: string;
  salary: string;
  workingHours: string;
  probationPeriod: string;
  documentsRequired: string;
  dressCode: string;
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

export async function generateJoiningLetter(
  data: JoiningLetterData
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
    new Paragraph({
      children: [new TextRun({ text: data.companyAddress, size: 22, color: "666666" })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: `Date: ${today}`, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: data.employeeName, size: 22 })],
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
          text: `Re: Joining Letter — ${data.jobTitle}`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `We are pleased to confirm your appointment as ${data.jobTitle} in the ${data.department} department at ${data.companyName}. Your date of joining is ${formatDate(data.dateOfJoining)}.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `You will be reporting to ${data.reportingTo}.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Your compensation package is ${data.salary}.`,
          size: 22,
        }),
      ],
    }),
  ];

  if (data.workingHours) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Working Hours: ${data.workingHours}`,
            size: 22,
          }),
        ],
      })
    );
  }

  if (data.probationPeriod !== "None") {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `You will be on a probationary period of ${data.probationPeriod}. Your performance will be reviewed at the end of this period.`,
            size: 22,
          }),
        ],
      })
    );
  }

  if (data.documentsRequired) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Please bring the following documents on your first day:", bold: true, size: 22 }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.documentsRequired, size: 22 })],
      })
    );
  }

  if (data.dressCode) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Dress Code: ${data.dressCode}`, size: 22 }),
        ],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `For any queries, please contact ${data.hrContactName} at ${data.hrContactEmail}.`,
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
          text: "We look forward to having you on board and wish you a successful career with us.",
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
      children: [new TextRun({ text: "Human Resources", size: 22 })],
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
