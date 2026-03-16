import { Document, Packer, Paragraph, TextRun } from "docx";

export interface ThankYouLetterData {
  yourName: string;
  recipientName: string;
  recipientTitle: string;
  companyOrganization: string;
  purpose: string;
  specificDetails: string;
  additionalMessage: string;
}

function getPurposeOpening(purpose: string, recipientName: string): string {
  switch (purpose) {
    case "Job Interview":
      return `Thank you for taking the time to meet with me for the interview. I truly appreciated the opportunity to learn more about the role and your team.`;
    case "Business Meeting":
      return `Thank you for taking the time to meet with me. I found our discussion both productive and insightful.`;
    case "Gift":
      return `I wanted to take a moment to express my sincere gratitude for your generous gift. Your thoughtfulness means a great deal to me.`;
    case "Hospitality":
      return `I wanted to express my heartfelt thanks for your wonderful hospitality. Your generosity and warmth made the experience truly memorable.`;
    case "Mentorship":
      return `I wanted to take a moment to express my deep appreciation for your mentorship and guidance. Your support has been invaluable to my growth.`;
    case "General":
    default:
      return `I am writing to express my sincere gratitude. Your kindness and generosity have not gone unnoticed.`;
  }
}

export async function generateThankYouLetter(
  data: ThankYouLetterData
): Promise<Blob> {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const opening = getPurposeOpening(data.purpose, data.recipientName);

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.yourName, bold: true, size: 28 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: today, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
  ];

  // Recipient block
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.recipientName, size: 22 })],
    })
  );
  if (data.recipientTitle) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.recipientTitle, size: 22 })],
      })
    );
  }
  if (data.companyOrganization) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.companyOrganization, size: 22 })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Dear ${data.recipientName},`,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: opening, size: 22 })],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  if (data.specificDetails) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.specificDetails, size: 22 })],
      })
    );
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  if (data.additionalMessage) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.additionalMessage, size: 22 })],
      })
    );
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Thank you once again for your kindness and generosity.",
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: "With sincere appreciation,", size: 22 })],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.yourName, bold: true, size: 22 })],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
