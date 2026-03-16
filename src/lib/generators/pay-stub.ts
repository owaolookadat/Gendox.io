import { Document, Packer, Paragraph, TextRun } from "docx";

export interface PayStubData {
  companyName: string;
  employeeName: string;
  employeeId: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  currency: string;
  basicSalary: number;
  overtimeHours: number;
  overtimeRate: number;
  bonus: number;
  deductionTax: number;
  deductionInsurance: number;
  deductionPension: number;
  deductionOther: number;
  otherDeductionDescription: string;
  ytdGross: number;
  ytdNet: number;
}

function getCurrencySymbol(currency: string): string {
  switch (currency) {
    case "GBP": return "\u00a3";
    case "USD": return "$";
    case "EUR": return "\u20ac";
    case "MYR": return "RM ";
    default: return "\u00a3";
  }
}

function formatCurrency(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toFixed(2)}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function calculatePayStub(data: PayStubData) {
  const overtimePay = data.overtimeHours * data.overtimeRate;
  const grossPay = data.basicSalary + overtimePay + data.bonus;
  const totalDeductions =
    data.deductionTax +
    data.deductionInsurance +
    data.deductionPension +
    data.deductionOther;
  const netPay = grossPay - totalDeductions;
  return { overtimePay, grossPay, totalDeductions, netPay };
}

export async function generatePayStub(data: PayStubData): Promise<Blob> {
  const { overtimePay, grossPay, totalDeductions, netPay } = calculatePayStub(data);
  const c = data.currency;

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.companyName, bold: true, size: 28 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: "PAY STUB", bold: true, size: 24 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "Employee Name: ", bold: true, size: 22 }),
        new TextRun({ text: data.employeeName, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Employee ID: ", bold: true, size: 22 }),
        new TextRun({ text: data.employeeId, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Pay Period: ", bold: true, size: 22 }),
        new TextRun({
          text: `${formatDate(data.payPeriodStart)} to ${formatDate(data.payPeriodEnd)}`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Pay Date: ", bold: true, size: 22 }),
        new TextRun({ text: formatDate(data.payDate), size: 22 }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "EARNINGS", bold: true, size: 22, underline: {} }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Basic Salary: ${formatCurrency(data.basicSalary, c)}`, size: 22 }),
      ],
    }),
  ];

  if (overtimePay > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Overtime (${data.overtimeHours} hrs @ ${formatCurrency(data.overtimeRate, c)}/hr): ${formatCurrency(overtimePay, c)}`,
            size: 22,
          }),
        ],
      })
    );
  }

  if (data.bonus > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Bonus: ${formatCurrency(data.bonus, c)}`, size: 22 }),
        ],
      })
    );
  }

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Gross Pay: ${formatCurrency(grossPay, c)}`,
          bold: true,
          size: 22,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "DEDUCTIONS", bold: true, size: 22, underline: {} }),
      ],
    })
  );

  if (data.deductionTax > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Tax: ${formatCurrency(data.deductionTax, c)}`, size: 22 }),
        ],
      })
    );
  }

  if (data.deductionInsurance > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Insurance: ${formatCurrency(data.deductionInsurance, c)}`, size: 22 }),
        ],
      })
    );
  }

  if (data.deductionPension > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Pension: ${formatCurrency(data.deductionPension, c)}`, size: 22 }),
        ],
      })
    );
  }

  if (data.deductionOther > 0) {
    const desc = data.otherDeductionDescription || "Other";
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${desc}: ${formatCurrency(data.deductionOther, c)}`, size: 22 }),
        ],
      })
    );
  }

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Total Deductions: ${formatCurrency(totalDeductions, c)}`,
          bold: true,
          size: 22,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `NET PAY: ${formatCurrency(netPay, c)}`,
          bold: true,
          size: 26,
        }),
      ],
    })
  );

  if (data.ytdGross > 0 || data.ytdNet > 0) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "YEAR-TO-DATE", bold: true, size: 22, underline: {} }),
        ],
      })
    );
    if (data.ytdGross > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `YTD Gross: ${formatCurrency(data.ytdGross, c)}`, size: 22 }),
          ],
        })
      );
    }
    if (data.ytdNet > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `YTD Net: ${formatCurrency(data.ytdNet, c)}`, size: 22 }),
          ],
        })
      );
    }
  }

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
