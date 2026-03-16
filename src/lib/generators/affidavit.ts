import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export interface AffidavitData {
  affiantName: string;
  affiantAddress: string;
  affiantTitle: string;
  purpose: string;
  statementOfFacts: string;
  additionalFacts: string;
  date: string;
  jurisdiction: string;
  includeNotary: boolean;
}

export async function generateAffidavit(
  data: AffidavitData
): Promise<Blob> {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({ text: "AFFIDAVIT", bold: true, size: 36 }),
      ],
    }),

    // Jurisdiction header
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: `Jurisdiction: ${data.jurisdiction}`,
          size: 22,
          color: "555555",
        }),
      ],
    }),

    // Purpose
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "RE: ", bold: true, size: 22 }),
        new TextRun({ text: data.purpose, size: 22 }),
      ],
    }),

    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // Affiant introduction
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `I, ${data.affiantName}`,
          bold: true,
          size: 22,
        }),
        new TextRun({
          text: data.affiantTitle
            ? `, ${data.affiantTitle}, `
            : ", ",
          size: 22,
        }),
        new TextRun({
          text: "being duly sworn, do hereby depose and state as follows:",
          size: 22,
        }),
      ],
    }),

    // Address
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "1. I reside at the following address:",
          bold: true,
          size: 22,
        }),
      ],
    }),

    ...data.affiantAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 22, color: "555555" }),
          ],
          spacing: { after: 50 },
        })
    ),

    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // Competence
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "2. ",
          bold: true,
          size: 22,
        }),
        new TextRun({
          text: "I am over the age of eighteen (18) years and am competent to make this affidavit. I have personal knowledge of the facts stated herein, and they are true and correct to the best of my knowledge and belief.",
          size: 22,
        }),
      ],
    }),

    // Statement of Facts
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "3. STATEMENT OF FACTS:",
          bold: true,
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: data.statementOfFacts, size: 22 }),
      ],
    }),
  ];

  // Additional Facts
  if (data.additionalFacts.trim()) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "4. ADDITIONAL FACTS:",
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: data.additionalFacts, size: 22 }),
        ],
      })
    );
  }

  const nextClause = data.additionalFacts.trim() ? 5 : 4;

  // Truthfulness statement
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${nextClause}. `,
          bold: true,
          size: 22,
        }),
        new TextRun({
          text: "I declare under penalty of perjury that the foregoing is true and correct. I understand that making false statements herein is punishable by law.",
          size: 22,
        }),
      ],
    })
  );

  // Signature
  children.push(
    new Paragraph({ spacing: { after: 200 }, children: [] }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "FURTHER AFFIANT SAYETH NAUGHT.",
          bold: true,
          size: 22,
          italics: true,
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: "____________________________", size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${data.affiantName} (Affiant)`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100 },
      children: [
        new TextRun({ text: `Date: ${data.date}`, size: 22 }),
      ],
    })
  );

  // Notary block
  if (data.includeNotary) {
    children.push(
      new Paragraph({ spacing: { after: 400 }, children: [] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "NOTARY PUBLIC ACKNOWLEDGMENT",
            bold: true,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `State/Jurisdiction of: ${data.jurisdiction}`,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `Sworn to and subscribed before me this ______ day of ______________, 20_____.`,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `${data.affiantName} personally appeared before me and is known to me (or proved to me on the basis of satisfactory evidence) to be the person whose name is subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacity.`,
            size: 20,
          }),
        ],
      }),
      new Paragraph({ spacing: { after: 400 }, children: [] }),
      new Paragraph({
        children: [
          new TextRun({ text: "____________________________", size: 22 }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Notary Public", size: 22 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 100 },
        children: [
          new TextRun({
            text: "My Commission Expires: __________________",
            size: 20,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "[NOTARY SEAL]",
            size: 20,
            color: "999999",
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return await Packer.toBlob(doc);
}
