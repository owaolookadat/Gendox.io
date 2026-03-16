import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export type CoverLetterStyle = "Professional" | "Enthusiastic" | "Concise";

export interface CoverLetterData {
  yourName: string;
  yourEmail: string;
  yourPhone: string;
  location: string;
  linkedin: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  jobTitle: string;
  yearsExperience: string;
  keySkills: string;
  whyInterested: string;
  closingStatement: string;
  style: CoverLetterStyle;
}

function formatDate(): string {
  const date = new Date();
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildContactLine(data: CoverLetterData): string {
  const parts: string[] = [];
  if (data.yourEmail.trim()) parts.push(data.yourEmail.trim());
  if (data.yourPhone.trim()) parts.push(data.yourPhone.trim());
  if (data.location.trim()) parts.push(data.location.trim());
  if (data.linkedin.trim()) parts.push(data.linkedin.trim());
  return parts.join("  |  ");
}

function buildOpeningParagraph(data: CoverLetterData): string {
  const { style, jobTitle, companyName, yearsExperience } = data;

  if (style === "Enthusiastic") {
    return `I am thrilled to apply for the ${jobTitle} position at ${companyName}. With ${yearsExperience} years of hands-on experience in this field, I am eager to bring my energy and expertise to your team and make a meaningful impact from day one.`;
  }

  if (style === "Concise") {
    return `I am applying for the ${jobTitle} role at ${companyName}. I bring ${yearsExperience} years of relevant experience and a strong track record of delivering results.`;
  }

  // Professional (default)
  return `I am writing to express my interest in the ${jobTitle} position at ${companyName}. With ${yearsExperience} years of professional experience, I am confident that my background and skills make me a strong candidate for this role.`;
}

function buildSkillsParagraph(data: CoverLetterData): string {
  const skills = data.keySkills.trim();
  if (!skills) return "";

  const { style, companyName } = data;

  if (style === "Enthusiastic") {
    return `Throughout my career, I have developed a powerful combination of skills that I am passionate about putting to work. ${skills} These capabilities have allowed me to consistently exceed expectations, and I am excited about the opportunity to leverage them at ${companyName}.`;
  }

  if (style === "Concise") {
    return `Key qualifications: ${skills}`;
  }

  // Professional
  return `Throughout my career, I have built a comprehensive skill set that is directly relevant to this position. ${skills} I am confident these qualifications position me to contribute effectively to your team.`;
}

function buildInterestParagraph(data: CoverLetterData): string {
  const interest = data.whyInterested.trim();
  if (!interest) return "";

  const { style, companyName } = data;

  if (style === "Enthusiastic") {
    return `What truly excites me about ${companyName} is the opportunity to be part of something special. ${interest} I would be honoured to contribute my passion and skills to help drive your continued success.`;
  }

  if (style === "Concise") {
    return `I am drawn to ${companyName} because ${interest}`;
  }

  // Professional
  return `I am particularly drawn to this opportunity at ${companyName} for several reasons. ${interest} I believe this alignment between my professional goals and your organisation's direction makes this an ideal fit.`;
}

function buildClosingParagraph(data: CoverLetterData): string {
  const custom = data.closingStatement.trim();
  const { style } = data;

  if (custom) {
    return custom;
  }

  if (style === "Enthusiastic") {
    return "I would absolutely love the opportunity to discuss how I can contribute to your team's success. I am available for an interview at your earliest convenience and look forward to the possibility of working together!";
  }

  if (style === "Concise") {
    return "I welcome the opportunity to discuss this role further. I am available for an interview at your convenience.";
  }

  // Professional
  return "I would welcome the opportunity to discuss how my skills and experience align with your needs. I am available for an interview at your convenience and look forward to hearing from you.";
}

function buildSignOff(style: CoverLetterStyle): string {
  if (style === "Enthusiastic") return "With enthusiasm,";
  if (style === "Concise") return "Best regards,";
  return "Yours sincerely,";
}

export function generateCoverLetterText(data: CoverLetterData): {
  opening: string;
  skills: string;
  interest: string;
  closing: string;
  signOff: string;
} {
  return {
    opening: buildOpeningParagraph(data),
    skills: buildSkillsParagraph(data),
    interest: buildInterestParagraph(data),
    closing: buildClosingParagraph(data),
    signOff: buildSignOff(data.style),
  };
}

export async function generateCoverLetter(
  data: CoverLetterData
): Promise<Blob> {
  const todayFormatted = formatDate();
  const contactLine = buildContactLine(data);
  const text = generateCoverLetterText(data);

  const bodySize = 24; // 12pt
  const spacingAfter = 200;

  const paragraphs: Paragraph[] = [
    // Name — large and bold
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: data.yourName, bold: true, size: 28, font: "Calibri" }),
      ],
    }),
    // Contact details line
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: contactLine,
          size: 20,
          color: "555555",
          font: "Calibri",
        }),
      ],
    }),
    // Date
    new Paragraph({
      spacing: { after: spacingAfter },
      children: [new TextRun({ text: todayFormatted, size: bodySize, font: "Calibri" })],
    }),
  ];

  // Recipient block
  if (data.recipientName.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: data.recipientName, size: bodySize, font: "Calibri" }),
        ],
      })
    );
  }
  if (data.recipientTitle.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: data.recipientTitle, size: bodySize, font: "Calibri" }),
        ],
      })
    );
  }
  if (data.companyName.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: data.companyName, size: bodySize, font: "Calibri" }),
        ],
      })
    );
  }
  if (data.companyAddress.trim()) {
    const addressLines = data.companyAddress.split("\n");
    for (const line of addressLines) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: line, size: bodySize, font: "Calibri" }),
          ],
        })
      );
    }
  }

  // Blank line before salutation
  paragraphs.push(new Paragraph({ spacing: { after: spacingAfter }, children: [] }));

  // Salutation
  const salutationName = data.recipientName.trim() || "Hiring Manager";
  paragraphs.push(
    new Paragraph({
      spacing: { after: spacingAfter },
      children: [
        new TextRun({
          text: `Dear ${salutationName},`,
          size: bodySize,
          font: "Calibri",
        }),
      ],
    })
  );

  // Opening paragraph
  paragraphs.push(
    new Paragraph({
      spacing: { after: spacingAfter },
      children: [
        new TextRun({ text: text.opening, size: bodySize, font: "Calibri" }),
      ],
    })
  );

  // Skills paragraph
  if (text.skills) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: spacingAfter },
        children: [
          new TextRun({ text: text.skills, size: bodySize, font: "Calibri" }),
        ],
      })
    );
  }

  // Interest paragraph
  if (text.interest) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: spacingAfter },
        children: [
          new TextRun({ text: text.interest, size: bodySize, font: "Calibri" }),
        ],
      })
    );
  }

  // Closing paragraph
  paragraphs.push(
    new Paragraph({
      spacing: { after: spacingAfter },
      children: [
        new TextRun({ text: text.closing, size: bodySize, font: "Calibri" }),
      ],
    })
  );

  // Sign-off
  paragraphs.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: text.signOff, size: bodySize, font: "Calibri" }),
      ],
    })
  );

  // Signature name
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.yourName,
          bold: true,
          size: bodySize,
          font: "Calibri",
        }),
      ],
    })
  );

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
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
