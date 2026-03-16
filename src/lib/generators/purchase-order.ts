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

export interface POLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrderData {
  companyName: string;
  companyAddress: string;
  vendorName: string;
  vendorAddress: string;
  poNumber: string;
  orderDate: string;
  deliveryDate: string;
  currency: string;
  currencySymbol: string;
  lineItems: POLineItem[];
  shippingCost: number;
  taxRate: number;
  paymentTerms: string;
  specialInstructions: string;
}

function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${amount.toFixed(2)}`;
}

export async function generatePurchaseOrder(
  data: PurchaseOrderData
): Promise<Blob> {
  const subtotal = data.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax + data.shippingCost;

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
          // Company Name
          new Paragraph({
            children: [
              new TextRun({ text: data.companyName, bold: true, size: 28 }),
            ],
          }),
          ...data.companyAddress.split("\n").map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({ text: line.trim(), size: 20, color: "555555" }),
                ],
              })
          ),
          new Paragraph({ spacing: { after: 400 }, children: [] }),

          // PURCHASE ORDER heading
          new Paragraph({
            children: [
              new TextRun({
                text: "PURCHASE ORDER",
                bold: true,
                size: 36,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
          }),

          // PO details
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `PO Number: ${data.poNumber}`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `Order Date: ${data.orderDate}`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `Delivery Date: ${data.deliveryDate}`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `Payment Terms: ${data.paymentTerms}`,
                size: 20,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Vendor
          new Paragraph({
            children: [
              new TextRun({
                text: "Vendor:",
                bold: true,
                size: 22,
                color: "333333",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: data.vendorName, bold: true, size: 20 }),
            ],
          }),
          ...data.vendorAddress.split("\n").map(
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
          // Shipping
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: "Shipping: ", size: 20 }),
              new TextRun({
                text: formatCurrency(data.shippingCost, data.currencySymbol),
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

          // Special Instructions
          ...(data.specialInstructions
            ? [
                new Paragraph({
                  spacing: { before: 600 },
                  children: [
                    new TextRun({
                      text: "Special Instructions:",
                      bold: true,
                      size: 20,
                      color: "333333",
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: data.specialInstructions,
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
