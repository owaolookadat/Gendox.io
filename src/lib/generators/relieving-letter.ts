import { Document, Packer, Paragraph, TextRun } from "docx";

export interface RelievingLetterData {
  companyName: string;
  companyAddress: string;
  employeeName: string;
  employeeDesignation: string;
  employeeId: string;
  department: string;
  dateOfJoining: string;
  dateOfResignation: string;
  lastWorkingDay: string;
  reasonForLeaving: string;
  outstandingDuesCleared: boolean;
  issuerName: string;
  issuerDesignation: string;
  dateOfIssue: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateRelievingLetter(
  data: RelievingLetterData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.companyName, bold: true, size: 28 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.companyAddress, size: 22, color: "666666" })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: `Date: ${formatDate(data.dateOfIssue)}`, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: "RELIEVING LETTER",
          bold: true,
          size: 26,
          underline: {},
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Dear ${data.employeeName},`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `This is to confirm that you have been relieved from your duties as ${data.employeeDesignation} in the ${data.department} department at ${data.companyName}, effective ${formatDate(data.lastWorkingDay)}.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
  ];

  if (data.employeeId) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Employee ID: ${data.employeeId}`, size: 22 }),
        ],
      })
    );
  }

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Date of Joining: ${formatDate(data.dateOfJoining)}`,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Date of Resignation: ${formatDate(data.dateOfResignation)}`,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Last Working Day: ${formatDate(data.lastWorkingDay)}`,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Reason for Separation: ${data.reasonForLeaving}`,
          size: 22,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  if (data.outstandingDuesCleared) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "We confirm that all outstanding dues have been settled and there are no pending obligations on either side.",
            size: 22,
          }),
        ],
      })
    );
  } else {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Please note that settlement of outstanding dues is pending and will be processed separately.",
            size: 22,
          }),
        ],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `We thank you for your contributions to ${data.companyName} and wish you all the best in your future endeavours.`,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: "Yours sincerely,", size: 22 })],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.issuerName, bold: true, size: 22 })],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.issuerDesignation, size: 22 })],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.companyName, size: 22 })],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
