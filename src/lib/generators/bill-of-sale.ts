import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";

export interface BillOfSaleData {
  sellerName: string;
  sellerAddress: string;
  buyerName: string;
  buyerAddress: string;
  itemDescription: string;
  serialNumber: string;
  condition: string;
  salePrice: number;
  currency: string;
  currencySymbol: string;
  paymentMethod: string;
  saleDate: string;
  warranty: string;
  additionalTerms: string;
}

export async function generateBillOfSale(
  data: BillOfSaleData
): Promise<Blob> {
  const isAsIs = data.condition === "As-Is";

  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "BILL OF SALE",
          bold: true,
          size: 32,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `This Bill of Sale ("Agreement") is made on ${data.saleDate} by and between:`,
          size: 22,
        }),
      ],
    }),

    // Seller
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Seller: ", bold: true, size: 22 }),
        new TextRun({ text: data.sellerName, size: 22 }),
      ],
    }),
    ...data.sellerAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 20, color: "555555" }),
          ],
        })
    ),
    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // Buyer
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Buyer: ", bold: true, size: 22 }),
        new TextRun({ text: data.buyerName, size: 22 }),
      ],
    }),
    ...data.buyerAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 20, color: "555555" }),
          ],
        })
    ),
    new Paragraph({ spacing: { after: 300 }, children: [] }),

    // 1. Description of Item
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "1. DESCRIPTION OF ITEM",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `The Seller hereby sells, transfers, and delivers to the Buyer the following item ("Item"):`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Description: ", bold: true, size: 22 }),
        new TextRun({ text: data.itemDescription, size: 22 }),
      ],
    }),
    ...(data.serialNumber
      ? [
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "Serial Number: ",
                bold: true,
                size: 22,
              }),
              new TextRun({ text: data.serialNumber, size: 22 }),
            ],
          }),
        ]
      : []),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({ text: "Condition: ", bold: true, size: 22 }),
        new TextRun({ text: data.condition, size: 22 }),
      ],
    }),

    // 2. Purchase Price
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "2. PURCHASE PRICE", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The Buyer agrees to pay the Seller a total purchase price of ${data.currencySymbol}${data.salePrice.toLocaleString()} ("Purchase Price"). Payment shall be made by ${data.paymentMethod.toLowerCase()}.`,
          size: 22,
        }),
      ],
    }),

    // 3. Transfer of Ownership
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "3. TRANSFER OF OWNERSHIP",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "Upon receipt of the full Purchase Price, the Seller hereby transfers and conveys all right, title, and interest in the Item to the Buyer, free and clear of all liens, claims, and encumbrances.",
          size: 22,
        }),
      ],
    }),

    // 4. Seller's Representations
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "4. SELLER'S REPRESENTATIONS",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "The Seller represents and warrants that: (a) the Seller is the lawful owner of the Item; (b) the Seller has full right and authority to sell the Item; (c) the Item is free from any liens, encumbrances, or claims by third parties; (d) the Seller will defend the Buyer's title to the Item against all claims.",
          size: 22,
        }),
      ],
    }),
  ];

  // 5. AS-IS clause
  if (isAsIs) {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: '5. "AS-IS" CONDITION',
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: 'THE ITEM IS SOLD "AS-IS" AND "WHERE-IS" WITHOUT ANY WARRANTIES OR REPRESENTATIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. THE BUYER ACKNOWLEDGES THAT THEY HAVE HAD THE OPPORTUNITY TO INSPECT THE ITEM AND ACCEPTS IT IN ITS CURRENT CONDITION.',
            size: 22,
          }),
        ],
      })
    );
  }

  let clauseNum = isAsIs ? 6 : 5;

  // Warranty
  if (data.warranty !== "None") {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `${clauseNum}. WARRANTY`,
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: `The Seller provides a warranty period of ${data.warranty} from the date of sale. During this period, the Seller shall repair or replace the Item if it is found to be defective in materials or workmanship under normal use. This warranty does not cover damage caused by misuse, neglect, or unauthorized modifications.`,
            size: 22,
          }),
        ],
      })
    );
    clauseNum++;
  }

  // Additional Terms
  if (data.additionalTerms) {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `${clauseNum}. ADDITIONAL TERMS`,
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({ text: data.additionalTerms, size: 22 }),
        ],
      })
    );
    clauseNum++;
  }

  // Entire Agreement
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `${clauseNum}. ENTIRE AGREEMENT`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "This Bill of Sale constitutes the entire agreement between the parties regarding the sale of the Item and supersedes all prior agreements, discussions, and understandings.",
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
          text: "IN WITNESS WHEREOF, the parties have executed this Bill of Sale.",
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
        new TextRun({ text: `${data.sellerName} (Seller)`, size: 22 }),
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
        new TextRun({ text: `${data.buyerName} (Buyer)`, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: "Date: _______________", size: 22 })],
    })
  );

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBlob(doc);
}
