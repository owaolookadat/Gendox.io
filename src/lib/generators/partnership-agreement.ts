import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";

export interface PartnershipAgreementData {
  partnershipName: string;
  businessType: string;
  partner1Name: string;
  partner1Address: string;
  partner1Contribution: string;
  partner1Ownership: number;
  partner2Name: string;
  partner2Address: string;
  partner2Contribution: string;
  partner2Ownership: number;
  effectiveDate: string;
  purposeOfPartnership: string;
  duration: string;
  profitDistribution: string;
  decisionMaking: string;
  disputeResolution: string;
  governingLaw: string;
}

export async function generatePartnershipAgreement(
  data: PartnershipAgreementData
): Promise<Blob> {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "PARTNERSHIP AGREEMENT",
          bold: true,
          size: 32,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `This Partnership Agreement ("Agreement") is entered into as of ${data.effectiveDate} by and between:`,
          size: 22,
        }),
      ],
    }),

    // Partner 1
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Partner 1: ", bold: true, size: 22 }),
        new TextRun({ text: data.partner1Name, size: 22 }),
      ],
    }),
    ...data.partner1Address.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 20, color: "555555" }),
          ],
        })
    ),
    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // Partner 2
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Partner 2: ", bold: true, size: 22 }),
        new TextRun({ text: data.partner2Name, size: 22 }),
      ],
    }),
    ...data.partner2Address.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 20, color: "555555" }),
          ],
        })
    ),
    new Paragraph({ spacing: { after: 300 }, children: [] }),

    // 1. Name and Business
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "1. PARTNERSHIP NAME AND BUSINESS",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The partners hereby form a partnership under the name "${data.partnershipName}" ("Partnership"). The business type is ${data.businessType}.`,
          size: 22,
        }),
      ],
    }),

    // 2. Purpose
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "2. PURPOSE", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The purpose of the Partnership is: ${data.purposeOfPartnership}`,
          size: 22,
        }),
      ],
    }),

    // 3. Term
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "3. TERM", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The Partnership shall commence on ${data.effectiveDate} and shall continue for ${data.duration === "Indefinite" ? "an indefinite period until dissolved by mutual agreement of the partners or as otherwise provided herein" : `a period of ${data.duration} from the commencement date, unless terminated earlier in accordance with this Agreement`}.`,
          size: 22,
        }),
      ],
    }),

    // 4. Contributions
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "4. CAPITAL CONTRIBUTIONS",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `${data.partner1Name} shall contribute: ${data.partner1Contribution}`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `${data.partner2Name} shall contribute: ${data.partner2Contribution}`,
          size: 22,
        }),
      ],
    }),

    // 5. Ownership
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "5. OWNERSHIP INTERESTS",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `${data.partner1Name}: ${data.partner1Ownership}%`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `${data.partner2Name}: ${data.partner2Ownership}%`,
          size: 22,
        }),
      ],
    }),

    // 6. Profit Distribution
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "6. PROFIT AND LOSS DISTRIBUTION",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: data.profitDistribution,
          size: 22,
        }),
      ],
    }),

    // 7. Management
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "7. MANAGEMENT AND DECISION MAKING",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: data.decisionMaking ||
            "All major decisions regarding the Partnership shall require the unanimous consent of all partners. Day-to-day operational decisions may be made by any partner in the ordinary course of business.",
          size: 22,
        }),
      ],
    }),

    // 8. Banking
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "8. BANKING AND ACCOUNTING",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "The Partnership shall maintain a separate bank account in the name of the Partnership. Accurate books and records of account shall be maintained at the principal place of business. Each partner shall have the right to inspect the books at any reasonable time.",
          size: 22,
        }),
      ],
    }),

    // 9. Withdrawal/Dissolution
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "9. WITHDRAWAL AND DISSOLUTION",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "A partner may withdraw from the Partnership by providing 90 days written notice. Upon withdrawal, the withdrawing partner shall be entitled to receive the value of their partnership interest. The Partnership shall be dissolved upon mutual agreement of all partners, upon the occurrence of any event making it unlawful for the business to continue, or by court order.",
          size: 22,
        }),
      ],
    }),

    // 10. Dispute Resolution
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "10. DISPUTE RESOLUTION",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `Any dispute arising out of or relating to this Agreement shall be resolved through ${data.disputeResolution.toLowerCase()}. The prevailing party shall be entitled to recover reasonable costs and fees.`,
          size: 22,
        }),
      ],
    }),

    // 11. Governing Law
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "11. GOVERNING LAW", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `This Agreement shall be governed by and construed in accordance with the laws of ${data.governingLaw}.`,
          size: 22,
        }),
      ],
    }),

    // Signatures
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "IN WITNESS WHEREOF, the partners have executed this Agreement as of the date first written above.",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: "______________________________", size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: `${data.partner1Name} (Partner 1)`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: "Date: _______________", size: 22 })],
    }),
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: "______________________________", size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: `${data.partner2Name} (Partner 2)`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: "Date: _______________", size: 22 })],
    }),
  ];

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBlob(doc);
}
