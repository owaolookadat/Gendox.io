import { Document, Packer, Paragraph, TextRun } from "docx";

export interface OfferLetterData {
  companyName: string;
  companyAddress: string;
  candidateName: string;
  jobTitle: string;
  department: string;
  startDate: string;
  salary: number;
  payFrequency: string;
  benefitsSummary: string;
  reportingTo: string;
  employmentType: string;
  responseDeadline: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatSalary(amount: number, frequency: string): string {
  const formatted = new Intl.NumberFormat("en-GB", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  switch (frequency) {
    case "Annual":
      return `${formatted} per annum`;
    case "Monthly":
      return `${formatted} per month`;
    case "Hourly":
      return `${formatted} per hour`;
    default:
      return formatted;
  }
}

export async function generateOfferLetter(
  data: OfferLetterData
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
      children: [
        new TextRun({ text: data.companyAddress, size: 22, color: "666666" }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: today, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: data.candidateName, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Dear ${data.candidateName},`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Re: Offer of Employment — ${data.jobTitle}`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `We are pleased to offer you the position of ${data.jobTitle} in the ${data.department} department at ${data.companyName}. This is a ${data.employmentType.toLowerCase()} position, reporting to ${data.reportingTo}.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Your anticipated start date is ${formatDate(data.startDate)}.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Your compensation will be ${formatSalary(data.salary, data.payFrequency)}, subject to applicable deductions.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
  ];

  if (data.benefitsSummary) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Benefits: ${data.benefitsSummary}`,
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
          text: `Please confirm your acceptance of this offer by ${formatDate(data.responseDeadline)}. If you have any questions, do not hesitate to contact us.`,
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
          text: "We look forward to welcoming you to the team.",
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
      children: [new TextRun({ text: data.companyName, bold: true, size: 22 })],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
