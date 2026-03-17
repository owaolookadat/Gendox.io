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

export type ResumeStyle = "classic" | "modern" | "minimal";

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
  style: ResumeStyle;
}

export interface ResumePreviewData {
  style: string;
  fullName: string;
  contactLine: string;
  contactParts: string[];
  summary?: string;
  experience: {
    title: string;
    company: string;
    location: string;
    dates: string;
    bullets: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    dates: string;
    grade?: string;
  }[];
  skills?: string;
  skillItems: string[];
  certifications?: string;
  certificationItems: string[];
  languages?: string;
  hobbies?: string;
}

const FONT = "Calibri";

// --- Style configurations ---

interface StyleConfig {
  nameSize: number;
  nameAlignment: (typeof AlignmentType)[keyof typeof AlignmentType];
  nameColor: string;
  contactSize: number;
  contactAlignment: (typeof AlignmentType)[keyof typeof AlignmentType];
  contactColor: string;
  headingSize: number;
  headingColor: string;
  headingBorderColor: string;
  headingBorderSize: number;
  headingSpacingBefore: number;
  headingSpacingAfter: number;
  bodySize: number;
  bodyColor: string;
  bodySpacingAfter: number;
  showHorizontalRule: boolean;
  jobTitleColor: string;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

function getStyleConfig(style: ResumeStyle): StyleConfig {
  switch (style) {
    case "modern":
      return {
        nameSize: 36, // 18pt
        nameAlignment: AlignmentType.LEFT,
        nameColor: "2563EB",
        contactSize: 20,
        contactAlignment: AlignmentType.LEFT,
        contactColor: "666666",
        headingSize: 24,
        headingColor: "2563EB",
        headingBorderColor: "2563EB",
        headingBorderSize: 4,
        headingSpacingBefore: 300,
        headingSpacingAfter: 100,
        bodySize: 22,
        bodyColor: "333333",
        bodySpacingAfter: 120,
        showHorizontalRule: false,
        jobTitleColor: "2563EB",
        marginTop: convertInchesToTwip(0.7),
        marginBottom: convertInchesToTwip(0.7),
        marginLeft: convertInchesToTwip(0.8),
        marginRight: convertInchesToTwip(0.8),
      };
    case "minimal":
      return {
        nameSize: 28, // 14pt
        nameAlignment: AlignmentType.LEFT,
        nameColor: "1a1a1a",
        contactSize: 18,
        contactAlignment: AlignmentType.LEFT,
        contactColor: "888888",
        headingSize: 23,
        headingColor: "1a1a1a",
        headingBorderColor: "",
        headingBorderSize: 0,
        headingSpacingBefore: 200,
        headingSpacingAfter: 60,
        bodySize: 21,
        bodyColor: "333333",
        bodySpacingAfter: 80,
        showHorizontalRule: false,
        jobTitleColor: "1a1a1a",
        marginTop: convertInchesToTwip(0.5),
        marginBottom: convertInchesToTwip(0.5),
        marginLeft: convertInchesToTwip(0.5),
        marginRight: convertInchesToTwip(0.5),
      };
    case "classic":
    default:
      return {
        nameSize: 32, // 16pt
        nameAlignment: AlignmentType.CENTER,
        nameColor: "1a1a1a",
        contactSize: 20,
        contactAlignment: AlignmentType.CENTER,
        contactColor: "555555",
        headingSize: 24,
        headingColor: "1a1a1a",
        headingBorderColor: "333333",
        headingBorderSize: 6,
        headingSpacingBefore: 240,
        headingSpacingAfter: 80,
        bodySize: 22,
        bodyColor: "333333",
        bodySpacingAfter: 120,
        showHorizontalRule: true,
        jobTitleColor: "1a1a1a",
        marginTop: convertInchesToTwip(0.7),
        marginBottom: convertInchesToTwip(0.7),
        marginLeft: convertInchesToTwip(0.8),
        marginRight: convertInchesToTwip(0.8),
      };
  }
}

function buildContactLine(data: ResumeData): string {
  const contactParts: string[] = [];
  if (data.email) contactParts.push(data.email);
  if (data.phone) contactParts.push(data.phone);
  if (data.location) contactParts.push(data.location);
  if (data.linkedin) contactParts.push(data.linkedin);
  if (data.website) contactParts.push(data.website);
  return contactParts.join("  |  ");
}

function sectionHeading(text: string, config: StyleConfig): Paragraph {
  const border =
    config.headingBorderSize > 0
      ? {
          bottom: {
            color: config.headingBorderColor,
            space: 1,
            style: BorderStyle.SINGLE,
            size: config.headingBorderSize,
          },
        }
      : undefined;

  return new Paragraph({
    spacing: {
      before: config.headingSpacingBefore,
      after: config.headingSpacingAfter,
    },
    border,
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: config.headingSize,
        font: FONT,
        color: config.headingColor,
      }),
    ],
  });
}

