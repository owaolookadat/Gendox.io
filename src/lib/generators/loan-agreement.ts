import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";

export interface LoanAgreementData {
  lenderName: string;
  lenderAddress: string;
  borrowerName: string;
  borrowerAddress: string;
  loanAmount: number;
  currency: string;
  currencySymbol: string;
  interestRate: number;
  loanDate: string;
  repaymentDate: string;
  repaymentSchedule: string;
  purposeOfLoan: string;
  collateral: string;
  latePaymentFee: string;
  governingLaw: string;
}

export async function generateLoanAgreement(
  data: LoanAgreementData
): Promise<Blob> {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "LOAN AGREEMENT",
          bold: true,
          size: 32,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `This Loan Agreement ("Agreement") is entered into as of ${data.loanDate} by and between:`,
          size: 22,
        }),
      ],
    }),

    // Lender
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Lender: ", bold: true, size: 22 }),
        new TextRun({ text: data.lenderName, size: 22 }),
      ],
    }),
    ...data.lenderAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 20, color: "555555" }),
          ],
        })
    ),
    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // Borrower
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Borrower: ", bold: true, size: 22 }),
        new TextRun({ text: data.borrowerName, size: 22 }),
      ],
    }),
    ...data.borrowerAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 20, color: "555555" }),
          ],
        })
    ),
    new Paragraph({ spacing: { after: 300 }, children: [] }),

    // 1. Loan Amount
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "1. LOAN AMOUNT", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The Lender agrees to loan the Borrower the principal sum of ${data.currencySymbol}${data.loanAmount.toLocaleString()} ("Loan Amount").`,
          size: 22,
        }),
      ],
    }),

    // 2. Interest
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "2. INTEREST RATE", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The Loan Amount shall bear interest at a rate of ${data.interestRate}% per annum, calculated on the outstanding principal balance.`,
          size: 22,
        }),
      ],
    }),

    // 3. Repayment
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "3. REPAYMENT TERMS", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The Borrower shall repay the Loan Amount together with all accrued interest by ${data.repaymentDate}. Repayment shall be made ${data.repaymentSchedule.toLowerCase() === "lump sum" ? "in a single lump sum payment on the repayment date" : `in ${data.repaymentSchedule.toLowerCase()} instalments`}. All payments shall be made to the Lender by bank transfer or other mutually agreed method.`,
          size: 22,
        }),
      ],
    }),

    // 4. Prepayment
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "4. PREPAYMENT", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "The Borrower may prepay the Loan Amount, in whole or in part, at any time without penalty. Any prepayment shall first be applied to accrued interest and then to the principal balance.",
          size: 22,
        }),
      ],
    }),
  ];

  // 5. Late Payment
  if (data.latePaymentFee) {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({ text: "5. LATE PAYMENT", bold: true, size: 22 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: `If any payment is not received within 7 days of its due date, the Borrower shall pay a late payment fee of ${data.latePaymentFee}. This is in addition to any interest that continues to accrue on the outstanding balance.`,
            size: 22,
          }),
        ],
      })
    );
  }

  let clauseNum = data.latePaymentFee ? 6 : 5;

  // Purpose
  if (data.purposeOfLoan) {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `${clauseNum}. PURPOSE OF LOAN`,
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: `The Loan Amount shall be used for the following purpose: ${data.purposeOfLoan}`,
            size: 22,
          }),
        ],
      })
    );
    clauseNum++;
  }

  // Collateral
  if (data.collateral) {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `${clauseNum}. COLLATERAL`,
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: `To secure the repayment of the Loan Amount, the Borrower agrees to pledge the following collateral: ${data.collateral}. In the event of default, the Lender shall have the right to take possession of and sell the collateral to recover the outstanding balance.`,
            size: 22,
          }),
        ],
      })
    );
    clauseNum++;
  }

  // Default
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `${clauseNum}. DEFAULT`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "The Borrower shall be in default if: (a) any payment is not made within 30 days of its due date; (b) the Borrower becomes insolvent or files for bankruptcy; or (c) the Borrower breaches any material term of this Agreement. Upon default, the entire outstanding balance, including accrued interest, shall become immediately due and payable.",
          size: 22,
        }),
      ],
    })
  );
  clauseNum++;

  // Governing Law
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `${clauseNum}. GOVERNING LAW`,
          bold: true,
          size: 22,
        }),
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
    })
  );

  // Signatures
  children.push(
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "IN WITNESS WHEREOF, the parties have executed this Agreement.",
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
        new TextRun({ text: `${data.lenderName} (Lender)`, size: 22 }),
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
        new TextRun({ text: `${data.borrowerName} (Borrower)`, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: "Date: _______________", size: 22 })],
    })
  );

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBlob(doc);
}
