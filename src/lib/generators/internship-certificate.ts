import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from "docx";

export interface InternshipCertificateData {
  organizationName: string;
  internName: string;
  department: string;
  internshipTitle: string;
  startDate: string;
  endDate: string;
  duration: string;
  projectDescription: string;
  skillsGained: string;
  performanceRating: string;
  supervisorName: string;
  supervisorTitle: string;
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

function getPerformanceParagraph(
  rating: string,
  internName: string
): string {
  const lower = rating.toLowerCase();
  if (lower.includes("excellent") || lower.includes("outstanding")) {
    return `${internName} demonstrated an outstanding level of competence, initiative, and professionalism throughout the internship. Their contributions exceeded expectations consistently, and they exhibited exceptional analytical and problem-solving abilities. We wholeheartedly recommend ${internName} and are confident they will achieve great success in their future career.`;
  }
  if (lower.includes("good") || lower.includes("very good")) {
    return `${internName} showed a commendable level of dedication, skill, and enthusiasm during their internship. They adapted quickly to the work environment, consistently delivered high-quality work, and worked effectively both independently and as part of a team. We are pleased to recommend ${internName} for future professional opportunities.`;
  }
  return `${internName} completed the internship satisfactorily, fulfilling the assigned responsibilities with diligence. They demonstrated a willingness to learn and made steady progress throughout the programme. We wish ${internName} continued growth and success in their professional journey.`;
}

export async function generateInternshipCertificate(
  data: InternshipCertificateData
): Promise<Blob> {
  const children: Paragraph[] = [];

  // ── Organisation Letterhead ──
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
      spacing: { after: 300 },
    })
  );

  // ── Date ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Date: ${formatDate(data.dateOfIssue)}`,
          size: 22,
          font: "Calibri",
          color: "4B5563",
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 400 },
    })
  );

  // ── Title ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "INTERNSHIP COMPLETION CERTIFICATE",
          bold: true,
          size: 32,
          font: "Calibri",
          color: "1F2937",
          characterSpacing: 100,
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
          text: "\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014",
          size: 22,
          font: "Calibri",
          color: "9CA3AF",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // ── Salutation ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "To Whom It May Concern,",
          size: 24,
          font: "Calibri",
          color: "1F2937",
        }),
      ],
      spacing: { after: 300 },
    })
  );

  // ── Certification statement ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "This is to certify that ",
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: data.internName,
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: " has successfully completed an internship at ",
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: data.organizationName,
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: ` in the ${data.department} department, serving as `,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: data.internshipTitle,
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: ` from `,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: formatDate(data.startDate),
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: " to ",
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: formatDate(data.endDate),
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: ` (${data.duration}).`,
          size: 22,
          font: "Calibri",
        }),
      ],
      spacing: { after: 300, line: 360 },
    })
  );

  // ── Project / Work Description ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Project / Work Description",
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
          text: data.projectDescription,
          size: 22,
          font: "Calibri",
        }),
      ],
      spacing: { after: 300, line: 360 },
    })
  );

  // ── Skills Gained ──
  if (data.skillsGained) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Skills Acquired",
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
            text: `During the internship, ${data.internName} developed proficiency in the following areas:`,
            size: 22,
            font: "Calibri",
          }),
        ],
        spacing: { after: 200, line: 360 },
      })
    );

    const skills = data.skillsGained
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

  // ── Performance Assessment ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Performance Assessment",
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
          text: `Overall Rating: `,
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: data.performanceRating,
          bold: true,
          size: 22,
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
          text: getPerformanceParagraph(
            data.performanceRating,
            data.internName
          ),
          size: 22,
          font: "Calibri",
        }),
      ],
      spacing: { after: 300, line: 360 },
    })
  );

  // ── Closing ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `We wish ${data.internName} every success in their future academic and professional pursuits.`,
          size: 22,
          font: "Calibri",
        }),
      ],
      spacing: { after: 200, line: 360 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "This certificate is issued on request for the purposes of record.",
          size: 22,
          font: "Calibri",
          color: "6B7280",
          italics: true,
        }),
      ],
      spacing: { after: 500, line: 360 },
    })
  );

  // ── Signature block ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "With best regards,",
          size: 22,
          font: "Calibri",
        }),
      ],
      spacing: { after: 600 },
    })
  );

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
          text: data.supervisorName,
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
          text: data.supervisorTitle,
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
          text: "[Organisation Seal / Stamp]",
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
                style: BorderStyle.SINGLE,
                size: 3,
                color: "1F2937",
                space: 24,
              },
              pageBorderBottom: {
                style: BorderStyle.SINGLE,
                size: 3,
                color: "1F2937",
                space: 24,
              },
              pageBorderLeft: {
                style: BorderStyle.SINGLE,
                size: 3,
                color: "1F2937",
                space: 24,
              },
              pageBorderRight: {
                style: BorderStyle.SINGLE,
                size: 3,
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
