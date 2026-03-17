import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from "docx";

export interface AwardCertificateData {
  recipientName: string;
  awardTitle: string;
  organizationName: string;
  date: string;
  category: string;
  description: string;
  presentedByName: string;
  presentedByTitle: string;
  certificateNumber: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateAwardCertificate(
  data: AwardCertificateData
): Promise<Blob> {
  const children: Paragraph[] = [];

  // ── Decorative top ornament ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "\u2726  \u2726  \u2726",
          size: 28,
          font: "Calibri",
          color: "B8860B",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );

  // ── Organisation name ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.organizationName.toUpperCase(),
          bold: true,
          size: 32,
          font: "Calibri",
          color: "1F2937",
          characterSpacing: 100,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // ── Decorative divider ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014",
          size: 22,
          font: "Calibri",
          color: "B8860B",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 500 },
    })
  );

  // ── Title ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "CERTIFICATE OF AWARD",
          bold: true,
          size: 40,
          font: "Calibri",
          color: "1F2937",
          characterSpacing: 160,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 500 },
    })
  );

  // ── "Presented to" ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "This certificate is proudly presented to",
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

  // ── Recipient name (large, elegant) ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.recipientName,
          bold: true,
          size: 44,
          font: "Calibri",
          color: "1F2937",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    })
  );

  // ── Decorative underline beneath name ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014",
          size: 22,
          font: "Calibri",
          color: "B8860B",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // ── "In recognition of" ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "in recognition of",
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

  // ── Award title ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.awardTitle,
          bold: true,
          size: 32,
          font: "Calibri",
          color: "1D4ED8",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // ── Category ──
  if (data.category && data.category !== "Custom") {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Category: ${data.category}`,
            size: 22,
            font: "Calibri",
            color: "6B7280",
            italics: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );
  }

  // ── Description ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.description,
          size: 22,
          font: "Calibri",
          color: "374151",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 500, line: 360 },
    })
  );

  // ── Date ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Awarded on ${formatDate(data.date)}`,
          size: 22,
          font: "Calibri",
          color: "4B5563",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // ── Certificate number ──
  if (data.certificateNumber) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Certificate No: ${data.certificateNumber}`,
            size: 20,
            font: "Calibri",
            color: "9CA3AF",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 500 },
      })
    );
  } else {
    children.push(
      new Paragraph({
        children: [],
        spacing: { after: 500 },
      })
    );
  }

  // ── Decorative divider before signature ──
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "\u2726  \u2726  \u2726",
          size: 22,
          font: "Calibri",
          color: "B8860B",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 500 },
    })
  );

  // ── Signature block (centered) ──
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
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.presentedByName,
          bold: true,
          size: 24,
          font: "Calibri",
          color: "1F2937",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.presentedByTitle,
          size: 22,
          font: "Calibri",
          color: "4B5563",
        }),
      ],
      alignment: AlignmentType.CENTER,
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
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
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
      alignment: AlignmentType.CENTER,
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
                color: "B8860B",
                space: 24,
              },
              pageBorderBottom: {
                style: BorderStyle.DOUBLE,
                size: 6,
                color: "B8860B",
                space: 24,
              },
              pageBorderLeft: {
                style: BorderStyle.DOUBLE,
                size: 6,
                color: "B8860B",
                space: 24,
              },
              pageBorderRight: {
                style: BorderStyle.DOUBLE,
                size: 6,
                color: "B8860B",
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
