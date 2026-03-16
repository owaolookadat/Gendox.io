import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export interface ConsentFormData {
  organizationName: string;
  purpose: string;
  description: string;
  participantName: string;
  date: string;
  risks: string;
  benefits: string;
  voluntaryStatement: string;
  withdrawalPolicy: string;
  contactPerson: string;
  contactEmail: string;
}

export async function generateConsentForm(
  data: ConsentFormData
): Promise<Blob> {
  const children: Paragraph[] = [
    // Organization name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: data.organizationName,
          bold: true,
          size: 28,
        }),
      ],
    }),

    // Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "INFORMED CONSENT FORM",
          bold: true,
          size: 36,
        }),
      ],
    }),

    // Purpose
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "Purpose: ",
          bold: true,
          size: 22,
        }),
        new TextRun({ text: data.purpose, size: 22 }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Date: ", bold: true, size: 22 }),
        new TextRun({ text: data.date, size: 22 }),
      ],
    }),

    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // Introduction
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "1. DESCRIPTION OF ACTIVITY",
          bold: true,
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `You are being invited to participate in the following activity organized by ${data.organizationName}:`,
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: data.description, size: 22 }),
      ],
    }),
  ];

  // Risks
  if (data.risks.trim()) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "2. POTENTIAL RISKS",
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "The following risks are associated with this activity:",
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: data.risks, size: 22 }),
        ],
      })
    );
  }

  // Benefits
  if (data.benefits.trim()) {
    const benefitNum = data.risks.trim() ? 3 : 2;
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `${benefitNum}. POTENTIAL BENEFITS`,
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: data.benefits, size: 22 }),
        ],
      })
    );
  }

  let clauseNum = 2;
  if (data.risks.trim()) clauseNum++;
  if (data.benefits.trim()) clauseNum++;

  // Voluntary Participation
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${clauseNum}. VOLUNTARY PARTICIPATION`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: data.voluntaryStatement, size: 22 }),
      ],
    })
  );

  clauseNum++;

  // Withdrawal Policy
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${clauseNum}. RIGHT TO WITHDRAW`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: data.withdrawalPolicy, size: 22 }),
      ],
    })
  );

  clauseNum++;

  // Contact Information
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${clauseNum}. CONTACT INFORMATION`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `If you have any questions or concerns regarding this activity, please contact:`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Name: ", bold: true, size: 22 }),
        new TextRun({ text: data.contactPerson, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Email: ", bold: true, size: 22 }),
        new TextRun({ text: data.contactEmail, size: 22 }),
      ],
    })
  );

  clauseNum++;

  // Consent Statement
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${clauseNum}. CONSENT STATEMENT`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `By signing below, I, ${data.participantName}, confirm that I have read and understood the information provided above. I have been given the opportunity to ask questions, and any questions I had have been answered to my satisfaction. I voluntarily agree to participate in the activity described herein.`,
          size: 22,
        }),
      ],
    })
  );

  // Signature
  children.push(
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "PARTICIPANT",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 300 }, children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: "____________________________", size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${data.participantName} (Signature)`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Printed Name: ____________________________",
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Date: ${data.date}`,
          size: 22,
        }),
      ],
    }),

    // Organization representative
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "ORGANIZATION REPRESENTATIVE",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 300 }, children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: "____________________________", size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${data.organizationName} Representative (Signature)`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Printed Name: ____________________________",
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Date: ____________________________",
          size: 22,
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [{ children }],
  });

  return await Packer.toBlob(doc);
}
