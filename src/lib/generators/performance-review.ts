import { Document, Packer, Paragraph, TextRun } from "docx";

export interface PerformanceReviewData {
  employeeName: string;
  employeeTitle: string;
  department: string;
  reviewerName: string;
  reviewPeriodStart: string;
  reviewPeriodEnd: string;
  overallRating: string;
  keyAchievements: string;
  areasForImprovement: string;
  goalsForNextPeriod: string;
  skillsAssessment: string;
  trainingNeeds: string;
  managerComments: string;
  employeeComments: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generatePerformanceReview(
  data: PerformanceReviewData
): Promise<Blob> {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({ text: "PERFORMANCE REVIEW", bold: true, size: 28, underline: {} }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "Employee: ", bold: true, size: 22 }),
        new TextRun({ text: data.employeeName, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Title: ", bold: true, size: 22 }),
        new TextRun({ text: data.employeeTitle, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Department: ", bold: true, size: 22 }),
        new TextRun({ text: data.department, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Reviewer: ", bold: true, size: 22 }),
        new TextRun({ text: data.reviewerName, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Review Period: ", bold: true, size: 22 }),
        new TextRun({
          text: `${formatDate(data.reviewPeriodStart)} to ${formatDate(data.reviewPeriodEnd)}`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Date: ", bold: true, size: 22 }),
        new TextRun({ text: today, size: 22 }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "Overall Rating: ", bold: true, size: 24 }),
        new TextRun({ text: data.overallRating, bold: true, size: 24 }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "KEY ACHIEVEMENTS", bold: true, size: 22, underline: {} }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.keyAchievements, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "AREAS FOR IMPROVEMENT", bold: true, size: 22, underline: {} }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.areasForImprovement, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "GOALS FOR NEXT PERIOD", bold: true, size: 22, underline: {} }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.goalsForNextPeriod, size: 22 })],
    }),
  ];

  if (data.skillsAssessment) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "SKILLS ASSESSMENT", bold: true, size: 22, underline: {} }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.skillsAssessment, size: 22 })],
      })
    );
  }

  if (data.trainingNeeds) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "TRAINING NEEDS", bold: true, size: 22, underline: {} }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.trainingNeeds, size: 22 })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "MANAGER COMMENTS", bold: true, size: 22, underline: {} }),
      ],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.managerComments, size: 22 })],
    })
  );

  if (data.employeeComments) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "EMPLOYEE COMMENTS", bold: true, size: 22, underline: {} }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.employeeComments, size: 22 })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Manager Signature: ________________________", size: 22 }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Employee Signature: ________________________", size: 22 }),
      ],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
