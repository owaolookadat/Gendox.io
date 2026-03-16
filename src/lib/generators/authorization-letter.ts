import { Document, Packer, Paragraph, TextRun } from "docx";

export interface AuthorizationLetterData {
  yourName: string;
  yourId: string;
  authorizedPersonName: string;
  authorizedPersonId: string;
  purpose: string;
  authorizationDetails: string;
  validFrom: string;
  validUntil: string;
  conditions: string;
}

function formatDate(dateStr?: string): string {
  const date = dateStr ? new Date(dateStr) : new Date();
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateAuthorizationLetter(
  data: AuthorizationLetterData
): Promise<Blob> {
  const todayFormatted = formatDate();

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: "LETTER OF AUTHORIZATION",
          bold: true,
          size: 28,
        }),
      ],
    }),
    new Paragraph({ children: [] }),
    new Paragraph({
      children: [new TextRun({ text: `Date: ${todayFormatted}`, size: 24 })],
    }),
    new Paragraph({ children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: "To Whom It May Concern,", size: 24 }),
      ],
    }),
    new Paragraph({ children: [] }),
  ];

  // Authorization statement
  let authStatement = `I, ${data.yourName}`;
  if (data.yourId.trim()) {
    authStatement += ` (ID/Reference: ${data.yourId})`;
  }
  authStatement += `, hereby authorise ${data.authorizedPersonName}`;
  if (data.authorizedPersonId.trim()) {
    authStatement += ` (ID/Reference: ${data.authorizedPersonId})`;
  }
  authStatement += ` to act on my behalf for the purpose of: ${data.purpose.toLowerCase()}.`;

  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: authStatement, size: 24 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Specific details
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Scope of Authorization",
          bold: true,
          size: 24,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.authorizationDetails.trim(), size: 24 }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Validity period
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Validity Period", bold: true, size: 24 }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `This authorization is valid from ${formatDate(data.validFrom)} to ${formatDate(data.validUntil)}.`,
          size: 24,
        }),
      ],
    })
  );

  // Conditions
  if (data.conditions.trim()) {
    paragraphs.push(new Paragraph({ children: [] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Conditions and Limitations",
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
          text: "Please accept this letter as formal authorisation. Should you require any further verification, please do not hesitate to contact me.",
          size: 24,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: "Yours faithfully,", size: 24 })],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "____________________________", size: 24 }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.yourName, size: 24 })],
    })
  );
  if (data.yourId.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `ID/Reference: ${data.yourId}`, size: 24 }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
