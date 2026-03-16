import { Document, Packer, Paragraph, TextRun } from "docx";

export interface ComplaintLetterData {
  yourName: string;
  yourAddress: string;
  recipientName: string;
  recipientTitle: string;
  organizationName: string;
  organizationAddress: string;
  dateOfIssue: string;
  subject: string;
  descriptionOfComplaint: string;
  previousAttempts: string;
  desiredResolution: string;
  deadlineForResponse: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateComplaintLetter(
  data: ComplaintLetterData
): Promise<Blob> {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.yourName, bold: true, size: 28 })],
    }),
  ];

  // Add sender address lines
  const addressLines = data.yourAddress.split("\n").filter((l) => l.trim());
  for (const line of addressLines) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: line.trim(), size: 22, color: "666666" })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: today, size: 22 })],
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
      children: [new TextRun({ text: data.organizationName, size: 22 })],
    })
  );
  const orgAddressLines = data.organizationAddress
    .split("\n")
    .filter((l) => l.trim());
  for (const line of orgAddressLines) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: line.trim(), size: 22 })],
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
      children: [
        new TextRun({
          text: `Re: ${data.subject}`,
          bold: true,
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
          text: `I am writing to formally register a complaint regarding an issue that occurred on ${formatDate(data.dateOfIssue)}.`,
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
          text: data.descriptionOfComplaint,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  if (data.previousAttempts) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `I have previously attempted to resolve this matter: ${data.previousAttempts}`,
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
          text: `Desired Resolution: ${data.desiredResolution}`,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  if (data.deadlineForResponse) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `I would appreciate a response by ${formatDate(data.deadlineForResponse)}.`,
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
          text: "I trust this matter will be given the attention it deserves and look forward to your prompt response.",
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
      children: [new TextRun({ text: data.yourName, bold: true, size: 22 })],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
