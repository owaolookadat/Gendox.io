import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  TabStopPosition,
  TabStopType,
  BorderStyle,
} from "docx";

export interface NDAData {
  agreementType: string;
  disclosingPartyName: string;
  disclosingPartyTitle: string;
  disclosingPartyAddress: string;
  receivingPartyName: string;
  receivingPartyTitle: string;
  receivingPartyAddress: string;
  effectiveDate: string;
  purpose: string;
  confidentialInfoDefinition: string;
  duration: string;
  governingLaw: string;
  additionalClauses: string;
}

function sectionHeading(number: string, title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 360, after: 160 },
    children: [
      new TextRun({
        text: `${number}. ${title}`,
        bold: true,
        size: 24,
        font: "Calibri",
      }),
    ],
  });
}

function bodyParagraph(text: string, spacingAfter = 200): Paragraph {
  return new Paragraph({
    spacing: { after: spacingAfter },
    children: [
      new TextRun({
        text,
        size: 22,
        font: "Calibri",
      }),
    ],
  });
}

function numberedSubParagraph(
  section: string,
  sub: string,
  text: string
): Paragraph {
  return new Paragraph({
    spacing: { after: 120 },
    indent: { left: 360 },
    children: [
      new TextRun({
        text: `${section}.${sub} `,
        bold: true,
        size: 22,
        font: "Calibri",
      }),
      new TextRun({
        text,
        size: 22,
        font: "Calibri",
      }),
    ],
  });
}

function signatureBlock(
  name: string,
  label: string
): Paragraph[] {
  return [
    new Paragraph({ spacing: { before: 480 }, children: [] }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: label.toUpperCase(),
          bold: true,
          size: 22,
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 20 }, children: [] }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: "Signature: ", size: 22, font: "Calibri" }),
        new TextRun({ text: "______________________________", size: 22, font: "Calibri" }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: "Name: ", size: 22, font: "Calibri" }),
        new TextRun({ text: name || "______________________________", size: 22, font: "Calibri" }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: "Title: ", size: 22, font: "Calibri" }),
        new TextRun({ text: "______________________________", size: 22, font: "Calibri" }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: "Date: ", size: 22, font: "Calibri" }),
        new TextRun({ text: "______________________________", size: 22, font: "Calibri" }),
      ],
    }),
  ];
}

