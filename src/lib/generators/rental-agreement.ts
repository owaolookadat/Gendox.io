import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  TabStopPosition,
  TabStopType,
} from "docx";

export interface RentalAgreementData {
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  tenantAddress: string;
  propertyAddress: string;
  propertyType: string;
  monthlyRent: number;
  currency: string;
  currencySymbol: string;
  securityDeposit: number;
  leaseStartDate: string;
  leaseEndDate: string;
  paymentDueDay: string;
  paymentMethod: string;
  lateFee: string;
  renewalTerms: string;
  utilitiesIncluded: string;
  petPolicy: string;
  additionalTerms: string;
}

function sectionHeading(number: number, title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 300, after: 120 },
    children: [
      new TextRun({
        text: `${number}. ${title}`,
        bold: true,
        size: 24,
        font: "Arial",
      }),
    ],
  });
}

function bodyParagraph(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({
        text,
        size: 22,
        font: "Arial",
      }),
    ],
  });
}

function subClause(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 100 },
    indent: { left: 360 },
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        size: 22,
        font: "Arial",
      }),
      new TextRun({
        text: value,
        size: 22,
        font: "Arial",
      }),
    ],
  });
}

function emptyLine(): Paragraph {
  return new Paragraph({ spacing: { after: 100 }, children: [] });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "_______________";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getRenewalText(renewalTerms: string): string {
  switch (renewalTerms) {
    case "Month-to-Month":
      return "Upon expiration of the initial term, this Agreement shall automatically renew on a month-to-month basis under the same terms and conditions, unless either party provides at least 30 days written notice of intent to terminate.";
    case "Fixed":
      return "This Agreement shall not automatically renew. Any renewal or extension must be agreed upon in writing by both parties prior to the expiration of the lease term.";
    case "None":
    default:
      return "Upon expiration of the lease term, the Tenant shall vacate the Premises unless a new agreement is executed by both parties.";
  }
}

function getPaymentMethodText(method: string): string {
  switch (method) {
    case "Bank Transfer":
      return "bank transfer to an account designated by the Landlord";
    case "Cash":
      return "cash payment with a written receipt provided by the Landlord";
    case "Check":
      return "check made payable to the Landlord";
    case "Standing Order":
      return "standing order or direct debit to the Landlord's designated bank account";
    default:
      return "a method agreed upon by both parties";
  }
}

export async function generateRentalAgreement(
  data: RentalAgreementData
): Promise<Blob> {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const children: Paragraph[] = [
    // Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "RESIDENTIAL RENTAL AGREEMENT",
          bold: true,
          size: 28,
          font: "Arial",
        }),
      ],
    }),

    // Decorative line
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "________________________________________",
          size: 22,
          color: "999999",
          font: "Arial",
        }),
      ],
    }),

    // Legal intro
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `This Rental Agreement ("Agreement") is made and entered into as of `,
          size: 22,
          font: "Arial",
        }),
        new TextRun({
          text: today,
          bold: true,
          size: 22,
          font: "Arial",
        }),
        new TextRun({
          text: `, by and between the following parties, who agree to be bound by the terms and conditions set forth herein.`,
          size: 22,
          font: "Arial",
        }),
      ],
    }),

    // ─── 1. PARTIES ───
    sectionHeading(1, "PARTIES"),
    bodyParagraph(
      "This Agreement is entered into between the following parties:"
    ),
    subClause("Landlord", data.landlordName),
    ...data.landlordAddress
      .split("\n")
      .filter((l) => l.trim())
      .map(
        (line) =>
          new Paragraph({
            indent: { left: 360 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: line.trim(),
                size: 20,
                color: "444444",
                font: "Arial",
              }),
            ],
          })
      ),
    emptyLine(),
    subClause("Tenant", data.tenantName),
    ...data.tenantAddress
      .split("\n")
      .filter((l) => l.trim())
      .map(
        (line) =>
          new Paragraph({
            indent: { left: 360 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: line.trim(),
                size: 20,
                color: "444444",
                font: "Arial",
              }),
            ],
          })
      ),

    // ─── 2. PROPERTY ───
    sectionHeading(2, "PROPERTY"),
    bodyParagraph(
      `The Landlord hereby agrees to lease to the Tenant the following property ("Premises"):`
    ),
    subClause("Property Type", data.propertyType),
    subClause("Address", data.propertyAddress),
    bodyParagraph(
      "The Premises shall be used exclusively for residential purposes. The Tenant shall not use the Premises for any commercial, illegal, or hazardous activity."
    ),

    // ─── 3. TERM ───
    sectionHeading(3, "TERM"),
    bodyParagraph(
      `The lease term shall commence on ${formatDate(data.leaseStartDate)} and shall expire on ${formatDate(data.leaseEndDate)} ("Lease Term").`
    ),
    bodyParagraph(getRenewalText(data.renewalTerms)),

    // ─── 4. RENT ───
    sectionHeading(4, "RENT"),
    bodyParagraph(
      `The Tenant agrees to pay the Landlord a monthly rent of ${data.currencySymbol}${data.monthlyRent.toLocaleString()} (${numberToWords(data.monthlyRent)} ${data.currency}), payable in advance on the ${data.paymentDueDay} of each calendar month.`
    ),
    subClause("Payment Method", capitalizeFirst(getPaymentMethodText(data.paymentMethod))),
    bodyParagraph(
      data.lateFee
        ? `Late Payment: If rent is not received within 5 days of the due date, the Tenant shall pay a late fee of ${data.currencySymbol}${data.lateFee}. This late fee shall be considered additional rent under this Agreement.`
        : "Late Payment: If rent is not received within 5 days of the due date, the Tenant may be subject to late fees as permitted by applicable law."
    ),

    // ─── 5. SECURITY DEPOSIT ───
    sectionHeading(5, "SECURITY DEPOSIT"),
    bodyParagraph(
      `Upon execution of this Agreement, the Tenant shall pay a security deposit of ${data.currencySymbol}${data.securityDeposit.toLocaleString()} (${numberToWords(data.securityDeposit)} ${data.currency}) to the Landlord.`
    ),
    bodyParagraph(
      "The security deposit shall be held by the Landlord as security for the faithful performance of the Tenant's obligations. The deposit, or the balance remaining after any lawful deductions, shall be returned to the Tenant within 30 days of the termination of this Agreement and the Tenant vacating the Premises."
    ),
    bodyParagraph(
      "The Landlord may deduct from the security deposit amounts reasonably necessary to: (a) remedy any default by the Tenant in the payment of rent; (b) repair damage to the Premises caused by the Tenant beyond normal wear and tear; (c) clean the Premises if left in a condition below that at the commencement of the tenancy; and (d) cover any other costs permitted by applicable law."
    ),

    // ─── 6. UTILITIES ───
    sectionHeading(6, "UTILITIES AND SERVICES"),
    bodyParagraph(
      data.utilitiesIncluded
        ? `The following utilities and services shall be included in the monthly rent and paid for by the Landlord: ${data.utilitiesIncluded}. All other utilities and services, including but not limited to electricity, gas, water, internet, telephone, and council tax (where applicable), shall be the sole responsibility of the Tenant.`
        : "The Tenant shall be solely responsible for all utilities and services associated with the Premises, including but not limited to electricity, gas, water, sewage, internet, telephone, and council tax (where applicable). The Tenant shall ensure all utility accounts are maintained in good standing throughout the lease term."
    ),

    // ─── 7. MAINTENANCE AND REPAIRS ───
    sectionHeading(7, "MAINTENANCE AND REPAIRS"),
    bodyParagraph(
      "The Landlord shall be responsible for: (a) maintaining the structural integrity of the Premises, including the roof, exterior walls, and foundation; (b) maintaining building systems including plumbing, electrical, heating, and ventilation; (c) ensuring the Premises meets all applicable health and safety standards; and (d) carrying out repairs that are not the result of the Tenant's negligence or misuse."
    ),
    bodyParagraph(
      "The Tenant shall be responsible for: (a) keeping the Premises in a clean and habitable condition; (b) promptly reporting any damage, defect, or need for repair to the Landlord; (c) minor maintenance tasks such as replacing light bulbs, unblocking drains caused by the Tenant's use, and maintaining gardens (if applicable); and (d) any repairs necessitated by the Tenant's negligence, misuse, or that of the Tenant's guests."
    ),

    // ─── 8. USE OF PROPERTY ───
    sectionHeading(8, "USE OF PROPERTY"),
    bodyParagraph(
      "The Premises shall be used solely as a private residential dwelling for the Tenant and approved occupants. The Tenant shall not use the Premises for any commercial purpose, illegal activity, or in any manner that would create a nuisance or disturbance to neighbours."
    ),
    bodyParagraph(
      "The Tenant shall not sublet, assign, or transfer this Agreement or any interest therein, nor permit any other person to occupy the Premises, without the prior written consent of the Landlord."
    ),

    // ─── 9. PET POLICY ───
    sectionHeading(9, "PET POLICY"),
    bodyParagraph(
      data.petPolicy === "No Pets"
        ? "No pets of any kind are permitted on the Premises without the prior written consent of the Landlord. Any unauthorised pet found on the Premises shall constitute a breach of this Agreement and may result in termination of the lease."
        : data.petPolicy === "Pets Allowed"
          ? "The Tenant is permitted to keep domestic pets on the Premises, subject to reasonable rules and regulations. The Tenant shall ensure that pets do not cause damage to the Premises or nuisance to neighbours. The Tenant shall be fully liable for any damage caused by their pets, and any such damage shall not be considered normal wear and tear."
          : "Pets are permitted on the Premises subject to the payment of an additional pet deposit as agreed between the parties. The Tenant shall ensure that pets do not cause damage to the Premises or nuisance to neighbours. The Tenant shall be fully liable for any damage caused by their pets, and the pet deposit may be used to cover such damage."
    ),

    // ─── 10. ENTRY BY LANDLORD ───
    sectionHeading(10, "ENTRY BY LANDLORD"),
    bodyParagraph(
      "The Landlord or their authorised agents may enter the Premises for the purposes of inspection, carrying out repairs, or showing the property to prospective tenants, buyers, or mortgage lenders. The Landlord shall provide the Tenant with at least 24 hours written notice before any such entry, except in cases of emergency."
    ),
    bodyParagraph(
      "Entry shall be at reasonable hours and shall not be used to harass or inconvenience the Tenant. The Tenant shall not unreasonably withhold consent for entry when proper notice has been given."
    ),

    // ─── 11. TERMINATION ───
    sectionHeading(11, "TERMINATION"),
    bodyParagraph(
      "Either party may terminate this Agreement at the end of the lease term by providing at least 30 days written notice to the other party. If neither party provides notice, the terms regarding renewal (Section 3) shall apply."
    ),
    bodyParagraph(
      "The Landlord may terminate this Agreement immediately or with shortened notice if the Tenant: (a) fails to pay rent when due and does not remedy the default within 14 days of written notice; (b) causes significant damage to the Premises; (c) engages in illegal activity on the Premises; (d) breaches any material term of this Agreement; or (e) as otherwise permitted by applicable law."
    ),
    bodyParagraph(
      "Upon termination, the Tenant shall vacate the Premises, return all keys, and leave the property in a clean and good condition, subject to normal wear and tear."
    ),

    // ─── 12. ADDITIONAL TERMS ───
    sectionHeading(12, "ADDITIONAL TERMS"),
    bodyParagraph(
      data.additionalTerms
        ? data.additionalTerms
        : "No additional terms have been specified by the parties."
    ),

    // ─── 13. GOVERNING LAW ───
    sectionHeading(13, "GOVERNING LAW"),
    bodyParagraph(
      "This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which the Premises is located. Any disputes arising under this Agreement shall be resolved in the courts of competent jurisdiction."
    ),
    bodyParagraph(
      "If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect."
    ),

    // ─── SIGNATURES ───
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 300 },
      children: [
        new TextRun({
          text: "________________________________________",
          size: 22,
          color: "999999",
          font: "Arial",
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "IN WITNESS WHEREOF, the parties hereto have executed this Residential Rental Agreement as of the date first written above.",
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    }),

    emptyLine(),
    emptyLine(),

    // Landlord signature
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: "LANDLORD",
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    emptyLine(),
    new Paragraph({
      children: [
        new TextRun({
          text: "Signature: ______________________________",
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    emptyLine(),
    new Paragraph({
      children: [
        new TextRun({
          text: `Name: ${data.landlordName}`,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    emptyLine(),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "Date: ______________________________",
          size: 22,
          font: "Arial",
        }),
      ],
    }),

    emptyLine(),
    emptyLine(),

    // Tenant signature
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: "TENANT",
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    emptyLine(),
    new Paragraph({
      children: [
        new TextRun({
          text: "Signature: ______________________________",
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    emptyLine(),
    new Paragraph({
      children: [
        new TextRun({
          text: `Name: ${data.tenantName}`,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    emptyLine(),
    new Paragraph({
      children: [
        new TextRun({
          text: "Date: ______________________________",
          size: 22,
          font: "Arial",
        }),
      ],
    }),
  ];

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

function numberToWords(num: number): string {
  if (num === 0) return "zero";
  const formatted = num.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatted;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
