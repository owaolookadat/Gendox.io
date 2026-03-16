import { Document, Packer, Paragraph, TextRun } from "docx";

export interface PermissionLetterData {
  yourName: string;
  yourTitle: string;
  organization: string;
  recipientName: string;
  recipientTitle: string;
  permissionType: string;
  details: string;
  dates: string;
  justification: string;
  conditions: string;
}

function formatDate(): string {
  const date = new Date();
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generatePermissionLetter(
  data: PermissionLetterData
): Promise<Blob> {
  const todayFormatted = formatDate();

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.yourName, bold: true, size: 24 })],
    }),
  ];

  if (data.yourTitle.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.yourTitle, size: 24 })],
      })
    );
  }

  if (data.organization.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.organization, size: 24 })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: todayFormatted, size: 24 })],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));

  // Recipient
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.recipientName, size: 24 })],
    })
  );

  if (data.recipientTitle.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.recipientTitle, size: 24 })],
      })
    );
  }

  if (data.organization.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.organization, size: 24 })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [] }));

  // Subject
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Re: ", bold: true, size: 24 }),
        new TextRun({
          text: `Request for Permission — ${data.permissionType}`,
          bold: true,
          size: 24,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Salutation
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: `Dear ${data.recipientName},`, size: 24 }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Opening
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `I am writing to formally request permission for ${data.permissionType.toLowerCase()}. I would like to provide the following details for your consideration.`,
          size: 24,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Details
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Details of Request", bold: true, size: 24 }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.details.trim(), size: 24 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Dates
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Dates: ", bold: true, size: 24 }),
        new TextRun({ text: data.dates.trim(), size: 24 }),
      ],
    })
  );

  // Justification
  if (data.justification.trim()) {
    paragraphs.push(new Paragraph({ children: [] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Justification", bold: true, size: 24 }),
        ],
      })
    );
    paragraphs.push(new Paragraph({ children: [] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: data.justification.trim(), size: 24 }),
        ],
      })
    );
  }

  // Conditions
  if (data.conditions.trim()) {
    paragraphs.push(new Paragraph({ children: [] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Proposed Conditions",
            bold: true,
            size: 24,
          }),
        ],
      })
    );
    paragraphs.push(new Paragraph({ children: [] }));
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.conditions.trim(), size: 24 })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [] }));

  // Closing
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "I would be grateful for your consideration and look forward to your response. Please do not hesitate to contact me should you require any further information.",
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

  if (data.yourTitle.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.yourTitle, size: 24 })],
      })
    );
  }

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
