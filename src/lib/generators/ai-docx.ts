import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
} from "docx";

interface AIDocxOptions {
  title?: string;
  senderBlock?: string[];
  recipientBlock?: string[];
  date?: string;
  salutation?: string;
  signOff?: string;
  signatureName?: string;
  signatureTitle?: string;
  signatureOrg?: string;
  signatureEmail?: string;
  /** Main AI-generated content. Paragraphs separated by \n\n */
  content: string;
  /** If true, treat ALL CAPS lines as section headings */
  hasSections?: boolean;
}

function parseParagraphs(content: string, hasSections: boolean): Paragraph[] {
  const blocks = content
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  const paragraphs: Paragraph[] = [];

  for (const block of blocks) {
    // Check for section headings (ALL CAPS line ending with colon, or starting with ALL CAPS:)
    const sectionMatch = block.match(/^([A-Z][A-Z &/'-]+):?\s*([\s\S]*)$/);
    if (hasSections && sectionMatch) {
      const heading = sectionMatch[1].trim().replace(/:$/, "");
      const bodyText = sectionMatch[2].trim();

      // Add spacing before section
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: heading,
              bold: true,
              size: 24,
              font: "Calibri",
            }),
          ],
          spacing: { before: 360, after: 120 },
          border: {
            bottom: {
              style: BorderStyle.SINGLE,
              size: 1,
              color: "CCCCCC",
            },
          },
        })
      );

      if (bodyText) {
        // Split body text on newlines for sub-paragraphs
        const subParagraphs = bodyText.split(/\n/).filter(Boolean);
        for (const sub of subParagraphs) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: sub.trim(),
                  size: 22,
                  font: "Calibri",
                }),
              ],
              spacing: { after: 120 },
            })
          );
        }
      }
    } else {
      // Regular paragraph — may have inline newlines
      const lines = block.split(/\n/).filter(Boolean);
      paragraphs.push(
        new Paragraph({
          children: lines.map(
            (line, i) =>
              new TextRun({
                text: line.trim(),
                size: 22,
                font: "Calibri",
                break: i > 0 ? 1 : undefined,
              })
          ),
          spacing: { after: 200 },
        })
      );
    }
  }

  return paragraphs;
}

export async function generateAIDocx(options: AIDocxOptions): Promise<Blob> {
  const sections: Paragraph[] = [];

  // Title
  if (options.title) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: options.title,
            bold: true,
            size: 32,
            font: "Calibri",
          }),
        ],
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    );
  }

  // Sender block
  if (options.senderBlock?.length) {
    for (const line of options.senderBlock) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: line, size: 22, font: "Calibri" }),
          ],
          spacing: { after: 40 },
        })
      );
    }
    sections.push(new Paragraph({ spacing: { after: 120 } }));
  }

  // Date
  if (options.date) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: options.date, size: 22, font: "Calibri" }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // Recipient block
  if (options.recipientBlock?.length) {
    for (const line of options.recipientBlock) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: line, size: 22, font: "Calibri" }),
          ],
          spacing: { after: 40 },
        })
      );
    }
    sections.push(new Paragraph({ spacing: { after: 200 } }));
  }

  // Salutation
  if (options.salutation) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: options.salutation,
            size: 22,
            font: "Calibri",
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // Body content
  const bodyParagraphs = parseParagraphs(
    options.content,
    options.hasSections ?? false
  );
  sections.push(...bodyParagraphs);

  // Sign-off
  if (options.signOff) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: options.signOff,
            size: 22,
            font: "Calibri",
          }),
        ],
        spacing: { before: 300, after: 40 },
      })
    );
  }

  // Signature
  if (options.signatureName) {
    sections.push(new Paragraph({ spacing: { after: 200 } })); // gap for signature
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: options.signatureName,
            bold: true,
            size: 22,
            font: "Calibri",
          }),
        ],
        spacing: { after: 40 },
      })
    );
  }

  if (options.signatureTitle) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: options.signatureTitle,
            size: 22,
            font: "Calibri",
          }),
        ],
        spacing: { after: 40 },
      })
    );
  }

  if (options.signatureOrg) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: options.signatureOrg,
            size: 22,
            font: "Calibri",
          }),
        ],
        spacing: { after: 40 },
      })
    );
  }

  if (options.signatureEmail) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: options.signatureEmail,
            size: 22,
            font: "Calibri",
            color: "2563EB",
          }),
        ],
        spacing: { after: 40 },
      })
    );
  }

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
        children: sections,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
