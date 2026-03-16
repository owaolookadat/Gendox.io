import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export interface WaiverFormData {
  organizationName: string;
  activityName: string;
  activityDescription: string;
  dateOfActivity: string;
  location: string;
  participantName: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  risksAcknowledged: string;
  liabilityRelease: string;
  medicalConditions: string;
  governingLaw: string;
}

export async function generateWaiverForm(
  data: WaiverFormData
): Promise<Blob> {
  const children: Paragraph[] = [
    // Organization
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: data.organizationName,
          bold: true,
          size: 28,
        }),
      ],
    }),

    // Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "LIABILITY WAIVER AND RELEASE FORM",
          bold: true,
          size: 36,
        }),
      ],
    }),

    // Activity Info
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Activity/Event: ", bold: true, size: 22 }),
        new TextRun({ text: data.activityName, size: 22 }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Date: ", bold: true, size: 22 }),
        new TextRun({ text: data.dateOfActivity, size: 22 }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Location: ", bold: true, size: 22 }),
        new TextRun({ text: data.location, size: 22 }),
      ],
    }),

    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // Activity Description
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "1. ACTIVITY DESCRIPTION",
          bold: true,
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: data.activityDescription, size: 22 }),
      ],
    }),

    // Assumption of Risk
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "2. ACKNOWLEDGMENT AND ASSUMPTION OF RISKS",
          bold: true,
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `I, ${data.participantName}, acknowledge that participation in ${data.activityName} involves certain inherent risks, including but not limited to:`,
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: data.risksAcknowledged, size: 22 }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "I understand and voluntarily accept these risks and agree to assume full responsibility for any injuries, damages, or losses that may result from my participation.",
          size: 22,
        }),
      ],
    }),

    // Release of Liability
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "3. RELEASE AND WAIVER OF LIABILITY",
          bold: true,
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: data.liabilityRelease, size: 22 }),
      ],
    }),

    // Indemnification
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "4. INDEMNIFICATION",
          bold: true,
          size: 22,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `I agree to indemnify and hold harmless ${data.organizationName}, its officers, directors, employees, agents, and volunteers from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to my participation in the activity.`,
          size: 22,
        }),
      ],
    }),
  ];

  // Medical Conditions
  let clauseNum = 5;
  if (data.medicalConditions.trim()) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `${clauseNum}. MEDICAL CONDITIONS`,
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "The participant has disclosed the following medical conditions or allergies:",
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: data.medicalConditions, size: 22 }),
        ],
      })
    );
    clauseNum++;
  }

  // Emergency Contact
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${clauseNum}. EMERGENCY CONTACT`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Name: ", bold: true, size: 22 }),
        new TextRun({ text: data.emergencyContactName, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Phone: ", bold: true, size: 22 }),
        new TextRun({ text: data.emergencyContactPhone, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "In the event of an emergency, I authorize the organization to contact the above individual and to seek emergency medical treatment on my behalf if necessary.",
          size: 22,
        }),
      ],
    })
  );

  clauseNum++;

  // Governing Law
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${clauseNum}. GOVERNING LAW`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `This waiver shall be governed by and construed in accordance with the laws of ${data.governingLaw}. Any disputes arising from this waiver shall be resolved in the courts of ${data.governingLaw}.`,
          size: 22,
        }),
      ],
    })
  );

  clauseNum++;

  // Acknowledgment
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${clauseNum}. ACKNOWLEDGMENT`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "I have read this Liability Waiver and Release Form in its entirety. I fully understand its terms and conditions. I understand that I am giving up substantial rights, including my right to sue. I sign it freely and voluntarily without any inducement.",
          size: 22,
        }),
      ],
    })
  );

  // Signature
  children.push(
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "PARTICIPANT", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({ spacing: { after: 300 }, children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: "____________________________", size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${data.participantName} (Signature)`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Printed Name: ____________________________",
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Date: ${data.dateOfActivity}`,
          size: 22,
        }),
      ],
    }),

    // Organization representative
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "ORGANIZATION REPRESENTATIVE",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 300 }, children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: "____________________________", size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${data.organizationName} Representative (Signature)`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({
          text: "Printed Name: ____________________________",
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Date: ____________________________",
          size: 22,
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [{ children }],
  });

  return await Packer.toBlob(doc);
}
