import { Document, Packer, Paragraph, TextRun } from "docx";

export interface ApologyLetterData {
  yourName: string;
  recipientName: string;
  context: string;
  dateOfIncident: string;
  whatHappened: string;
  acknowledgement: string;
  stepsToPrevent: string;
  closingMessage: string;
}

function formatDate(dateStr?: string): string {
  const date = dateStr ? new Date(dateStr) : new Date();
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateApologyLetter(
  data: ApologyLetterData
): Promise<Blob> {
  const todayFormatted = formatDate();

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.yourName, bold: true, size: 24 })],
    }),
    new Paragraph({ children: [] }),
    new Paragraph({
      children: [new TextRun({ text: todayFormatted, size: 24 })],
    }),
    new Paragraph({ children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: `Dear ${data.recipientName},`, size: 24 }),
      ],
    }),
    new Paragraph({ children: [] }),
  ];

  // Opening
  const incidentRef = data.dateOfIncident
    ? ` on ${formatDate(data.dateOfIncident)}`
    : "";
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `I am writing to sincerely apologise for the incident that occurred${incidentRef}. I understand the impact of my actions and take full responsibility.`,
          size: 24,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // What happened
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "What Happened", bold: true, size: 24 }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.whatHappened.trim(), size: 24 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Acknowledgement
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "My Acknowledgement", bold: true, size: 24 }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.acknowledgement.trim(), size: 24 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Steps to prevent recurrence
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Steps to Prevent Recurrence",
          bold: true,
          size: 24,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.stepsToPrevent.trim(), size: 24 })],
    })
  );

  // Closing message
  if (data.closingMessage.trim()) {
    paragraphs.push(new Paragraph({ children: [] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: data.closingMessage.trim(), size: 24 }),
        ],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "I hope we can move forward from this, and I am committed to making things right.",
          size: 24,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: "Yours sincerely,", size: 24 })],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.yourName, size: 24 })],
    })
  );

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
