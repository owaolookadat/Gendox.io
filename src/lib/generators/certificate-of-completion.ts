import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from "docx";

export interface CertificateOfCompletionData {
  recipientName: string;
  courseName: string;
  organizationName: string;
  completionDate: string;
  duration: string;
  description: string;
  skillsCovered: string;
  gradeScore: string;
  certificateNumber: string;
  issuedByName: string;
  issuedByTitle: string;
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

function getGradeCommendation(grade: string): string {
  const lower = grade.toLowerCase();
  if (
    lower.includes("distinction") ||
    lower.includes("a+") ||
    lower.includes("outstanding") ||
    lower.includes("excellent")
  ) {
    return "This is an exceptional achievement, demonstrating mastery of the subject matter and outstanding dedication to learning. The recipient is to be commended for their exemplary performance.";
  }
  if (
    lower.includes("merit") ||
    lower.includes("a") ||
    lower.includes("b+") ||
    lower.includes("very good") ||
    lower.includes("good")
  ) {
    return "This is a commendable achievement, reflecting strong understanding of the material and consistent effort throughout the programme. The recipient has demonstrated a high level of competence.";
  }
  if (
    lower.includes("pass") ||
    lower.includes("b") ||
    lower.includes("c") ||
    lower.includes("satisfactory")
  ) {
    return "The recipient has successfully met all requirements for completion and demonstrated a solid understanding of the core concepts covered in the programme.";
  }
  return "The recipient has fulfilled the requirements for completion of this programme.";
}

export async function generateCertificateOfCompletion(
  data: CertificateOfCompletionData
): Promise<Blob> {
  const children: Paragraph[] = [];

  // ── Organisation header ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.organizationName.toUpperCase(),
          bold: true,
          size: 36,
          font: "Calibri",
          color: "1F2937",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // ── Decorative divider ──
  children.push(
    new Paragraph({
      children: [],
      border: {
        bottom: {
          style: BorderStyle.DOUBLE,
          size: 6,
          color: "1F2937",
        },
      },
      spacing: { after: 500 },
    })
  );

  // ── Title ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "CERTIFICATE OF COMPLETION",
          bold: true,
          size: 36,
          font: "Calibri",
          color: "1F2937",
          characterSpacing: 140,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014",
          size: 22,
          font: "Calibri",
          color: "9CA3AF",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 500 },
    })
  );

  // ── "This certifies that" ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "This certifies that",
          size: 24,
          font: "Calibri",
          color: "4B5563",
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // ── Recipient name ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.recipientName,
          bold: true,
          size: 36,
          font: "Calibri",
          color: "1F2937",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: "D1D5DB",
        },
      },
    })
  );

  // ── Completion statement ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "has successfully completed the course / programme",
          size: 24,
          font: "Calibri",
          color: "4B5563",
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );

  // ── Course name ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.courseName,
          bold: true,
          size: 30,
          font: "Calibri",
          color: "1D4ED8",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // ── Duration and completion date ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Duration: `,
          bold: true,
          size: 22,
          font: "Calibri",
          color: "4B5563",
        }),
        new TextRun({
          text: data.duration,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: `     |     `,
          size: 22,
          font: "Calibri",
          color: "D1D5DB",
        }),
        new TextRun({
          text: `Completed: `,
          bold: true,
          size: 22,
          font: "Calibri",
          color: "4B5563",
        }),
        new TextRun({
          text: formatDate(data.completionDate),
          size: 22,
          font: "Calibri",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // ── Description ──
  if (data.description) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Programme Description",
            bold: true,
            size: 24,
            font: "Calibri",
            color: "1F2937",
          }),
        ],
        spacing: { before: 200, after: 120 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: "D1D5DB",
          },
        },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.description,
            size: 22,
            font: "Calibri",
          }),
        ],
        spacing: { after: 300, line: 360 },
      })
    );
  }

  // ── Skills Covered ──
  if (data.skillsCovered) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Skills / Topics Covered",
            bold: true,
            size: 24,
            font: "Calibri",
            color: "1F2937",
          }),
        ],
        spacing: { before: 200, after: 120 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: "D1D5DB",
          },
        },
      })
    );

    const skills = data.skillsCovered
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    for (const skill of skills) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `\u2022  ${skill}`,
              size: 22,
              font: "Calibri",
            }),
          ],
          spacing: { after: 80, line: 340 },
          indent: { left: 720 },
        })
      );
    }
  }

  // ── Grade / Score ──
  if (data.gradeScore) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Achievement",
            bold: true,
            size: 24,
            font: "Calibri",
            color: "1F2937",
          }),
        ],
        spacing: { before: 300, after: 120 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 1,
            color: "D1D5DB",
          },
        },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Grade / Score: `,
            bold: true,
            size: 22,
            font: "Calibri",
          }),
          new TextRun({
            text: data.gradeScore,
            bold: true,
            size: 24,
            font: "Calibri",
            color: "1D4ED8",
          }),
        ],
        spacing: { after: 200 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: getGradeCommendation(data.gradeScore),
            size: 22,
            font: "Calibri",
            italics: true,
            color: "4B5563",
          }),
        ],
        spacing: { after: 300, line: 360 },
      })
    );
  }

  // ── Certificate number ──
  if (data.certificateNumber) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Certificate No: `,
            bold: true,
            size: 20,
            font: "Calibri",
            color: "6B7280",
          }),
          new TextRun({
            text: data.certificateNumber,
            size: 20,
            font: "Calibri",
            color: "6B7280",
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // ── Date of Issue ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Date of Issue: `,
          bold: true,
          size: 22,
          font: "Calibri",
          color: "4B5563",
        }),
        new TextRun({
          text: formatDate(data.dateOfIssue),
          size: 22,
          font: "Calibri",
        }),
      ],
      spacing: { after: 500 },
    })
  );

  // ── Signature block ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "____________________________",
          size: 22,
          font: "Calibri",
          color: "9CA3AF",
        }),
      ],
      spacing: { after: 80 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.issuedByName,
          bold: true,
          size: 24,
          font: "Calibri",
          color: "1F2937",
        }),
      ],
      spacing: { after: 40 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.issuedByTitle,
          size: 22,
          font: "Calibri",
          color: "4B5563",
        }),
      ],
      spacing: { after: 40 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.organizationName,
          size: 22,
          font: "Calibri",
          color: "4B5563",
        }),
      ],
      spacing: { after: 300 },
    })
  );

  // ── Seal space ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "[Official Seal / Stamp]",
          size: 20,
          font: "Calibri",
          color: "9CA3AF",
          italics: true,
        }),
      ],
      spacing: { before: 200 },
    })
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
            borders: {
              pageBorderTop: {
                style: BorderStyle.DOUBLE,
                size: 6,
                color: "1F2937",
                space: 24,
              },
              pageBorderBottom: {
                style: BorderStyle.DOUBLE,
                size: 6,
                color: "1F2937",
                space: 24,
              },
              pageBorderLeft: {
                style: BorderStyle.DOUBLE,
                size: 6,
                color: "1F2937",
                space: 24,
              },
              pageBorderRight: {
                style: BorderStyle.DOUBLE,
                size: 6,
                color: "1F2937",
                space: 24,
              },
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