export function generateResumePreviewData(data: ResumeData): ResumePreviewData {
  const validExperience = data.experience.filter(
    (e) => e.company.trim() || e.title.trim()
  );
  const validEducation = data.education.filter(
    (e) => e.institution.trim() || e.degree.trim()
  );

  const skillItems = data.skills
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter((s) => s);

  const certificationItems = data.certifications
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l)
    .map((l) => l.replace(/^[\u2022\-\*]\s*/, ""));

  const contactParts: string[] = [];
  if (data.email) contactParts.push(data.email);
  if (data.phone) contactParts.push(data.phone);
  if (data.location) contactParts.push(data.location);
  if (data.linkedin) contactParts.push(data.linkedin);
  if (data.website) contactParts.push(data.website);

  return {
    style: data.style,
    fullName: data.fullName,
    contactLine: buildContactLine(data),
    contactParts,
    summary: data.professionalSummary.trim() || undefined,
    experience: validExperience.map((exp) => {
      const dateRange = exp.current
        ? `${exp.startDate} - Present`
        : `${exp.startDate} - ${exp.endDate}`;
      const bullets = exp.description
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l)
        .map((l) => l.replace(/^[\u2022\-\*]\s*/, ""));
      return {
        title: exp.title,
        company: exp.company,
        location: exp.location,
        dates: dateRange,
        bullets,
      };
    }),
    education: validEducation.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      dates: [edu.startYear, edu.endYear].filter(Boolean).join(" - "),
      grade: edu.grade || undefined,
    })),
    skills: data.skills.trim() || undefined,
    skillItems,
    certifications: data.certifications.trim() || undefined,
    certificationItems,
    languages: data.languages.trim() || undefined,
    hobbies: data.hobbies.trim() || undefined,
  };
}

