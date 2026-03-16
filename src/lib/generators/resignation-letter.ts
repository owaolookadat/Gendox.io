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

function getReasonSentence(reason: string, tone: Tone): string {
  if (tone === "brief") {
    switch (reason) {
      case "New Opportunity":
        return "I have accepted a position elsewhere.";
      case "Personal Reasons":
        return "I am leaving for personal reasons.";
      case "Career Change":
        return "I am pursuing a change in career direction.";
      case "Relocation":
        return "I am relocating and unable to continue in this role.";
      case "Other":
        return "I have decided to move on from this position.";
      default:
        return "";
    }
  }

  if (tone === "grateful") {
    switch (reason) {
      case "New Opportunity":
        return "While I have greatly valued my time here, I have been offered an exciting new opportunity that I feel I must pursue for my continued professional development.";
      case "Personal Reasons":
        return "Due to personal circumstances, I have made the difficult decision to step away from this role, though I do so with a heavy heart given how rewarding this experience has been.";
      case "Career Change":
        return "After much reflection, I have decided to pursue a different career path. The skills and experiences I have gained here have been instrumental in helping me identify this new direction.";
      case "Relocation":
        return "I am relocating and will unfortunately no longer be able to continue in this position. I am truly grateful for the wonderful experience of working with you and the team.";
      case "Other":
        return "After careful and thoughtful consideration, I have decided to move on from this position. I want you to know how much I have valued my time here.";
      default:
        return "";
    }
  }

  // professional (default)
  switch (reason) {
    case "New Opportunity":
      return "I have accepted a new position that aligns with my long-term career objectives and will allow me to continue growing professionally.";
    case "Personal Reasons":
      return "I am resigning due to personal reasons that require my full attention at this time.";
    case "Career Change":
      return "I have decided to pursue a career change that I believe will be the right next step in my professional journey.";
    case "Relocation":
      return "I am relocating and will no longer be able to fulfil the requirements of this role.";
    case "Other":
      return "After careful consideration, I have decided to move on from this position to explore new opportunities.";
    default:
      return "";
  }
}

function getTransitionSentence(tone: Tone): string {
  if (tone === "brief") {
    return "I will ensure a smooth handover during my remaining time.";
  }
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

export function generateLetterText(data: ResignationLetterData): string {
  const todayFormatted = formatDate(new Date().toISOString());
  const lastDayFormatted = data.lastWorkingDay
    ? formatDate(data.lastWorkingDay)
    : "[Last Working Day]";
  const tone = data.tone || "professional";
  const reasonSentence = data.reason ? getReasonSentence(data.reason, tone) : "";

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
  lines.push(
    `I am writing to formally notify you of my resignation from my position as ${data.jobTitle || "[Job Title]"} at ${data.companyName || "[Company Name]"}, effective ${lastDayFormatted}.`
  );

  if (reasonSentence) {
    lines.push("");
    lines.push(reasonSentence);
  }

  if (data.personalMessage && data.personalMessage.trim()) {
    lines.push("");
    lines.push(data.personalMessage.trim());
  }

  lines.push("");
  lines.push(getTransitionSentence(tone));

  lines.push("");
  lines.push(getClosingSentence(tone));

  lines.push("");
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
  const lastDayFormatted = data.lastWorkingDay
    ? formatDate(data.lastWorkingDay)
    : "";
  const tone = data.tone || "professional";
  const reasonSentence = data.reason ? getReasonSentence(data.reason, tone) : "";

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

  // Main paragraph
  paragraphs.push(
    new Paragraph({
      spacing: { after: SPACING_AFTER },
      children: [
        new TextRun({
          text: `I am writing to formally notify you of my resignation from my position as ${data.jobTitle} at ${data.companyName}, effective ${lastDayFormatted}.`,
          size: BODY_SIZE,
          font: FONT,
        }),
      ],
    })
  );

  // Reason paragraph
  if (reasonSentence) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: SPACING_AFTER },
        children: [
          new TextRun({ text: reasonSentence, size: BODY_SIZE, font: FONT }),
        ],
      })
    );
  }

  // Personal message paragraph
  if (data.personalMessage && data.personalMessage.trim()) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: SPACING_AFTER },
        children: [
          new TextRun({
            text: data.personalMessage.trim(),
            size: BODY_SIZE,
            font: FONT,
          }),
        ],
      })
    );
  }

  // Transition paragraph
  paragraphs.push(
    new Paragraph({
      spacing: { after: SPACING_AFTER },
      children: [
        new TextRun({
          text: getTransitionSentence(tone),
          size: BODY_SIZE,
          font: FONT,
        }),
      ],
    })
  );

  // Closing thank you
  paragraphs.push(
    new Paragraph({
      spacing: { after: SPACING_AFTER },
      children: [
        new TextRun({
          text: getClosingSentence(tone),
          size: BODY_SIZE,
          font: FONT,
        }),
      ],
    })
  );

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
