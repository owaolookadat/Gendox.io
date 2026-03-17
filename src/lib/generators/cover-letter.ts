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

/**
 * Simple string hash to pick a consistent opening variant based on company name.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

type RoleCategory = "engineering" | "marketing" | "finance" | "management" | "general";

function detectRoleCategory(jobTitle: string): RoleCategory {
  const lower = jobTitle.toLowerCase();
  const engineeringKeywords = ["engineer", "developer", "architect", "devops", "data"];
  const marketingKeywords = ["marketing", "designer", "creative", "content", "brand"];
  const financeKeywords = ["finance", "analyst", "accountant", "consultant", "business"];
  const managementKeywords = ["manager", "director", "head", "lead", "vp"];

  if (engineeringKeywords.some((kw) => lower.includes(kw))) return "engineering";
  if (marketingKeywords.some((kw) => lower.includes(kw))) return "marketing";
  if (financeKeywords.some((kw) => lower.includes(kw))) return "finance";
  if (managementKeywords.some((kw) => lower.includes(kw))) return "management";
  return "general";
}

function getCategoryOpeningPhrase(category: RoleCategory, years: string): string {
  switch (category) {
    case "engineering":
      return `With ${years} years of hands-on experience in`;
    case "marketing":
      return `As a creative professional with ${years} years of experience in`;
    case "finance":
      return `With ${years} years of analytical expertise in`;
    case "management":
      return `As an experienced leader with ${years} years of`;
    default:
      return `With ${years} years of professional experience in`;
  }
}

function formatSkillsNaturally(keySkills: string, yearsExperience: string): string {
  const trimmed = keySkills.trim();
  if (!trimmed) return "";

  // Check if skills contain commas (structured list)
  if (trimmed.includes(",")) {
    const skills = trimmed
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skills.length === 1) {
      return `My expertise in ${skills[0]}, honed over ${yearsExperience} years of professional experience, has equipped me to deliver consistent results.`;
    }
    if (skills.length === 2) {
      return `My expertise spans ${skills[0]} and ${skills[1]}, honed over ${yearsExperience} years of professional experience.`;
    }
    const allButLast = skills.slice(0, -1).join(", ");
    const last = skills[skills.length - 1];
    return `My expertise spans ${allButLast}, and ${last}, honed over ${yearsExperience} years of professional experience.`;
  }

  // Freeform text — use as-is
  return trimmed;
}

function buildOpeningParagraph(data: CoverLetterData): string {
  const { style, jobTitle, companyName, yearsExperience } = data;
  const category = detectRoleCategory(jobTitle);
  const categoryPhrase = getCategoryOpeningPhrase(category, yearsExperience);

  // Pick a varied opening based on hash of company name
  const variant = simpleHash(companyName) % 4;

  if (style === "Enthusiastic") {
    const openings = [
      `I was excited to discover the ${jobTitle} opening at ${companyName}. ${categoryPhrase} this field, I am eager to bring my energy and expertise to your team and make a meaningful impact from day one.`,
      `The ${jobTitle} position at ${companyName} immediately caught my attention. ${categoryPhrase} this field, I am thrilled at the prospect of contributing my skills and enthusiasm to your organisation.`,
      `I am eager to bring my ${yearsExperience} years of experience to the ${jobTitle} role at ${companyName}. ${categoryPhrase} this field, I am passionate about delivering exceptional results and driving innovation.`,
      `I am writing to apply for the ${jobTitle} role at ${companyName}. ${categoryPhrase} this field, I am excited about the opportunity to bring my passion and proven track record to your team.`,
    ];
    return openings[variant];
  }

  if (style === "Concise") {
    const openings = [
      `I am applying for the ${jobTitle} role at ${companyName}. I bring ${yearsExperience} years of relevant experience and a strong track record of delivering results.`,
      `I am writing to apply for the ${jobTitle} position at ${companyName}. ${categoryPhrase} this field, I offer a proven ability to deliver measurable outcomes.`,
      `The ${jobTitle} position at ${companyName} immediately caught my attention. I bring ${yearsExperience} years of directly relevant experience.`,
      `I am eager to bring my ${yearsExperience} years of experience to the ${jobTitle} role at ${companyName}, where I can contribute immediately.`,
    ];
    return openings[variant];
  }

  // Professional (default)
  const openings = [
    `I am writing to express my interest in the ${jobTitle} position at ${companyName}. ${categoryPhrase} this field, I am confident that my background and skills make me a strong candidate for this role.`,
    `I was excited to discover the ${jobTitle} opening at ${companyName}. ${categoryPhrase} this field, I believe my qualifications align closely with the requirements of this position.`,
    `The ${jobTitle} position at ${companyName} immediately caught my attention. ${categoryPhrase} this field, I am confident I can bring significant value to your organisation.`,
    `I am eager to bring my ${yearsExperience} years of experience to the ${jobTitle} role at ${companyName}. ${categoryPhrase} this field, I have consistently delivered strong results and am ready for this next challenge.`,
  ];
  return openings[variant];
}

function buildSkillsParagraph(data: CoverLetterData): string {
  const skills = data.keySkills.trim();
  if (!skills) return "";

  const { style, companyName, yearsExperience } = data;
  const formattedSkills = formatSkillsNaturally(skills, yearsExperience);

  if (style === "Enthusiastic") {
    return `Throughout my career, I have developed a powerful combination of skills that I am passionate about putting to work. ${formattedSkills} These capabilities have allowed me to consistently exceed expectations, and I am excited about the opportunity to leverage them at ${companyName}.`;
  }

  if (style === "Concise") {
    return `Key qualifications: ${formattedSkills}`;
  }

  // Professional
  return `Throughout my career, I have built a comprehensive skill set that is directly relevant to this position. ${formattedSkills} I am confident these qualifications position me to contribute effectively to your team.`;
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

function buildAvailabilityParagraph(style: CoverLetterStyle): string {
  if (style === "Enthusiastic") {
    return "I am available to start at your earliest convenience and would absolutely welcome the opportunity to discuss how my background aligns with your team's goals.";
  }
  if (style === "Concise") {
    return "I am available to start at your earliest convenience and welcome the chance to discuss this role further.";
  }
  return "I am available to start at your earliest convenience and would welcome the opportunity to discuss how my background aligns with your team's goals.";
}

function buildClosingParagraph(data: CoverLetterData): string {
  const custom = data.closingStatement.trim();
  const { style } = data;

  if (custom) {
    return custom;
  }

  if (style === "Enthusiastic") {
    return "I would absolutely love the opportunity to discuss how I can contribute to your team's success. I look forward to the possibility of working together!";
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

export interface CoverLetterTextResult {
  opening: string;
  skills: string;
  interest: string;
  availability: string;
  closing: string;
  signOff: string;
}

export function generateCoverLetterText(data: CoverLetterData): CoverLetterTextResult {
  return {
    opening: buildOpeningParagraph(data),
    skills: buildSkillsParagraph(data),
    interest: buildInterestParagraph(data),
    availability: buildAvailabilityParagraph(data.style),
    closing: buildClosingParagraph(data),
    signOff: buildSignOff(data.style),
  };
}

/**
 * Returns the body paragraphs of the cover letter as an array of strings.
 * Used by both the preview component and the DOCX generator to stay in sync.
 */
export function generateCoverLetterParagraphs(data: CoverLetterData): string[] {
  const text = generateCoverLetterText(data);
  const paragraphs: string[] = [];

  paragraphs.push(text.opening);
  if (text.skills) paragraphs.push(text.skills);
  if (text.interest) paragraphs.push(text.interest);
  paragraphs.push(text.availability);
  paragraphs.push(text.closing);

  return paragraphs;
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
    // Name - large and bold
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

  // Body paragraphs from shared function
  const bodyParagraphs = generateCoverLetterParagraphs(data);
  for (const bodyText of bodyParagraphs) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: spacingAfter },
        children: [
          new TextRun({ text: bodyText, size: bodySize, font: "Calibri" }),
        ],
      })
    );
  }

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
