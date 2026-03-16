import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  TabStopPosition,
  TabStopType,
} from "docx";

export interface QuotationLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuotationData {
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  clientName: string;
  clientAddress: string;
  quoteNumber: string;
  quoteDate: string;
  validUntil: string;
  currency: string;
  currencySymbol: string;
  lineItems: QuotationLineItem[];
  discountRate: number;
  taxRate: number;
  termsAndConditions: string;
  notes: string;
}

function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${amount.toFixed(2)}`;
}

export async function generateQuotation(
  data: QuotationData
): Promise<Blob> {
  const subtotal = data.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const discount = subtotal * (data.discountRate / 100);
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * (data.taxRate / 100);
  const total = afterDiscount + tax;

  const tabStops = [
    { type: TabStopType.LEFT, position: TabStopPosition.MAX * 0.55 },
    { type: TabStopType.RIGHT, position: TabStopPosition.MAX * 0.72 },
    { type: TabStopType.RIGHT, position: TabStopPosition.MAX * 0.88 },
  ];

  const thinBorder = {
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  };

  const doc = new Document({
    sections: [
      {
        children: [
          // Business Name
          new Paragraph({
            children: [
              new TextRun({ text: data.businessName, bold: true, size: 28 }),
            ],
          }),
          ...data.businessAddress.split("\n").map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({ text: line.trim(), size: 20, color: "555555" }),
                ],
              })
          ),
          new Paragraph({
            children: [
              new TextRun({
                text: data.businessEmail,
                size: 20,
                color: "555555",
              }),
            ],
            spacing: { after: 400 },
          }),

          // QUOTATION heading
          new Paragraph({
            children: [
              new TextRun({ text: "QUOTATION", bold: true, size: 36 }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
          }),

          // Quote details
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `Quote Number: ${data.quoteNumber}`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `Date: ${data.quoteDate}`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `Valid Until: ${data.validUntil}`,
                size: 20,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Client
          new Paragraph({
            children: [
              new TextRun({
                text: "Prepared For:",
                bold: true,
                size: 22,
                color: "333333",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: data.clientName, bold: true, size: 20 }),
            ],
          }),
          ...data.clientAddress.split("\n").map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({ text: line.trim(), size: 20, color: "555555" }),
                ],
              })
          ),
          new Paragraph({ spacing: { after: 400 }, children: [] }),

          // Table header
          new Paragraph({
            tabStops,
            border: thinBorder,
            spacing: { after: 100 },
            children: [
              new TextRun({ text: "Description", bold: true, size: 20 }),
              new TextRun({ text: "\t", bold: true }),
              new TextRun({ text: "Qty", bold: true, size: 20 }),
              new TextRun({ text: "\t", bold: true }),
              new TextRun({ text: "Unit Price", bold: true, size: 20 }),
              new TextRun({ text: "\t", bold: true }),
              new TextRun({ text: "Total", bold: true, size: 20 }),
            ],
          }),

          // Line items
          ...data.lineItems.map(
            (item) =>
              new Paragraph({
                tabStops,
                border: thinBorder,
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: item.description, size: 20 }),
                  new TextRun({ text: "\t" }),
                  new TextRun({ text: String(item.quantity), size: 20 }),
                  new TextRun({ text: "\t" }),
                  new TextRun({
                    text: formatCurrency(item.unitPrice, data.currencySymbol),
                    size: 20,
                  }),
                  new TextRun({ text: "\t" }),
                  new TextRun({
                    text: formatCurrency(
                      item.quantity * item.unitPrice,
                      data.currencySymbol
                    ),
                    size: 20,
                  }),
                ],
              })
          ),

          new Paragraph({ spacing: { after: 200 }, children: [] }),

          // Subtotal
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: "Subtotal: ", size: 20 }),
              new TextRun({
                text: formatCurrency(subtotal, data.currencySymbol),
                bold: true,
                size: 20,
              }),
            ],
          }),
          // Discount
          ...(data.discountRate > 0
            ? [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `Discount (${data.discountRate}%): -`,
                      size: 20,
                    }),
                    new TextRun({
                      text: formatCurrency(discount, data.currencySymbol),
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ]
            : []),
          // Tax
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `Tax (${data.taxRate}%): `,
                size: 20,
              }),
              new TextRun({
                text: formatCurrency(tax, data.currencySymbol),
                bold: true,
                size: 20,
              }),
            ],
          }),
          // Total
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 100 },
            children: [
              new TextRun({ text: "Total: ", bold: true, size: 24 }),
              new TextRun({
                text: formatCurrency(total, data.currencySymbol),
                bold: true,
                size: 24,
              }),
            ],
            border: {
              top: { style: BorderStyle.SINGLE, size: 2, color: "333333" },
            },
          }),

          // Terms & Conditions
          ...(data.termsAndConditions
            ? [
                new Paragraph({
                  spacing: { before: 600 },
                  children: [
                    new TextRun({
                      text: "Terms & Conditions:",
                      bold: true,
                      size: 20,
                      color: "333333",
                    }),
                  ],
                }),
                ...data.termsAndConditions.split("\n").map(
                  (line) =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: line.trim(),
                          size: 20,
                          color: "555555",
                        }),
                      ],
                    })
                ),
              ]
            : []),

          // Notes
          ...(data.notes
            ? [
                new Paragraph({
                  spacing: { before: 400 },
                  children: [
                    new TextRun({
                      text: "Notes:",
                      bold: true,
                      size: 20,
                      color: "333333",
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: data.notes,
                      size: 20,
                      color: "555555",
                    }),
                  ],
                }),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
