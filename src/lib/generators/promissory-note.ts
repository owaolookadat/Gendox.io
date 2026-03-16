import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export interface PromissoryNoteData {
  borrowerName: string;
  borrowerAddress: string;
  lenderName: string;
  lenderAddress: string;
  principalAmount: number;
  currency: string;
  currencySymbol: string;
  interestRate: number;
  dateOfNote: string;
  maturityDate: string;
  paymentTerms: string;
  lateFee: string;
  governingLaw: string;
}

function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${amount.toFixed(2)}`;
}

export async function generatePromissoryNote(
  data: PromissoryNoteData
): Promise<Blob> {
  const interestText =
    data.interestRate > 0
      ? `This Note shall bear interest on the unpaid principal balance at a rate of ${data.interestRate}% per annum, calculated from the date of this Note until the principal is paid in full.`
      : "This Note shall not bear interest.";

  let paymentText = "";
  switch (data.paymentTerms) {
    case "Lump Sum at Maturity":
      paymentText = `The entire principal balance, together with any accrued interest, shall be due and payable in a single lump sum on the Maturity Date.`;
      break;
    case "Monthly Installments":
      paymentText = `The principal balance, together with any accrued interest, shall be repaid in equal monthly installments commencing one month from the date of this Note and continuing on the same day of each subsequent month until the Maturity Date, at which point any remaining balance shall be due and payable in full.`;
      break;
    case "Quarterly":
      paymentText = `The principal balance, together with any accrued interest, shall be repaid in equal quarterly installments commencing three months from the date of this Note and continuing every three months thereafter until the Maturity Date, at which point any remaining balance shall be due and payable in full.`;
      break;
    default:
      paymentText = `Payment shall be made according to the agreed terms.`;
  }

  const sections: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({ text: "PROMISSORY NOTE", bold: true, size: 36 }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Date: ", bold: true, size: 22 }),
        new TextRun({ text: data.dateOfNote, size: 22 }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Principal Amount: ", bold: true, size: 22 }),
        new TextRun({
          text: formatCurrency(data.principalAmount, data.currencySymbol),
          size: 22,
        }),
        new TextRun({ text: ` (${data.currency})`, size: 22 }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Maturity Date: ", bold: true, size: 22 }),
        new TextRun({ text: data.maturityDate, size: 22 }),
      ],
    }),

    new Paragraph({ spacing: { after: 400 }, children: [] }),

    // Parties
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "1. PARTIES",
          bold: true,
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `FOR VALUE RECEIVED, the undersigned, `,
          size: 22,
        }),
        new TextRun({ text: data.borrowerName, bold: true, size: 22 }),
        new TextRun({
          text: ` ("Borrower"), whose address is:`,
          size: 22,
        }),
      ],
    }),

    ...data.borrowerAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 22, color: "555555" }),
          ],
        })
    ),

    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: `hereby promises to pay to the order of `,
          size: 22,
        }),
        new TextRun({ text: data.lenderName, bold: true, size: 22 }),
        new TextRun({
          text: ` ("Lender"), whose address is:`,
          size: 22,
        }),
      ],
    }),

    ...data.lenderAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 22, color: "555555" }),
          ],
        })
    ),

    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: `the principal sum of ${formatCurrency(data.principalAmount, data.currencySymbol)} (${data.currency}), subject to the terms and conditions set forth herein.`,
          size: 22,
        }),
      ],
    }),

    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // Interest
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "2. INTEREST", bold: true, size: 22 }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: interestText, size: 22 })],
    }),

    // Payment Terms
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "3. PAYMENT TERMS", bold: true, size: 22 }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: paymentText, size: 22 })],
    }),

    // Default
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "4. DEFAULT", bold: true, size: 22 }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `The Borrower shall be in default if any payment is not made when due. Upon default, the entire remaining unpaid principal balance and any accrued interest shall become immediately due and payable at the option of the Lender.`,
          size: 22,
        }),
      ],
    }),
  ];

  // Late Fee
  if (data.lateFee.trim()) {
    sections.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "5. LATE FEE", bold: true, size: 22 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `If any payment is not received within ten (10) days of its due date, the Borrower agrees to pay a late fee of ${data.lateFee}.`,
            size: 22,
          }),
        ],
      })
    );
  }

  // Governing Law
  const nextClause = data.lateFee.trim() ? "6" : "5";
  sections.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${nextClause}. GOVERNING LAW`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `This Note shall be governed by and construed in accordance with the laws of ${data.governingLaw}.`,
          size: 22,
        }),
      ],
    })
  );

  // Signatures
  sections.push(
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "IN WITNESS WHEREOF, the Borrower has executed this Promissory Note as of the date first written above.",
          size: 22,
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
          text: `${data.borrowerName} (Borrower)`,
          size: 22,
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
          text: `${data.lenderName} (Lender)`,
          size: 22,
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return await Packer.toBlob(doc);
}
