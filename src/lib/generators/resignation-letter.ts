import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export type Tone = "professional" | "grateful" | "brief";

export interface ResignationLetterData {
  yourName: string;
  yourEmail: string;
  yourPhone: string;
  yourAddress: string;
  jobTitle: string;
  companyName: string;
  companyAddress: string;
  managerName: string;
  managerTitle: string;
  lastWorkingDay: string;
  reason: string;
  noticePeriod: string;
  personalMessage: string;
  tone: Tone;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isLeadershipRole(jobTitle: string): boolean {
  const keywords = ["manager", "director", "lead", "head", "vp", "senior", "supervisor"];
  const lower = jobTitle.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function getNoticePeriodSentence(noticePeriod: string, lastDayFormatted: string): string {
  if (!noticePeriod || noticePeriod === "Immediate") {
    return `I am writing to formally notify you of my resignation from my position, effective immediately as of ${lastDayFormatted}.`;
  }
  return `I am writing to formally notify you of my resignation, providing ${noticePeriod.toLowerCase()} notice. My last working day will be ${lastDayFormatted}.`;
}

function getReasonSentence(reason: string, tone: Tone): string[] {
  if (tone === "brief") {
    switch (reason) {
      case "New Opportunity":
        return ["I have accepted a position elsewhere."];
      case "Personal Reasons":
        return ["I am leaving for personal reasons."];
      case "Career Change":
        return ["I am pursuing a change in career direction."];
      case "Relocation":
        return ["I am relocating and unable to continue in this role."];
      case "Other":
        return ["I have decided to move on from this position."];
      default:
        return [];
    }
  }

  if (tone === "grateful") {
    switch (reason) {
      case "New Opportunity":
        return [
          "While I have greatly valued my time here, I have been offered an exciting new opportunity that I feel I must pursue for my continued professional development.",
          "The encouragement and support I have received from you and the team gave me the confidence to take this step.",
        ];
      case "Personal Reasons":
        return [
          "Due to personal circumstances, I have made the difficult decision to step away from this role, though I do so with a heavy heart given how rewarding this experience has been.",
          "I am deeply grateful for the understanding and flexibility you have always shown, which has made my time here truly meaningful.",
        ];
      case "Career Change":
        return [
          "After much reflection, I have decided to pursue a different career path. The skills and experiences I have gained here have been instrumental in helping me identify this new direction.",
          "The encouragement and support I have received from you and the team gave me the confidence to take this step.",
        ];
      case "Relocation":
        return [
          "I am relocating and will unfortunately no longer be able to continue in this position. I am truly grateful for the wonderful experience of working with you and the team.",
          "The memories and professional relationships I have built here will stay with me wherever I go.",
        ];
      case "Other":
        return [
          "After careful and thoughtful consideration, I have decided to move on from this position. I want you to know how much I have valued my time here.",
          "The growth I have experienced both professionally and personally during my tenure is something I will always treasure.",
        ];
      default:
        return [];
    }
  }

  // professional (default)
  switch (reason) {
    case "New Opportunity":
      return [
        "I have accepted a new position that aligns with my long-term career objectives and will allow me to continue growing professionally.",
        "I am confident that this move will allow me to continue developing the skills I have honed during my time here.",
      ];
    case "Personal Reasons":
      return [
        "I am resigning due to personal reasons that require my full attention at this time.",
        "This decision was not made lightly, and I remain committed to a professional transition.",
      ];
    case "Career Change":
      return [
        "I have decided to pursue a career change that I believe will be the right next step in my professional journey.",
        "The experience and expertise I have gained in this role have been invaluable in shaping this decision.",
      ];
    case "Relocation":
      return [
        "I am relocating and will no longer be able to fulfil the requirements of this role.",
        "I remain committed to ensuring all responsibilities are properly handed over before my departure.",
      ];
    case "Other":
      return [
        "After careful consideration, I have decided to move on from this position to explore new opportunities.",
        "This decision reflects my professional goals and is not a reflection of my experience here, which has been consistently positive.",
      ];
    default:
      return [];
  }
}

function getHandoverSentence(jobTitle: string): string {
  if (isLeadershipRole(jobTitle)) {
    return "I will prepare a comprehensive handover document covering all ongoing projects and team responsibilities to ensure continuity.";
  }
  return "I will complete all outstanding tasks and document any ongoing work to ensure a smooth handover.";
}

function getTransitionSentence(tone: Tone, noticePeriod: string): string {
  if (tone === "brief") {
    if (!noticePeriod || noticePeriod === "Immediate") {
      return "I understand the short notice and will do everything I can to ensure a smooth transition before my departure.";
    }
    return "I will ensure a smooth handover during my remaining time.";
  }

  if (!noticePeriod || noticePeriod === "Immediate") {
    return "I understand the short notice and will do everything I can to ensure a smooth transition before my departure.";
  }

  if (noticePeriod === "1 Week" || noticePeriod === "2 Weeks") {
    const period = noticePeriod.toLowerCase();
    if (tone === "grateful") {
      return `During my remaining ${period}, I am fully committed to completing all pending work and supporting the handover process. Please let me know how I can best help during this time.`;
    }
    return `During my remaining ${period}, I am committed to completing all pending work and supporting the handover process.`;
  }

  if (noticePeriod === "1 Month") {
    if (tone === "grateful") {
      return "With a full month ahead, I will work closely with you to ensure all responsibilities are properly transitioned and my replacement, if hired, is thoroughly briefed. I want to make this as seamless as possible for you and the team.";
    }
    return "With a full month ahead, I will work closely with you to ensure all responsibilities are properly transitioned and my replacement, if hired, is thoroughly briefed.";
  }

  // "Other" or any custom notice period
  if (tone === "grateful") {
    return "I am fully committed to making this transition as seamless as possible. Please let me know how I can best support the handover process and help train my replacement during my remaining time.";
  }
  return "I am committed to ensuring a smooth transition and am happy to assist with handover activities during my notice period.";
}

function getClosingSentence(tone: Tone): string {
  if (tone === "brief") {
    return "Thank you for the opportunity.";
  }
  if (tone === "grateful") {
    return "I want to sincerely thank you for your mentorship, guidance, and the countless opportunities for professional and personal growth during my time here. I will always look back on this chapter of my career with great fondness.";
  }
  return "Thank you for the opportunities for professional growth that I have been afforded during my time at the company. I wish you and the team continued success.";
}

/**
 * Returns the body paragraphs of the letter as an array of strings.
 * Does NOT include header blocks (sender info, date, recipient) or sign-off.
 * Used by both the preview component and generateLetterText.
 */
export function generateLetterParagraphs(data: ResignationLetterData): string[] {
  const lastDayFormatted = data.lastWorkingDay
    ? formatDate(data.lastWorkingDay)
    : "[Last Working Day]";
  const tone = data.tone || "professional";
  const paragraphs: string[] = [];

  // Opening paragraph with notice period
  const jobTitleText = data.jobTitle || "[Job Title]";
  const companyText = data.companyName || "[Company Name]";
  if (!data.noticePeriod || data.noticePeriod === "Immediate") {
    paragraphs.push(
      `I am writing to formally notify you of my resignation from my position as ${jobTitleText} at ${companyText}, effective immediately as of ${lastDayFormatted}.`
    );
  } else {
    paragraphs.push(
      `I am writing to formally notify you of my resignation from my position as ${jobTitleText} at ${companyText}, providing ${data.noticePeriod.toLowerCase()} notice. My last working day will be ${lastDayFormatted}.`
    );
  }

  // Reason sentences
  if (data.reason) {
    const reasonSentences = getReasonSentence(data.reason, tone);
    if (reasonSentences.length > 0) {
      paragraphs.push(reasonSentences.join(" "));
    }
  }

  // Personal message
  if (data.personalMessage && data.personalMessage.trim()) {
    paragraphs.push(data.personalMessage.trim());
  }

  // Role-aware handover sentence
  if (data.jobTitle) {
    paragraphs.push(getHandoverSentence(data.jobTitle));
  }

  // Notice-period-aware transition sentence
  paragraphs.push(getTransitionSentence(tone, data.noticePeriod));

  // Closing
  paragraphs.push(getClosingSentence(tone));

  return paragraphs;
}

export function generateLetterText(data: ResignationLetterData): string {
  const todayFormatted = formatDate(new Date().toISOString());
  const tone = data.tone || "professional";

  const lines: string[] = [];

  lines.push(data.yourName || "[Your Name]");
  if (data.yourAddress) lines.push(data.yourAddress);
  if (data.yourEmail) lines.push(data.yourEmail);
  if (data.yourPhone) lines.push(data.yourPhone);
  lines.push("");
  lines.push(todayFormatted);
  lines.push("");
  lines.push(data.managerName || "[Manager Name]");
  if (data.managerTitle) lines.push(data.managerTitle);
  lines.push(data.companyName || "[Company Name]");
  if (data.companyAddress) lines.push(data.companyAddress);
  lines.push("");
  lines.push(`Dear ${data.managerName || "[Manager Name]"},`);
  lines.push("");

  const bodyParagraphs = generateLetterParagraphs(data);
  for (const p of bodyParagraphs) {
    lines.push(p);
    lines.push("");
  }

  lines.push("Yours sincerely,");
  lines.push("");
  lines.push("");
  lines.push(data.yourName || "[Your Name]");

  return lines.join("\n");
}

export async function generateResignationLetter(
  data: ResignationLetterData
): Promise<Blob> {
  const todayFormatted = formatDate(new Date().toISOString());
  const tone = data.tone || "professional";

  const FONT = "Calibri";
  const BODY_SIZE = 24; // 12pt
  const SPACING_AFTER = 200;

  const paragraphs: Paragraph[] = [];

  // Your Name - bold, larger
  paragraphs.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: data.yourName,
          bold: true,
          size: 28,
          font: FONT,
        }),
      ],
    })
  );

  // Your address
  if (data.yourAddress) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: data.yourAddress,
            size: BODY_SIZE,
            font: FONT,
            color: "555555",
          }),
        ],
      })
    );
  }

  // Your email
  if (data.yourEmail) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: data.yourEmail,
            size: BODY_SIZE,
            font: FONT,
            color: "555555",
          }),
        ],
      })
    );
  }

  // Your phone
  if (data.yourPhone) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: data.yourPhone,
            size: BODY_SIZE,
            font: FONT,
            color: "555555",
          }),
        ],
      })
    );
  }

  // Spacer
  paragraphs.push(new Paragraph({ spacing: { after: SPACING_AFTER }, children: [] }));

  // Date
  paragraphs.push(
    new Paragraph({
      spacing: { after: SPACING_AFTER },
      children: [
        new TextRun({ text: todayFormatted, size: BODY_SIZE, font: FONT }),
      ],
    })
  );

  // Recipient block
  paragraphs.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: data.managerName,
          size: BODY_SIZE,
          font: FONT,
        }),
      ],
    })
  );

  if (data.managerTitle) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: data.managerTitle,
            size: BODY_SIZE,
            font: FONT,
          }),
        ],
      })
    );
  }

  paragraphs.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: data.companyName,
          size: BODY_SIZE,
          font: FONT,
        }),
      ],
    })
  );

  if (data.companyAddress) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: data.companyAddress,
            size: BODY_SIZE,
            font: FONT,
          }),
        ],
      })
    );
  }

  // Spacer
  paragraphs.push(new Paragraph({ spacing: { after: SPACING_AFTER }, children: [] }));

  // Salutation
  paragraphs.push(
    new Paragraph({
      spacing: { after: SPACING_AFTER },
      children: [
        new TextRun({
          text: `Dear ${data.managerName},`,
          size: BODY_SIZE,
          font: FONT,
        }),
      ],
    })
  );

  // Body paragraphs from shared function
  const bodyParagraphs = generateLetterParagraphs(data);
  for (const bodyText of bodyParagraphs) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: SPACING_AFTER },
        children: [
          new TextRun({ text: bodyText, size: BODY_SIZE, font: FONT }),
        ],
      })
    );
  }

  // Yours sincerely
  paragraphs.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: "Yours sincerely,",
          size: BODY_SIZE,
          font: FONT,
        }),
      ],
    })
  );

  // Signature space
  paragraphs.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
  paragraphs.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // Typed name
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.yourName,
          bold: true,
          size: BODY_SIZE,
          font: FONT,
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
