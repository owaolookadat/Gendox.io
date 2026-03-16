import { Document, Packer, Paragraph, TextRun } from "docx";

export interface BusinessLetterData {
  yourName: string;
  yourTitle: string;
  yourCompany: string;
  yourAddress: string;
  recipientName: string;
  recipientTitle: string;
  recipientCompany: string;
  recipientAddress: string;
  date: string;
  subject: string;
  salutation: string;
  body: string;
  closing: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateBusinessLetter(
  data: BusinessLetterData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [];

  // Sender name
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.yourName, bold: true, size: 28 })],
    })
  );

  // Sender title and company
  if (data.yourTitle) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.yourTitle, size: 22, color: "666666" })],
      })
    );
  }
  if (data.yourCompany) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.yourCompany, size: 22, color: "666666" })],
      })
    );
  }

  // Sender address
  const senderLines = data.yourAddress.split("\n").filter((l) => l.trim());
  for (const line of senderLines) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: line.trim(), size: 22, color: "666666" })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Date
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: formatDate(data.date), size: 22 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Recipient
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
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.recipientCompany, size: 22 })],
    })
  );
  const recipientLines = data.recipientAddress.split("\n").filter((l) => l.trim());
  for (const line of recipientLines) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: line.trim(), size: 22 })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Salutation
  const salutationText =
    data.salutation === "To Whom It May Concern"
      ? "To Whom It May Concern,"
      : `${data.salutation} ${data.recipientName},`;
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: salutationText, size: 22 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Subject line
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: `Re: ${data.subject}`, bold: true, size: 22 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Body paragraphs
  const bodyParagraphs = data.body.split("\n").filter((l) => l.trim());
  for (const para of bodyParagraphs) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: para.trim(), size: 22 })],
      })
    );
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  // Closing
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: `${data.closing},`, size: 22 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Sender name (signature)
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.yourName, bold: true, size: 22 })],
    })
  );
  if (data.yourTitle) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.yourTitle, size: 22 })],
      })
    );
  }
  if (data.yourCompany) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.yourCompany, size: 22 })],
      })
    );
  }

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
