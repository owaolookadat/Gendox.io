import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  ShadingType,
  convertInchesToTwip,
} from "docx";

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface PaymentDetails {
  bankName: string;
  accountNumber: string;
  sortCode: string;
}

export interface InvoiceData {
  businessName: string;
  email: string;
  address: string;
  clientName: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  currencySymbol: string;
  lineItems: LineItem[];
  taxRate: number;
  notes: string;
  paymentDetails?: PaymentDetails;
}

function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${amount.toFixed(2)}`;
}

const BLUE = "2563EB";
const DARK = "1F2937";
const GRAY_TEXT = "6B7280";
const HEADER_BG = "F3F4F6";
const BORDER_COLOR = "D1D5DB";

function noBorders() {
  const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return { top: none, bottom: none, left: none, right: none };
}

function cellBorders(options?: { bottom?: boolean; top?: boolean }) {
  const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const thin = { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR };
  return {
    top: options?.top ? thin : none,
    bottom: options?.bottom ? thin : none,
    left: none,
    right: none,
  };
}

export async function generateInvoice(data: InvoiceData): Promise<Blob> {
  const subtotal = data.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;

  const hasPaymentDetails =
    data.paymentDetails &&
    (data.paymentDetails.bankName.trim() ||
      data.paymentDetails.accountNumber.trim() ||
      data.paymentDetails.sortCode.trim());

  // --- Header: Business name (left) + INVOICE (right) using a 2-col table ---
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: noBorders(),
            verticalAlign: VerticalAlign.BOTTOM,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.businessName,
                    bold: true,
                    size: 32,
                    color: DARK,
                  }),
                ],
              }),
              ...data.address.split("\n").map(
                (line) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: line.trim(),
                        size: 18,
                        color: GRAY_TEXT,
                      }),
                    ],
                  })
              ),
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.email,
                    size: 18,
                    color: GRAY_TEXT,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: noBorders(),
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "INVOICE",
                    bold: true,
                    size: 48,
                    color: BLUE,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 80 },
                children: [
                  new TextRun({
                    text: `Invoice #: `,
                    size: 18,
                    color: GRAY_TEXT,
                  }),
                  new TextRun({
                    text: data.invoiceNumber,
                    size: 18,
                    bold: true,
                    color: DARK,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `Date: `,
                    size: 18,
                    color: GRAY_TEXT,
                  }),
                  new TextRun({
                    text: data.invoiceDate,
                    size: 18,
                    color: DARK,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `Due Date: `,
                    size: 18,
                    color: GRAY_TEXT,
                  }),
                  new TextRun({
                    text: data.dueDate,
                    size: 18,
                    bold: true,
                    color: DARK,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // --- Bill To section ---
  const billToSection = [
    new Paragraph({
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: "BILL TO",
          bold: true,
          size: 18,
          color: BLUE,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 60 },
      children: [
        new TextRun({
          text: data.clientName,
          bold: true,
          size: 20,
          color: DARK,
        }),
      ],
    }),
    ...data.clientAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({
              text: line.trim(),
              size: 18,
              color: GRAY_TEXT,
            }),
          ],
        })
    ),
  ];

  // --- Line Items Table ---
  const cellMargins = {
    top: convertInchesToTwip(0.04),
    bottom: convertInchesToTwip(0.04),
    left: convertInchesToTwip(0.08),
    right: convertInchesToTwip(0.08),
  };

  const headerShading = {
    type: ShadingType.CLEAR,
    fill: HEADER_BG,
    color: HEADER_BG,
  };

  const headerBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: DARK },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 45, type: WidthType.PERCENTAGE },
        shading: headerShading,
        borders: headerBorders,
        margins: cellMargins,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Description",
                bold: true,
                size: 18,
                color: DARK,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 12, type: WidthType.PERCENTAGE },
        shading: headerShading,
        borders: headerBorders,
        margins: cellMargins,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Qty",
                bold: true,
                size: 18,
                color: DARK,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: headerShading,
        borders: headerBorders,
        margins: cellMargins,
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: "Unit Price",
                bold: true,
                size: 18,
                color: DARK,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 23, type: WidthType.PERCENTAGE },
        shading: headerShading,
        borders: headerBorders,
        margins: cellMargins,
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: "Total",
                bold: true,
                size: 18,
                color: DARK,
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const itemRows = data.lineItems.map(
    (item, index) =>
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders({
              bottom: index < data.lineItems.length - 1,
            }),
            margins: cellMargins,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.description,
                    size: 20,
                    color: DARK,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorders({
              bottom: index < data.lineItems.length - 1,
            }),
            margins: cellMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: String(item.quantity),
                    size: 20,
                    color: DARK,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorders({
              bottom: index < data.lineItems.length - 1,
            }),
            margins: cellMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: formatCurrency(item.unitPrice, data.currencySymbol),
                    size: 20,
                    color: DARK,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorders({
              bottom: index < data.lineItems.length - 1,
            }),
            margins: cellMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: formatCurrency(
                      item.quantity * item.unitPrice,
                      data.currencySymbol
                    ),
                    size: 20,
                    bold: true,
                    color: DARK,
                  }),
                ],
              }),
            ],
          }),
        ],
      })
  );

  const lineItemsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders(),
    rows: [headerRow, ...itemRows],
  });

  // --- Totals table (right-aligned, using a 2-col table) ---
  const totalsMargins = {
    top: convertInchesToTwip(0.03),
    bottom: convertInchesToTwip(0.03),
    left: convertInchesToTwip(0.1),
    right: convertInchesToTwip(0.1),
  };

  const totalsBorderNone = noBorders();

  const totalsTable = new Table({
    width: { size: 45, type: WidthType.PERCENTAGE },
    float: {
      horizontalAnchor: "margin" as unknown as undefined,
      absoluteHorizontalPosition: convertInchesToTwip(3.8),
    },
    borders: noBorders(),
    rows: [
      // Subtotal row
      new TableRow({
        children: [
          new TableCell({
            borders: totalsBorderNone,
            margins: totalsMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "Subtotal",
                    size: 20,
                    color: GRAY_TEXT,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: totalsBorderNone,
            margins: totalsMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: formatCurrency(subtotal, data.currencySymbol),
                    size: 20,
                    color: DARK,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      // Tax row
      new TableRow({
        children: [
          new TableCell({
            borders: totalsBorderNone,
            margins: totalsMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `Tax (${data.taxRate}%)`,
                    size: 20,
                    color: GRAY_TEXT,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: totalsBorderNone,
            margins: totalsMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: formatCurrency(tax, data.currencySymbol),
                    size: 20,
                    color: DARK,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      // Total row (highlighted)
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: 2,
                color: DARK,
              },
              bottom: {
                style: BorderStyle.SINGLE,
                size: 2,
                color: DARK,
              },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            margins: totalsMargins,
            shading: {
              type: ShadingType.CLEAR,
              fill: HEADER_BG,
              color: HEADER_BG,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "TOTAL",
                    bold: true,
                    size: 24,
                    color: DARK,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: 2,
                color: DARK,
              },
              bottom: {
                style: BorderStyle.SINGLE,
                size: 2,
                color: DARK,
              },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            margins: totalsMargins,
            shading: {
              type: ShadingType.CLEAR,
              fill: HEADER_BG,
              color: HEADER_BG,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: formatCurrency(total, data.currencySymbol),
                    bold: true,
                    size: 28,
                    color: BLUE,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // --- Payment Details ---
  const paymentSection: Paragraph[] = [];
  if (hasPaymentDetails) {
    const pd = data.paymentDetails!;
    paymentSection.push(
      new Paragraph({
        spacing: { before: 500 },
        children: [
          new TextRun({
            text: "PAYMENT DETAILS",
            bold: true,
            size: 18,
            color: BLUE,
          }),
        ],
      })
    );
    if (pd.bankName.trim()) {
      paymentSection.push(
        new Paragraph({
          spacing: { before: 60 },
          children: [
            new TextRun({ text: "Bank: ", size: 18, color: GRAY_TEXT }),
            new TextRun({
              text: pd.bankName,
              size: 18,
              color: DARK,
            }),
          ],
        })
      );
    }
    if (pd.accountNumber.trim()) {
      paymentSection.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Account Number: ",
              size: 18,
              color: GRAY_TEXT,
            }),
            new TextRun({
              text: pd.accountNumber,
              size: 18,
              color: DARK,
            }),
          ],
        })
      );
    }
    if (pd.sortCode.trim()) {
      paymentSection.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Sort Code / Routing #: ",
              size: 18,
              color: GRAY_TEXT,
            }),
            new TextRun({
              text: pd.sortCode,
              size: 18,
              color: DARK,
            }),
          ],
        })
      );
    }
  }

  // --- Notes ---
  const notesSection: Paragraph[] = [];
  if (data.notes.trim()) {
    notesSection.push(
      new Paragraph({
        spacing: { before: 500 },
        children: [
          new TextRun({
            text: "NOTES",
            bold: true,
            size: 18,
            color: BLUE,
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 60 },
        children: [
          new TextRun({
            text: data.notes,
            size: 18,
            color: GRAY_TEXT,
            italics: true,
          }),
        ],
      })
    );
  }

  // --- Footer ---
  const footer = new Paragraph({
    spacing: { before: 800 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Thank you for your business!",
        size: 20,
        color: GRAY_TEXT,
        italics: true,
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.8),
            },
          },
        },
        children: [
          headerTable,
          ...billToSection,
          new Paragraph({ spacing: { before: 300 }, children: [] }),
          lineItemsTable,
          new Paragraph({ spacing: { before: 200 }, children: [] }),
          totalsTable,
          ...paymentSection,
          ...notesSection,
          footer,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