export async function generateNDA(data: NDAData): Promise<Blob> {
  const isMutual = data.agreementType === "Mutual";
  const partyALabel = isMutual ? "Party A" : "the Disclosing Party";
  const partyBLabel = isMutual ? "Party B" : "the Receiving Party";
  const bothLabel = isMutual
    ? "each party"
    : "the Receiving Party";
  const discloserRef = isMutual
    ? "the disclosing party"
    : "the Disclosing Party";
  const receiverRef = isMutual
    ? "the receiving party"
    : "the Receiving Party";

  const children: Paragraph[] = [];

  // ── Title ──
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: isMutual
            ? "MUTUAL NON-DISCLOSURE AGREEMENT"
            : "NON-DISCLOSURE AGREEMENT",
          bold: true,
          size: 28,
          font: "Calibri",
        }),
      ],
    })
  );

  // ── Horizontal rule ──
  children.push(
    new Paragraph({
      spacing: { after: 300 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 1 },
      },
      children: [],
    })
  );

  // ── Opening recital ──
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `This Non-Disclosure Agreement (the "Agreement") is entered into as of `,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: data.effectiveDate || "[DATE]",
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: ` (the "Effective Date") by and between:`,
          size: 22,
          font: "Calibri",
        }),
      ],
    })
  );

  // ── Party A ──
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [
        new TextRun({
          text: `${isMutual ? "Party A" : "Disclosing Party"}: `,
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: data.disclosingPartyName || "[NAME]",
          size: 22,
          font: "Calibri",
        }),
        ...(data.disclosingPartyTitle
          ? [
              new TextRun({ text: ", ", size: 22, font: "Calibri" }),
              new TextRun({
                text: data.disclosingPartyTitle,
                italics: true,
                size: 22,
                font: "Calibri",
              }),
            ]
          : []),
      ],
    })
  );
  if (data.disclosingPartyAddress) {
    data.disclosingPartyAddress.split("\n").forEach((line) => {
      children.push(
        new Paragraph({
          indent: { left: 360 },
          children: [
            new TextRun({
              text: line.trim(),
              size: 20,
              color: "555555",
              font: "Calibri",
            }),
          ],
        })
      );
    });
  }

  // ── Party B ──
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [
        new TextRun({
          text: `${isMutual ? "Party B" : "Receiving Party"}: `,
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: data.receivingPartyName || "[NAME]",
          size: 22,
          font: "Calibri",
        }),
        ...(data.receivingPartyTitle
          ? [
              new TextRun({ text: ", ", size: 22, font: "Calibri" }),
              new TextRun({
                text: data.receivingPartyTitle,
                italics: true,
                size: 22,
                font: "Calibri",
              }),
            ]
          : []),
      ],
    })
  );
  if (data.receivingPartyAddress) {
    data.receivingPartyAddress.split("\n").forEach((line) => {
      children.push(
        new Paragraph({
          indent: { left: 360 },
          children: [
            new TextRun({
              text: line.trim(),
              size: 20,
              color: "555555",
              font: "Calibri",
            }),
          ],
        })
      );
    });
  }

  // ── WHEREAS ──
  children.push(
    new Paragraph({
      spacing: { before: 300, after: 200 },
      children: [
        new TextRun({
          text: isMutual
            ? `WHEREAS, each party possesses certain confidential and proprietary information and the parties wish to disclose such information to each other for the purpose of ${data.purpose || "[PURPOSE]"} (the "Purpose");`
            : `WHEREAS, ${data.disclosingPartyName || "the Disclosing Party"} possesses certain confidential and proprietary information and wishes to disclose such information to ${data.receivingPartyName || "the Receiving Party"} for the purpose of ${data.purpose || "[PURPOSE]"} (the "Purpose");`,
          size: 22,
          font: "Calibri",
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "NOW, THEREFORE, in consideration of the mutual covenants and agreements herein contained, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:",
          size: 22,
          font: "Calibri",
        }),
      ],
    })
  );

  // ── 1. DEFINITIONS ──
  children.push(sectionHeading("1", "DEFINITIONS"));

  children.push(
    numberedSubParagraph(
      "1",
      "1",
      `"Confidential Information" means ${data.confidentialInfoDefinition}`
    )
  );

  children.push(
    numberedSubParagraph(
      "1",
      "2",
      `"Disclosing Party" means the party disclosing Confidential Information${isMutual ? ". Under this Mutual Agreement, each party may act as a Disclosing Party" : `, namely ${data.disclosingPartyName || "[DISCLOSING PARTY]"}`}.`
    )
  );

  children.push(
    numberedSubParagraph(
      "1",
      "3",
      `"Receiving Party" means the party receiving Confidential Information${isMutual ? ". Under this Mutual Agreement, each party may act as a Receiving Party" : `, namely ${data.receivingPartyName || "[RECEIVING PARTY]"}`}.`
    )
  );

  children.push(
    numberedSubParagraph(
      "1",
      "4",
      `"Representatives" means a party's officers, directors, employees, agents, advisors, consultants, and other representatives who have a need to know the Confidential Information for the Purpose.`
    )
  );

  // ── 2. OBLIGATIONS ──
  children.push(sectionHeading("2", "OBLIGATIONS OF RECEIVING PARTY"));

  children.push(
    numberedSubParagraph(
      "2",
      "1",
      `${isMutual ? "Each party, when acting as a Receiving Party," : "The Receiving Party"} shall hold and maintain all Confidential Information in strict confidence and shall not, without the prior written consent of the Disclosing Party, disclose any Confidential Information to any person or entity, except to its Representatives who need to know such information for the Purpose.`
    )
  );

  children.push(
    numberedSubParagraph(
      "2",
      "2",
      `${isMutual ? "Each party" : "The Receiving Party"} shall use the Confidential Information solely for the Purpose and shall not use it for any other purpose without the prior written consent of the Disclosing Party.`
    )
  );

  children.push(
    numberedSubParagraph(
      "2",
      "3",
      `${isMutual ? "Each party" : "The Receiving Party"} shall protect the Confidential Information with the same degree of care it uses to protect its own confidential information of a similar nature, but in no event less than reasonable care.`
    )
  );

  children.push(
    numberedSubParagraph(
      "2",
      "4",
      `${isMutual ? "Each party" : "The Receiving Party"} shall be responsible for any breach of this Agreement by its Representatives and shall ensure that its Representatives are bound by obligations of confidentiality no less restrictive than those contained herein.`
    )
  );

  // ── 3. EXCLUSIONS ──
  children.push(sectionHeading("3", "EXCLUSIONS FROM CONFIDENTIAL INFORMATION"));

  children.push(
    bodyParagraph(
      "The obligations set forth in Section 2 shall not apply to any information that:"
    )
  );

  children.push(
    numberedSubParagraph(
      "3",
      "1",
      "is or becomes generally available to the public other than as a result of a breach of this Agreement by the Receiving Party or its Representatives;"
    )
  );
  children.push(
    numberedSubParagraph(
      "3",
      "2",
      "was already in the possession of the Receiving Party prior to disclosure by the Disclosing Party, as evidenced by written records;"
    )
  );
  children.push(
    numberedSubParagraph(
      "3",
      "3",
      "is independently developed by the Receiving Party without use of or reference to the Confidential Information, as evidenced by written records;"
    )
  );
  children.push(
    numberedSubParagraph(
      "3",
      "4",
      "is rightfully received by the Receiving Party from a third party who is not under any obligation of confidentiality with respect to such information; or"
    )
  );
  children.push(
    numberedSubParagraph(
      "3",
      "5",
      "is required to be disclosed by law, regulation, or order of a court or governmental authority, provided that the Receiving Party gives prompt written notice to the Disclosing Party of such requirement prior to disclosure (to the extent permitted by law) and cooperates with any effort to obtain protective treatment of such information."
    )
  );

  // ── 4. TERM ──
  children.push(sectionHeading("4", "TERM AND TERMINATION"));

  children.push(
    numberedSubParagraph(
      "4",
      "1",
      `This Agreement shall commence on the Effective Date and shall remain in effect for a period of ${data.duration} from the Effective Date${data.duration === "Indefinite" ? "." : ", unless terminated earlier by either party upon thirty (30) days' prior written notice to the other party."}`
    )
  );

  children.push(
    numberedSubParagraph(
      "4",
      "2",
      `The obligations of confidentiality set forth herein shall survive termination or expiration of this Agreement for a period of ${data.duration === "Indefinite" ? "an indefinite period" : data.duration} following the date of termination or expiration.`
    )
  );

  children.push(
    numberedSubParagraph(
      "4",
      "3",
      "Upon termination or expiration of this Agreement, or upon written request by the Disclosing Party, the Receiving Party shall promptly return or destroy all Confidential Information and all copies, extracts, or summaries thereof, and shall provide written certification of such return or destruction."
    )
  );

  // ── 5. REMEDIES ──
  children.push(sectionHeading("5", "REMEDIES"));

  children.push(
    numberedSubParagraph(
      "5",
      "1",
      `${isMutual ? "Each party acknowledges" : "The Receiving Party acknowledges"} that any breach or threatened breach of this Agreement may cause irreparable harm to the Disclosing Party for which monetary damages would be an inadequate remedy.`
    )
  );

  children.push(
    numberedSubParagraph(
      "5",
      "2",
      "Accordingly, the Disclosing Party shall be entitled to seek equitable relief, including injunction and specific performance, in addition to all other remedies available at law or in equity, without the necessity of proving actual damages or posting any bond or other security."
    )
  );

  children.push(
    numberedSubParagraph(
      "5",
      "3",
      "No failure or delay by the Disclosing Party in exercising any right, power, or privilege under this Agreement shall operate as a waiver thereof, nor shall any single or partial exercise preclude any other or further exercise of any right, power, or privilege."
    )
  );

  // ── 6. GENERAL PROVISIONS ──
  children.push(sectionHeading("6", "GENERAL PROVISIONS"));

  children.push(
    numberedSubParagraph(
      "6",
      "1",
      "Entire Agreement. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, representations, and understandings, whether written or oral."
    )
  );

  children.push(
    numberedSubParagraph(
      "6",
      "2",
      "Amendment. This Agreement may not be amended or modified except by a written instrument signed by both parties."
    )
  );

  children.push(
    numberedSubParagraph(
      "6",
      "3",
      "Assignment. Neither party may assign or transfer this Agreement or any rights or obligations hereunder without the prior written consent of the other party."
    )
  );

  children.push(
    numberedSubParagraph(
      "6",
      "4",
      "Severability. If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect."
    )
  );

  children.push(
    numberedSubParagraph(
      "6",
      "5",
      "No Licence. Nothing in this Agreement grants the Receiving Party any licence or right to use the Confidential Information except as expressly set forth herein."
    )
  );

  children.push(
    numberedSubParagraph(
      "6",
      "6",
      "Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, and all of which together shall constitute one and the same instrument."
    )
  );

  // ── 7. GOVERNING LAW ──
  children.push(sectionHeading("7", "GOVERNING LAW AND JURISDICTION"));

  children.push(
    numberedSubParagraph(
      "7",
      "1",
      `This Agreement shall be governed by and construed in accordance with the laws of ${data.governingLaw || "[JURISDICTION]"}, without regard to its conflict of laws principles.`
    )
  );

  children.push(
    numberedSubParagraph(
      "7",
      "2",
      `The parties hereby submit to the exclusive jurisdiction of the courts of ${data.governingLaw || "[JURISDICTION]"} for the resolution of any disputes arising out of or relating to this Agreement.`
    )
  );

  // ── Additional Clauses ──
  if (data.additionalClauses) {
    children.push(sectionHeading("8", "ADDITIONAL PROVISIONS"));
    // Split by double newlines to create separate paragraphs
    data.additionalClauses.split(/\n\n+/).forEach((clause, i) => {
      children.push(
        numberedSubParagraph("8", String(i + 1), clause.trim())
      );
    });
  }

  // ── Signature block ──
  children.push(
    new Paragraph({ spacing: { before: 480 }, children: [] }),
    new Paragraph({
      spacing: { after: 200 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 1 },
      },
      children: [],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "IN WITNESS WHEREOF, the parties hereto have executed this Non-Disclosure Agreement as of the Effective Date first written above.",
          bold: true,
          size: 22,
          font: "Calibri",
        }),
      ],
    })
  );

  children.push(
    ...signatureBlock(
      data.disclosingPartyName,
      isMutual ? "Party A" : "Disclosing Party"
    )
  );

  children.push(
    ...signatureBlock(
      data.receivingPartyName,
      isMutual ? "Party B" : "Receiving Party"
    )
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
