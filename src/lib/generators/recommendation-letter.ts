import { Document, Packer, Paragraph, TextRun } from "docx";

export interface RecommendationLetterData {
  yourName: string;
  yourTitle: string;
  yourOrganization: string;
  candidateName: string;
  candidateRole: string;
  howLongKnown: string;
  context: string;
  keyStrengths: string;
  specificExamples: string;
  closingRecommendation: string;
}

export async function generateRecommendationLetter(
  data: RecommendationLetterData
): Promise<Blob> {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const contextLabel = data.context.toLowerCase();
  const closing =
    data.closingRecommendation ||
    "I recommend them without reservation.";

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.yourName, bold: true, size: 28 })],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${data.yourTitle}, ${data.yourOrganization}`,
          size: 22,
          color: "666666",
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: today, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: "To Whom It May Concern,", size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `I am writing to recommend ${data.candidateName} for any ${contextLabel} opportunity they may pursue. I have known ${data.candidateName} for ${data.howLongKnown} in a ${contextLabel} capacity, during which time they served as ${data.candidateRole}.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
  ];

  if (data.keyStrengths) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${data.candidateName} demonstrates exceptional qualities including: ${data.keyStrengths}`,
            size: 22,
          }),
        ],
      })
    );
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  if (data.specificExamples) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.specificExamples,
            size: 22,
          }),
        ],
      })
    );
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: closing, size: 22 })],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Please do not hesitate to contact me if you require any further information.",
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
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${data.yourTitle}, ${data.yourOrganization}`,
          size: 22,
        }),
      ],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
