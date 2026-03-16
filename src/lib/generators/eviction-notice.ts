import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export interface EvictionNoticeData {
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  propertyAddress: string;
  noticeType: string;
  noticePeriod: string;
  reasonForEviction: string;
  amountOwed: number;
  dueDate: string;
  dateOfNotice: string;
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export async function generateEvictionNotice(
  data: EvictionNoticeData
): Promise<Blob> {
  let noticeTitle = "";
  switch (data.noticeType) {
    case "Pay or Quit":
      noticeTitle = "NOTICE TO PAY RENT OR QUIT";
      break;
    case "Cure or Quit":
      noticeTitle = "NOTICE TO CURE OR QUIT";
      break;
    case "Unconditional Quit":
      noticeTitle = "UNCONDITIONAL NOTICE TO QUIT";
      break;
    default:
      noticeTitle = "NOTICE TO QUIT";
  }

  const children: Paragraph[] = [
    // Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({ text: noticeTitle, bold: true, size: 36 }),
      ],
    }),

    // Date
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Date: ", bold: true, size: 22 }),
        new TextRun({ text: data.dateOfNotice, size: 22 }),
      ],
    }),

    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // To
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "TO: ", bold: true, size: 22 }),
        new TextRun({ text: data.tenantName, size: 22 }),
      ],
    }),

    // Property Address
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "REGARDING PROPERTY AT:",
          bold: true,
          size: 22,
        }),
      ],
    }),

    ...data.propertyAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 22, color: "555555" }),
          ],
        })
    ),

    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // From
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "FROM: ", bold: true, size: 22 }),
        new TextRun({ text: data.landlordName, size: 22 }),
      ],
    }),

    ...data.landlordAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 22, color: "555555" }),
          ],
        })
    ),

    new Paragraph({ spacing: { after: 400 }, children: [] }),

    // Notice body
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Dear ${data.tenantName},`,
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `You are hereby notified that you are required to vacate and surrender possession of the above-described premises within ${data.noticePeriod} from the date of service of this notice.`,
          size: 22,
        }),
      ],
    }),
  ];

  // Notice type specific content
  if (data.noticeType === "Pay or Quit" && data.amountOwed > 0) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `The total amount of rent currently owed is ${formatCurrency(data.amountOwed)}. You are required to pay this amount in full on or before ${data.dueDate}, or vacate the premises.`,
            size: 22,
          }),
        ],
      })
    );
  } else if (data.noticeType === "Cure or Quit") {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `You are required to cure the following violation(s) on or before ${data.dueDate}, or vacate the premises.`,
            size: 22,
          }),
        ],
      })
    );
  }

  // Reason
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "REASON FOR THIS NOTICE:",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: data.reasonForEviction, size: 22 }),
      ],
    })
  );

  // Legal notice
  children.push(
    new Paragraph({ spacing: { after: 200 }, children: [] }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "PLEASE TAKE NOTICE that if you fail to comply with this notice within the time specified, legal proceedings may be initiated against you to recover possession of the premises, and to recover any rent due and any damages.",
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "This notice is served in accordance with applicable landlord-tenant law. You are advised to seek legal counsel regarding your rights and obligations.",
          size: 22,
        }),
      ],
    }),

    // Signature
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: "Sincerely,", size: 22 }),
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
          text: `${data.landlordName} (Landlord/Property Owner)`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100 },
      children: [
        new TextRun({
          text: `Date: ${data.dateOfNotice}`,
          size: 22,
        }),
      ],
    }),

    // Certificate of Service
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "CERTIFICATE OF SERVICE",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `I hereby certify that a copy of this notice was served upon ${data.tenantName} on __________________ by the following method: ☐ Personal delivery ☐ Posting on premises ☐ Certified mail`,
          size: 20,
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [{ children }],
  });

  return await Packer.toBlob(doc);
}
