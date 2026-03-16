import { Document, Packer, Paragraph, TextRun } from "docx";

export interface DemandLetterData {
  yourName: string;
  yourAddress: string;
  recipientName: string;
  recipientAddress: string;
  subject: string;
  amountOwed: string;
  descriptionOfClaim: string;
  supportingFacts: string;
  demand: string;
  deadline: string;
  consequences: string;
}

function formatDate(dateStr?: string): string {
  const date = dateStr ? new Date(dateStr) : new Date();
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateDemandLetter(
  data: DemandLetterData
): Promise<Blob> {
  const todayFormatted = formatDate();

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.yourName, bold: true, size: 24 })],
    }),
  ];

  // Your address lines
  const addressLines = data.yourAddress.trim().split("\n");
  for (const line of addressLines) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: line.trim(), size: 24 })],
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

  const recipientLines = data.recipientAddress.trim().split("\n");
  for (const line of recipientLines) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: line.trim(), size: 24 })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [] }));

  // SENT VIA marker
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "SENT VIA RECORDED DELIVERY",
          bold: true,
          size: 24,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Subject
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

  // Opening
  let openingText =
    "I am writing to formally demand resolution of the matter described below.";
  if (data.amountOwed.trim()) {
    openingText += ` This letter concerns an outstanding amount of ${data.amountOwed} that is owed to me.`;
  }

  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: openingText, size: 24 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Description of Claim
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Description of Claim", bold: true, size: 24 }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.descriptionOfClaim.trim(), size: 24 }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Supporting Facts
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Supporting Facts", bold: true, size: 24 }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.supportingFacts.trim(), size: 24 }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Demand
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: "Demand", bold: true, size: 24 })],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.demand.trim(), size: 24 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Deadline
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `I require compliance with the above demand by ${formatDate(data.deadline)}. Failure to respond or comply within this timeframe will leave me with no alternative but to pursue further action.`,
          size: 24,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Consequences
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Consequences of Non-Compliance",
          bold: true,
          size: 24,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.consequences.trim(), size: 24 })],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Closing
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "I trust this matter can be resolved without the need for further action. Please treat this letter with the urgency it deserves.",
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