export async function generateResume(data: ResumeData): Promise<Blob> {
  const config = getStyleConfig(data.style);
  const paragraphs: Paragraph[] = [];

  // --- Name ---
  paragraphs.push(
    new Paragraph({
      alignment: config.nameAlignment,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: data.fullName,
          bold: true,
          size: config.nameSize,
          font: FONT,
          color: config.nameColor,
        }),
      ],
    })
  );

  // --- Contact info line ---
  const contactLine = buildContactLine(data);
  if (contactLine) {
    paragraphs.push(
      new Paragraph({
        alignment: config.contactAlignment,
        spacing: { after: config.bodySpacingAfter },
        children: [
          new TextRun({
            text: contactLine,
            size: config.contactSize,
            font: FONT,
            color: config.contactColor,
          }),
        ],
      })
    );
  }

  // --- Horizontal rule (classic only) ---
  if (config.showHorizontalRule) {
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
  }

  // --- Professional Summary ---
  if (data.professionalSummary.trim()) {
    paragraphs.push(sectionHeading("Professional Summary", config));
    paragraphs.push(
      new Paragraph({
        spacing: { after: config.bodySpacingAfter },
        children: [
          new TextRun({
            text: data.professionalSummary.trim(),
            size: config.bodySize,
            font: FONT,
            color: config.bodyColor,
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
    paragraphs.push(sectionHeading("Experience", config));

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
              size: config.bodySize,
              font: FONT,
              color: config.jobTitleColor,
            }),
            new TextRun({
              text: exp.company ? ` at ${exp.company}` : "",
              italics: true,
              size: config.bodySize,
              font: FONT,
              color: config.bodyColor,
            }),
            ...(exp.location
              ? [
                  new TextRun({
                    text: ` \u2014 ${exp.location}`,
                    size: config.bodySize,
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
              size: config.contactSize,
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
          const cleanLine = line.replace(/^[\u2022\-\*]\s*/, "");
          paragraphs.push(
            new Paragraph({
              spacing: { after: 20 },
              indent: { left: convertInchesToTwip(0.25) },
              bullet: { level: 0 },
              children: [
                new TextRun({
                  text: cleanLine,
                  size: config.bodySize,
                  font: FONT,
                  color: config.bodyColor,
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
    paragraphs.push(sectionHeading("Education", config));

    validEducation.forEach((edu, index) => {
      const degreeLine = [edu.degree, edu.field].filter(Boolean).join(" in ");
      const yearRange = [edu.startYear, edu.endYear]
        .filter(Boolean)
        .join(" - ");

      paragraphs.push(
        new Paragraph({
          spacing: { before: index > 0 ? 120 : 40, after: 20 },
          children: [
            new TextRun({
              text: degreeLine || edu.institution || "Education",
              bold: true,
              size: config.bodySize,
              font: FONT,
              color: config.jobTitleColor,
            }),
            ...(edu.institution
              ? [
                  new TextRun({
                    text: ` \u2014 ${edu.institution}`,
                    size: config.bodySize,
                    font: FONT,
                    color: config.bodyColor,
                  }),
                ]
              : []),
          ],
        })
      );

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
                size: config.contactSize,
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
    paragraphs.push(sectionHeading("Skills", config));
    // Split skills by comma, semicolon, or newline and render as a clean inline list
    const skillItems = data.skills
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter((s) => s);
    if (skillItems.length > 1) {
      // Render as formatted inline list with bullet separators
      const runs: TextRun[] = [];
      skillItems.forEach((skill, i) => {
        if (i > 0) {
          runs.push(
            new TextRun({
              text: "  \u2022  ",
              size: config.bodySize,
              font: FONT,
              color: "999999",
            })
          );
        }
        runs.push(
          new TextRun({
            text: skill,
            size: config.bodySize,
            font: FONT,
            color: config.bodyColor,
          })
        );
      });
      paragraphs.push(
        new Paragraph({
          spacing: { after: config.bodySpacingAfter },
          children: runs,
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          spacing: { after: config.bodySpacingAfter },
          children: [
            new TextRun({
              text: data.skills.trim(),
              size: config.bodySize,
              font: FONT,
              color: config.bodyColor,
            }),
          ],
        })
      );
    }
  }

  // --- Certifications (optional) ---
  if (data.certifications.trim()) {
    paragraphs.push(sectionHeading("Certifications", config));
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
              size: config.bodySize,
              font: FONT,
              color: config.bodyColor,
            }),
          ],
        })
      );
    });
  }

  // --- Languages (optional) ---
  if (data.languages.trim()) {
    paragraphs.push(sectionHeading("Languages", config));
    paragraphs.push(
      new Paragraph({
        spacing: { after: config.bodySpacingAfter },
        children: [
          new TextRun({
            text: data.languages.trim(),
            size: config.bodySize,
            font: FONT,
            color: config.bodyColor,
          }),
        ],
      })
    );
  }

  // --- Hobbies & Interests (optional) ---
  if (data.hobbies.trim()) {
    paragraphs.push(sectionHeading("Hobbies & Interests", config));
    paragraphs.push(
      new Paragraph({
        spacing: { after: config.bodySpacingAfter },
        children: [
          new TextRun({
            text: data.hobbies.trim(),
            size: config.bodySize,
            font: FONT,
            color: config.bodyColor,
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
              top: config.marginTop,
              bottom: config.marginBottom,
              left: config.marginLeft,
              right: config.marginRight,
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
