import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export interface PowerOfAttorneyData {
  principalName: string;
  principalAddress: string;
  agentName: string;
  agentAddress: string;
  poaType: string;
  effectiveDate: string;
  expirationDate: string;
  specificPowers: string;
  limitations: string;
  governingLaw: string;
  witnessRequired: boolean;
}

export async function generatePowerOfAttorney(
  data: PowerOfAttorneyData
): Promise<Blob> {
  let poaTypeDescription = "";
  switch (data.poaType) {
    case "General":
      poaTypeDescription =
        "This is a General Power of Attorney. The Agent is granted broad authority to act on behalf of the Principal in all financial, legal, and personal matters, unless specifically limited herein.";
      break;
    case "Limited":
      poaTypeDescription =
        "This is a Limited (Special) Power of Attorney. The Agent is granted authority to act on behalf of the Principal only in the specific matters described below.";
      break;
    case "Durable":
      poaTypeDescription =
        "This is a Durable Power of Attorney. This power of attorney shall not be affected by the subsequent disability or incapacity of the Principal, and shall remain in full force and effect unless revoked by the Principal.";
      break;
    case "Springing":
      poaTypeDescription =
        "This is a Springing Power of Attorney. This power of attorney shall become effective only upon the occurrence of a specified event, such as the disability or incapacity of the Principal, as determined by a licensed physician.";
      break;
    default:
      poaTypeDescription =
        "The Agent is granted authority to act on behalf of the Principal as described herein.";
  }

  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${data.poaType.toUpperCase()} POWER OF ATTORNEY`,
          bold: true,
          size: 36,
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: `Effective Date: ${data.effectiveDate}`,
          size: 22,
          color: "555555",
        }),
      ],
    }),

    // Know All Men
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "KNOW ALL PERSONS BY THESE PRESENTS:",
          bold: true,
          size: 22,
        }),
      ],
    }),

    // Principal
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "I, ", size: 22 }),
        new TextRun({ text: data.principalName, bold: true, size: 22 }),
        new TextRun({
          text: ' (the "Principal"), residing at:',
          size: 22,
        }),
      ],
    }),

    ...data.principalAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 22, color: "555555" }),
          ],
        })
    ),

    // Agent
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "do hereby appoint ",
          size: 22,
        }),
        new TextRun({ text: data.agentName, bold: true, size: 22 }),
        new TextRun({
          text: ' (the "Agent"), residing at:',
          size: 22,
        }),
      ],
    }),

    ...data.agentAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 22, color: "555555" }),
          ],
        })
    ),

    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "as my true and lawful attorney-in-fact, to act in my name, place, and stead, in any and all of the following matters, as each of them are defined and described herein.",
          size: 22,
        }),
      ],
    }),

    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // Type of POA
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "1. TYPE OF POWER OF ATTORNEY",
          bold: true,
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: poaTypeDescription, size: 22 }),
      ],
    }),

    // Powers Granted
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "2. SPECIFIC POWERS GRANTED",
          bold: true,
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "The Agent is hereby authorized to perform the following acts on behalf of the Principal:",
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: data.specificPowers, size: 22 }),
      ],
    }),
  ];

  // Limitations
  if (data.limitations.trim()) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "3. LIMITATIONS",
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "The following limitations apply to the powers granted herein:",
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: data.limitations, size: 22 }),
        ],
      })
    );
  }

  const nextClause = data.limitations.trim() ? 4 : 3;

  // Duration
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${nextClause}. DURATION`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: data.expirationDate
            ? `This Power of Attorney shall become effective on ${data.effectiveDate} and shall remain in effect until ${data.expirationDate}, unless earlier revoked by the Principal.`
            : `This Power of Attorney shall become effective on ${data.effectiveDate} and shall remain in effect until revoked by the Principal.`,
          size: 22,
        }),
      ],
    })
  );

  // Revocation
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${nextClause + 1}. REVOCATION`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "The Principal reserves the right to revoke this Power of Attorney at any time by providing written notice to the Agent.",
          size: 22,
        }),
      ],
    })
  );

  // Governing Law
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${nextClause + 2}. GOVERNING LAW`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `This Power of Attorney shall be governed by and construed in accordance with the laws of ${data.governingLaw}.`,
          size: 22,
        }),
      ],
    })
  );

  // Signatures
  children.push(
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "IN WITNESS WHEREOF, I have hereunto set my hand on this date.",
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
          text: `${data.principalName} (Principal)`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100 },
      children: [
        new TextRun({ text: `Date: ${data.effectiveDate}`, size: 22 }),
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
          text: `${data.agentName} (Agent - Acknowledgment of Appointment)`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100 },
      children: [
        new TextRun({ text: "Date: __________________", size: 22 }),
      ],
    })
  );

  // Witness section
  if (data.witnessRequired) {
    children.push(
      new Paragraph({ spacing: { after: 400 }, children: [] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "WITNESSES:", bold: true, size: 22 }),
        ],
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),
      new Paragraph({
        children: [
          new TextRun({ text: "Witness 1:", bold: true, size: 20 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Signature: ____________________________",
            size: 20,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Printed Name: _________________________",
            size: 20,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Date: ________________________________",
            size: 20,
          }),
        ],
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),
      new Paragraph({
        children: [
          new TextRun({ text: "Witness 2:", bold: true, size: 20 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Signature: ____________________________",
            size: 20,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Printed Name: _________________________",
            size: 20,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Date: ________________________________",
            size: 20,
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return await Packer.toBlob(doc);
}
