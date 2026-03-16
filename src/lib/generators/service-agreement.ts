import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";

export interface ServiceAgreementData {
  providerName: string;
  providerAddress: string;
  clientName: string;
  clientAddress: string;
  effectiveDate: string;
  serviceDescription: string;
  deliverables: string;
  paymentAmount: string;
  paymentSchedule: string;
  termDuration: string;
  terminationNoticePeriod: string;
  liabilityLimitation: string;
  governingLaw: string;
}

export async function generateServiceAgreement(
  data: ServiceAgreementData
): Promise<Blob> {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "SERVICE AGREEMENT",
          bold: true,
          size: 32,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `This Service Agreement ("Agreement") is entered into as of ${data.effectiveDate} ("Effective Date") by and between:`,
          size: 22,
        }),
      ],
    }),

    // Provider
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Service Provider: ", bold: true, size: 22 }),
        new TextRun({ text: data.providerName, size: 22 }),
      ],
    }),
    ...data.providerAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 20, color: "555555" }),
          ],
        })
    ),
    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // Client
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Client: ", bold: true, size: 22 }),
        new TextRun({ text: data.clientName, size: 22 }),
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
    new Paragraph({ spacing: { after: 300 }, children: [] }),

    // 1. Scope of Services
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "1. SCOPE OF SERVICES", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The Service Provider agrees to provide the following services to the Client: ${data.serviceDescription}`,
          size: 22,
        }),
      ],
    }),

    // 2. Deliverables
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "2. DELIVERABLES", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The Service Provider shall deliver the following: ${data.deliverables}`,
          size: 22,
        }),
      ],
    }),

    // 3. Payment
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "3. PAYMENT TERMS", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The Client agrees to pay the Service Provider ${data.paymentAmount}. Payment shall be made ${data.paymentSchedule.toLowerCase()}. All invoices are due within 30 days of receipt unless otherwise agreed in writing.`,
          size: 22,
        }),
      ],
    }),

    // 4. Term
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "4. TERM AND DURATION", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `This Agreement shall commence on the Effective Date and shall remain in effect for ${data.termDuration}, unless terminated earlier in accordance with the terms herein.`,
          size: 22,
        }),
      ],
    }),

    // 5. Termination
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "5. TERMINATION", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `Either party may terminate this Agreement by providing ${data.terminationNoticePeriod} written notice to the other party. In the event of termination, the Client shall pay the Service Provider for all services rendered up to the date of termination.`,
          size: 22,
        }),
      ],
    }),

    // 6. Intellectual Property
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "6. INTELLECTUAL PROPERTY", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "All intellectual property created by the Service Provider in the course of performing the services shall belong to the Client upon full payment. The Service Provider retains the right to use general knowledge, skills, and experience gained during the performance of the services.",
          size: 22,
        }),
      ],
    }),

    // 7. Confidentiality
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "7. CONFIDENTIALITY", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "Both parties agree to keep confidential all information received from the other party that is not publicly available. This obligation shall survive the termination of this Agreement.",
          size: 22,
        }),
      ],
    }),

    // 8. Liability
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "8. LIMITATION OF LIABILITY",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: data.liabilityLimitation ||
            "To the maximum extent permitted by law, neither party shall be liable for any indirect, incidental, special, or consequential damages arising out of or related to this Agreement. The total liability of either party shall not exceed the total amount paid or payable under this Agreement.",
          size: 22,
        }),
      ],
    }),

    // 9. Governing Law
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "9. GOVERNING LAW", bold: true, size: 22 }),
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

    // 10. Entire Agreement
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "10. ENTIRE AGREEMENT", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, warranties, commitments, offers, and agreements, whether written or oral.",
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
          text: "IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.",
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
          text: `${data.providerName} (Service Provider)`,
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
        new TextRun({ text: `${data.clientName} (Client)`, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: "Date: _______________", size: 22 })],
    }),
  ];

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBlob(doc);
}
