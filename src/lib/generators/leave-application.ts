import { Document, Packer, Paragraph, TextRun } from "docx";

export interface LeaveApplicationData {
  employeeName: string;
  employeeId: string;
  department: string;
  managerName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  emergencyContact: string;
  handoverTo: string;
  dateOfApplication: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateLeaveApplication(
  data: LeaveApplicationData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({ text: "LEAVE APPLICATION", bold: true, size: 26, underline: {} }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: `Date: ${formatDate(data.dateOfApplication)}`, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: `To: ${data.managerName}`, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Dear ${data.managerName},`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `I am writing to formally request ${data.leaveType} leave for a period of ${data.numberOfDays} day${data.numberOfDays !== 1 ? "s" : ""}, from ${formatDate(data.startDate)} to ${formatDate(data.endDate)}.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "Reason for Leave:", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.reason, size: 22 })],
    }),
  ];

  if (data.handoverTo) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `I have arranged for ${data.handoverTo} to handle my responsibilities during my absence.`,
            size: 22,
          }),
        ],
      })
    );
  }

  if (data.emergencyContact) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `In case of emergency, I can be reached at: ${data.emergencyContact}`,
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
          text: "I kindly request your approval for this leave application. I will ensure all pending tasks are completed or handed over before my leave period begins.",
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: "Thank you for your consideration.", size: 22 })],
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
      children: [new TextRun({ text: data.employeeName, bold: true, size: 22 })],
    })
  );

  if (data.employeeId) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: `Employee ID: ${data.employeeId}`, size: 22 })],
      })
    );
  }

  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: `Department: ${data.department}`, size: 22 })],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
