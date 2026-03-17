import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from "docx";

export interface ExperienceCertificateData {
  companyName: string;
  companyAddress: string;
  employeeName: string;
  employeeDesignation: string;
  department: string;
  dateOfJoining: string;
  dateOfLeaving: string;
  duties: string;
  performanceSummary: string;
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

function getPerformanceCommendation(
  summary: string,
  employeeName: string
): string {
  const lower = summary.toLowerCase();
  if (
    lower.includes("excellent") ||
    lower.includes("outstanding") ||
    lower.includes("exceptional")
  ) {
    return `${employeeName} consistently demonstrated exceptional competence, dedication, and professionalism throughout their tenure. Their outstanding contributions have been invaluable to the organisation, and they have set a commendable standard of excellence. We highly recommend ${employeeName} for any future endeavours.`;
  }
  if (
    lower.includes("good") ||
    lower.includes("commendable") ||
    lower.includes("strong")
  ) {
    return `${employeeName} demonstrated strong professional skills and a commendable work ethic during their time with us. Their contributions were consistently of a high standard, and they proved to be a reliable and valued member of the team. We are pleased to recommend ${employeeName} for future opportunities.`;
  }
  return `${employeeName} fulfilled their responsibilities diligently and contributed positively to the team during their employment. We appreciate their efforts and wish them continued success in their professional journey.`;
}

export async function generateExperienceCertificate(
  data: ExperienceCertificateData
): Promise<Blob> {
  const children: Paragraph[] = [];

  // ── Company Letterhead ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.companyName.toUpperCase(),
          bold: true,
          size: 36,
          font: "Calibri",
          color: "1F2937",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.companyAddress,
          size: 20,
          font: "Calibri",
          color: "6B7280",
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
      spacing: { after: 400 },
    })
  );

  // ── Date of Issue ──
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
          text: "EXPERIENCE CERTIFICATE",
          bold: true,
          size: 32,
          font: "Calibri",
          color: "1F2937",
          characterSpacing: 120,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    })
  );

  // ── Decorative underline beneath title ──
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
          text: data.employeeName,
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: " has been employed with ",
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: data.companyName,
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: ` as `,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: data.employeeDesignation,
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: ` in the ${data.department} department from `,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: formatDate(data.dateOfJoining),
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
          text: formatDate(data.dateOfLeaving),
          bold: true,
          size: 22,
          font: "Calibri",
        }),
        new TextRun({
          text: ".",
          size: 22,
          font: "Calibri",
        }),
      ],
      spacing: { after: 300, line: 360 },
    })
  );

  // ── Duties and Responsibilities section ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Duties and Responsibilities",
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
          text: `During their tenure, ${data.employeeName} was entrusted with the following duties and responsibilities:`,
          size: 22,
          font: "Calibri",
        }),
      ],
      spacing: { after: 200, line: 360 },
    })
  );

  // Split duties by newlines or semicolons into bullet-style items
  const dutyItems = data.duties
    .split(/[;\n]+/)
    .map((d) => d.trim())
    .filter(Boolean);

  for (const duty of dutyItems) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `\u2022  ${duty}`,
            size: 22,
            font: "Calibri",
          }),
        ],
        spacing: { after: 80, line: 340 },
        indent: { left: 720 },
      })
    );
  }

  // ── Performance Summary ──
  if (data.performanceSummary) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Performance Summary",
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
            text: getPerformanceCommendation(
              data.performanceSummary,
              data.employeeName
            ),
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
            text: `Additional remarks: `,
            bold: true,
            size: 22,
            font: "Calibri",
          }),
          new TextRun({
            text: data.performanceSummary,
            size: 22,
            font: "Calibri",
            italics: true,
          }),
        ],
        spacing: { after: 300, line: 360 },
      })
    );
  }

  // ── Closing statement ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `We wish ${data.employeeName} all the very best in their future professional endeavours and are confident they will continue to excel in their career.`,
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
          text: "This certificate is issued upon request and without any obligation on the part of the undersigned.",
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
          text: "Yours sincerely,",
          size: 22,
          font: "Calibri",
        }),
      ],
      spacing: { after: 600 },
    })
  );

  // Signature line
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
          text: data.issuerName,
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
          text: data.issuerDesignation,
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
          text: data.companyName,
          size: 22,
          font: "Calibri",
          color: "4B5563",
        }),
      ],
      spacing: { after: 300 },
    })
  );

  // ── Company seal space ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "[Company Seal]",
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
