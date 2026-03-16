import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  TabStopPosition,
  TabStopType,
  convertInchesToTwip,
} from "docx";

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade: string;
}

export interface Experience {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  professionalSummary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
  certifications: string;
  languages: string;
  hobbies: string;
}

const FONT = "Calibri";
const BODY_SIZE = 22; // 11pt
const NAME_SIZE = 32; // 16pt (half-points in docx)
const HEADING_SIZE = 24; // 12pt
const CONTACT_SIZE = 20; // 10pt

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    border: {
      bottom: {
        color: "333333",
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: HEADING_SIZE,
        font: FONT,
        color: "1a1a1a",
      }),
    ],
  });
}

function emptyLine(): Paragraph {
  return new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: "", size: 8 })],
  });
}

export async function generateResume(data: ResumeData): Promise<Blob> {
  const paragraphs: Paragraph[] = [];

  // --- Name ---
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: data.fullName,
          bold: true,
          size: NAME_SIZE,
          font: FONT,
          color: "1a1a1a",
        }),
      ],
    })
  );

  // --- Contact info line ---
  const contactParts: string[] = [];
  if (data.email) contactParts.push(data.email);
  if (data.phone) contactParts.push(data.phone);
  if (data.location) contactParts.push(data.location);
  if (data.linkedin) contactParts.push(data.linkedin);
  if (data.website) contactParts.push(data.website);

  if (contactParts.length > 0) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: contactParts.join("  |  "),
            size: CONTACT_SIZE,
            font: FONT,
            color: "555555",
          }),
        ],
      })
    );
  }

  // --- Horizontal rule ---
  paragraphs.push(
    new Paragraph({
      spacing: { before: 40, after: 120 },
      border: {
        bottom: {
          color: "999999",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 8,
        },
      },
      children: [],
    })
  );

  // --- Professional Summary ---
  if (data.professionalSummary.trim()) {
    paragraphs.push(sectionHeading("Professional Summary"));
    paragraphs.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: data.professionalSummary.trim(),
            size: BODY_SIZE,
            font: FONT,
            color: "333333",
          }),
        ],
      })
    );
  }

  // --- Experience ---
  const validExperience = data.experience.filter(
    (e) => e.company.trim() || e.title.trim()
  );
  if (validExperience.length > 0) {
    paragraphs.push(sectionHeading("Experience"));

    validExperience.forEach((exp, index) => {
      const dateRange = exp.current
        ? `${exp.startDate} - Present`
        : `${exp.startDate} - ${exp.endDate}`;

      // Job Title at Company
      paragraphs.push(
        new Paragraph({
          spacing: { before: index > 0 ? 160 : 40, after: 20 },
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
          children: [
            new TextRun({
              text: exp.title,
              bold: true,
              size: BODY_SIZE,
              font: FONT,
              color: "1a1a1a",
            }),
            new TextRun({
              text: exp.company ? ` at ${exp.company}` : "",
              italics: true,
              size: BODY_SIZE,
              font: FONT,
              color: "333333",
            }),
            ...(exp.location
              ? [
                  new TextRun({
                    text: ` \u2014 ${exp.location}`,
                    size: BODY_SIZE,
                    font: FONT,
                    color: "555555",
                  }),
                ]
              : []),
          ],
        })
      );

      // Date range
      paragraphs.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: dateRange,
              size: CONTACT_SIZE,
              font: FONT,
              color: "777777",
              italics: true,
            }),
          ],
        })
      );

      // Description as bullet points
      if (exp.description.trim()) {
        const lines = exp.description
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l);
        lines.forEach((line) => {
          // Remove leading bullet characters if user added them
          const cleanLine = line.replace(/^[\u2022\-\*]\s*/, "");
          paragraphs.push(
            new Paragraph({
              spacing: { after: 20 },
              indent: { left: convertInchesToTwip(0.25) },
              bullet: { level: 0 },
              children: [
                new TextRun({
                  text: cleanLine,
                  size: BODY_SIZE,
                  font: FONT,
                  color: "333333",
                }),
              ],
            })
          );
        });
      }
    });
  }

  // --- Education ---
  const validEducation = data.education.filter(
    (e) => e.institution.trim() || e.degree.trim()
  );
  if (validEducation.length > 0) {
    paragraphs.push(sectionHeading("Education"));

    validEducation.forEach((edu, index) => {
      const degreeLine = [edu.degree, edu.field].filter(Boolean).join(" in ");
      const yearRange = [edu.startYear, edu.endYear]
        .filter(Boolean)
        .join(" - ");

      // Degree in Field
      paragraphs.push(
        new Paragraph({
          spacing: { before: index > 0 ? 120 : 40, after: 20 },
          children: [
            new TextRun({
              text: degreeLine || "Degree",
              bold: true,
              size: BODY_SIZE,
              font: FONT,
              color: "1a1a1a",
            }),
            ...(edu.institution
              ? [
                  new TextRun({
                    text: ` \u2014 ${edu.institution}`,
                    size: BODY_SIZE,
                    font: FONT,
                    color: "333333",
                  }),
                ]
              : []),
          ],
        })
      );

      // Years and grade
      const subParts: string[] = [];
      if (yearRange) subParts.push(yearRange);
      if (edu.grade) subParts.push(`Grade: ${edu.grade}`);
      if (subParts.length > 0) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: subParts.join("  |  "),
                size: CONTACT_SIZE,
                font: FONT,
                color: "777777",
                italics: true,
              }),
            ],
          })
        );
      }
    });
  }

  // --- Skills ---
  if (data.skills.trim()) {
    paragraphs.push(sectionHeading("Skills"));
    paragraphs.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: data.skills.trim(),
            size: BODY_SIZE,
            font: FONT,
            color: "333333",
          }),
        ],
      })
    );
  }

  // --- Certifications (optional) ---
  if (data.certifications.trim()) {
    paragraphs.push(sectionHeading("Certifications"));
    const certLines = data.certifications
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l);
    certLines.forEach((line) => {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 20 },
          indent: { left: convertInchesToTwip(0.25) },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: line.replace(/^[\u2022\-\*]\s*/, ""),
              size: BODY_SIZE,
              font: FONT,
              color: "333333",
            }),
          ],
        })
      );
    });
  }

  // --- Languages (optional) ---
  if (data.languages.trim()) {
    paragraphs.push(sectionHeading("Languages"));
    paragraphs.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: data.languages.trim(),
            size: BODY_SIZE,
            font: FONT,
            color: "333333",
          }),
        ],
      })
    );
  }

  // --- Hobbies & Interests (optional) ---
  if (data.hobbies.trim()) {
    paragraphs.push(sectionHeading("Hobbies & Interests"));
    paragraphs.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: data.hobbies.trim(),
            size: BODY_SIZE,
            font: FONT,
            color: "333333",
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.7),
              bottom: convertInchesToTwip(0.7),
              left: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
