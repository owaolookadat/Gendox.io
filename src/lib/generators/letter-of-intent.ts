import { Document, Packer, Paragraph, TextRun } from "docx";

export interface LetterOfIntentData {
  yourName: string;
  yourTitle: string;
  yourOrganization: string;
  recipientName: string;
  recipientTitle: string;
  recipientOrganization: string;
  purpose: string;
  subject: string;
  intentStatement: string;
  keyTerms: string;
  timeline: string;
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

export async function generateLetterOfIntent(
  data: LetterOfIntentData
): Promise<Blob> {
  const todayFormatted = formatDate();

  const paragraphs: Paragraph[] = [
    // Sender info
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

  if (data.yourOrganization.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.yourOrganization, size: 24 })],
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

  // Recipient info
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

  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.recipientOrganization, size: 24 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Subject line
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Re: ", bold: true, size: 24 }),
        new TextRun({ text: data.subject, bold: true, size: 24 }),
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

  // Opening paragraph
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `This letter serves as a formal expression of intent regarding ${data.purpose.toLowerCase()}. I am writing on behalf of ${data.yourOrganization.trim() || "myself"} to outline our intentions and the key terms of the proposed arrangement.`,
          size: 24,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Intent Statement
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Statement of Intent", bold: true, size: 24 }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.intentStatement.trim(), size: 24 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Key Terms
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Key Terms and Details",
          bold: true,
          size: 24,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.keyTerms.trim(), size: 24 })],
    })
  );

  // Timeline
  if (data.timeline.trim()) {
    paragraphs.push(new Paragraph({ children: [] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Timeline: ", bold: true, size: 24 }),
          new TextRun({ text: data.timeline.trim(), size: 24 }),
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
          new TextRun({ text: "Conditions", bold: true, size: 24 }),
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
          text: "This letter of intent is not legally binding but represents a genuine expression of our interest and commitment to pursuing the matter outlined above. We look forward to further discussions and formalising the terms in a definitive agreement.",
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

  if (data.yourOrganization.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.yourOrganization, size: 24 })],
      })
    );
  }

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
