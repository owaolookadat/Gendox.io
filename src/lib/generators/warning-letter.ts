import { TextRun } from "docx";
import {
  formatDate,
  todayFormatted,
  pickVariant,
  letterHeader,
  letterFooter,
  buildLetterDocument,
  bodyText,
  boldBodyText,
  richBodyText,
  subjectLine,
  salutation,
  spacer,
  BODY_SIZE,
  FONT,
  COLOR_GRAY,
} from "./letter-utils";

export interface WarningLetterData {
  companyName: string;
  managerName: string;
  managerTitle: string;
  employeeName: string;
  employeeTitle: string;
  warningLevel: string;
  dateOfIncident: string;
  descriptionOfIssue: string;
  previousWarnings: string;
  expectedImprovement: string;
  deadlineForImprovement: string;
  consequences: string;
}

// ── Warning-level configuration ──

type WarningLevel = "Verbal" | "Written" | "Final";

interface LevelConfig {
  closingText: string;
  subjectPrefix: string;
  confidentiality: string;
}

const LEVEL_CONFIG: Record<WarningLevel, LevelConfig> = {
  Verbal: {
    closingText: "Kind regards",
    subjectPrefix: "Informal Coaching Discussion",
    confidentiality: "PRIVATE & CONFIDENTIAL",
  },
  Written: {
    closingText: "Yours sincerely",
    subjectPrefix: "Formal Written Warning",
    confidentiality: "STRICTLY CONFIDENTIAL",
  },
  Final: {
    closingText: "Yours faithfully",
    subjectPrefix: "Final Written Warning",
    confidentiality: "STRICTLY CONFIDENTIAL — WITHOUT PREJUDICE",
  },
};

function getLevelConfig(level: string): LevelConfig {
  if (level in LEVEL_CONFIG) return LEVEL_CONFIG[level as WarningLevel];
  return LEVEL_CONFIG["Written"];
}

// ── Variant openings per warning level ──

const VERBAL_OPENINGS = [
  (name: string, company: string) =>
    `Following our recent conversation, I wanted to document the points we discussed regarding your performance at ${company}. This is intended as a constructive coaching discussion, and no formal disciplinary action is being taken at this stage.`,
  (name: string, company: string) =>
    `Thank you for meeting with me to discuss some areas where we believe there is room for growth. I am writing to summarise our conversation and to ensure we are both aligned on the path forward at ${company}.`,
  (name: string, company: string) =>
    `I appreciate you taking the time to speak with me about your recent performance. This letter serves as an informal record of our discussion and the support ${company} is offering to help you succeed.`,
];

const WRITTEN_OPENINGS = [
  (name: string, company: string) =>
    `This letter constitutes a formal written warning in accordance with ${company}'s disciplinary procedure. The purpose of this warning is to clearly communicate the nature of the concern, outline the expected standards, and provide you with an opportunity to improve.`,
  (name: string, company: string) =>
    `In accordance with the disciplinary policy of ${company}, this letter serves as an official written warning regarding your conduct and/or performance. This matter has been reviewed and the decision to issue a formal warning has been made following due consideration.`,
  (name: string, company: string) =>
    `Further to the investigation into the matter outlined below, I am writing to confirm that ${company} has decided to issue you with a formal written warning. This letter sets out the details of the concern, the improvement required, and the consequences of failing to meet the expected standards.`,
];

const FINAL_OPENINGS = [
  (name: string, company: string) =>
    `This letter constitutes a final written warning under ${company}'s disciplinary procedure. You should be aware that this is the last stage of the formal disciplinary process before dismissal. Any further incidents of the nature described below, or a failure to demonstrate sustained improvement, may result in the termination of your employment.`,
  (name: string, company: string) =>
    `Despite previous warnings and opportunities for improvement, the concerns regarding your conduct and/or performance have not been satisfactorily resolved. ${company} is therefore issuing this final written warning. I must emphasise that this represents the final step before potential dismissal.`,
  (name: string, company: string) =>
    `I am writing to inform you that, following a thorough review of your performance and disciplinary record, ${company} has determined that a final written warning is warranted. This is a serious matter, and you should understand that any recurrence of the issues described herein may lead to the termination of your employment without further warning.`,
];

function getOpeningParagraph(level: string, employeeName: string, companyName: string): string {
  const seed = companyName + employeeName;
  switch (level) {
    case "Verbal":
      return pickVariant(VERBAL_OPENINGS, seed)(employeeName, companyName);
    case "Final":
      return pickVariant(FINAL_OPENINGS, seed)(employeeName, companyName);
    default:
      return pickVariant(WRITTEN_OPENINGS, seed)(employeeName, companyName);
  }
}

// ── Previous warnings — escalation-aware text ──

function buildPreviousWarningsSection(level: string, previousWarnings: string) {
  if (!previousWarnings) return [];

  const paragraphs = [];

  if (level === "Final") {
    paragraphs.push(
      boldBodyText("Record of Previous Disciplinary Action")
    );
    paragraphs.push(
      bodyText(
        `The following previous warnings have been issued and remain on your disciplinary record. Despite these earlier interventions, the required improvement has not been achieved:`
      )
    );
  } else if (level === "Written") {
    paragraphs.push(boldBodyText("Previous Warnings"));
    paragraphs.push(
      bodyText(
        `For the record, the following prior concerns have been documented:`
      )
    );
  } else {
    paragraphs.push(boldBodyText("Previous Discussions"));
    paragraphs.push(
      bodyText(
        `We have previously discussed similar concerns informally:`
      )
    );
  }

  paragraphs.push(bodyText(previousWarnings));
  paragraphs.push(spacer());

  return paragraphs;
}

// ── Incident description — tone varies by level ──

function buildIncidentSection(level: string, dateOfIncident: string, description: string) {
  const paragraphs = [];
  const formattedDate = formatDate(dateOfIncident);

  if (level === "Verbal") {
    paragraphs.push(boldBodyText("Area of Concern"));
    paragraphs.push(
      bodyText(
        `On ${formattedDate}, the following matter was brought to attention:`
      )
    );
  } else if (level === "Final") {
    paragraphs.push(boldBodyText("Details of the Incident / Issue"));
    paragraphs.push(
      richBodyText([
        new TextRun({
          text: `Date of incident: `,
          bold: true,
          size: BODY_SIZE,
          font: FONT,
        }),
        new TextRun({
          text: formattedDate,
          size: BODY_SIZE,
          font: FONT,
        }),
      ])
    );
    paragraphs.push(
      bodyText(
        `The specific nature of the misconduct or performance failure is set out below. This description forms part of your formal disciplinary record:`
      )
    );
  } else {
    paragraphs.push(boldBodyText("Details of the Issue"));
    paragraphs.push(
      richBodyText([
        new TextRun({
          text: `Date of incident: `,
          bold: true,
          size: BODY_SIZE,
          font: FONT,
        }),
        new TextRun({
          text: formattedDate,
          size: BODY_SIZE,
          font: FONT,
        }),
      ])
    );
    paragraphs.push(
      bodyText(
        `The following details describe the matter that has led to this formal warning:`
      )
    );
  }

  paragraphs.push(bodyText(description));
  paragraphs.push(spacer());

  return paragraphs;
}

// ── Improvement plan — structured by level ──

function buildImprovementPlanSection(
  level: string,
  expectedImprovement: string,
  deadline: string
) {
  const paragraphs = [];
  const formattedDeadline = formatDate(deadline);

  if (level === "Verbal") {
    paragraphs.push(boldBodyText("Agreed Development Actions"));
    paragraphs.push(
      bodyText(
        `We discussed the following steps to help you improve, and I want to confirm the support available to you:`
      )
    );
    paragraphs.push(bodyText(expectedImprovement));
    paragraphs.push(
      bodyText(
        `We have agreed to review your progress by ${formattedDeadline}. I am confident that with the right support and focus, you will be able to meet these expectations. Please do not hesitate to reach out if you need any additional guidance or resources.`
      )
    );
  } else if (level === "Final") {
    paragraphs.push(boldBodyText("Required Improvement and Performance Standards"));
    paragraphs.push(
      bodyText(
        `You are required to meet the following specific, measurable standards of conduct and/or performance. Failure to achieve and sustain these improvements will be treated as grounds for dismissal:`
      )
    );
    paragraphs.push(bodyText(expectedImprovement));
    paragraphs.push(
      richBodyText([
        new TextRun({
          text: `Review date: `,
          bold: true,
          size: BODY_SIZE,
          font: FONT,
        }),
        new TextRun({
          text: `Your performance will be formally reviewed on or before ${formattedDeadline}. You must demonstrate sustained and measurable improvement by this date. Interim reviews may be conducted at management's discretion.`,
          size: BODY_SIZE,
          font: FONT,
        }),
      ])
    );
  } else {
    paragraphs.push(boldBodyText("Improvement Plan"));
    paragraphs.push(
      bodyText(
        `You are expected to take immediate steps to address the issues outlined above. The following improvement actions are required:`
      )
    );
    paragraphs.push(bodyText(expectedImprovement));
    paragraphs.push(
      richBodyText([
        new TextRun({
          text: `Review date: `,
          bold: true,
          size: BODY_SIZE,
          font: FONT,
        }),
        new TextRun({
          text: `Your progress will be reviewed by ${formattedDeadline}. You are expected to demonstrate clear and sustained improvement by this date.`,
          size: BODY_SIZE,
          font: FONT,
        }),
      ])
    );
  }

  paragraphs.push(spacer());
  return paragraphs;
}

// ── Consequences section — tone and severity by level ──

function buildConsequencesSection(level: string, consequences: string) {
  const paragraphs = [];

  if (level === "Verbal") {
    paragraphs.push(boldBodyText("What Happens Next"));
    paragraphs.push(
      bodyText(
        `If the agreed improvements are not achieved within the timeframe discussed, it may become necessary to proceed to a more formal stage of the disciplinary process. However, I want to emphasise that the intention of this conversation is to support your development and help you succeed in your role.`
      )
    );
    if (consequences) {
      paragraphs.push(bodyText(consequences));
    }
  } else if (level === "Final") {
    paragraphs.push(boldBodyText("Consequences of Failure to Improve"));
    paragraphs.push(
      bodyText(
        `You are hereby placed on notice that if the required improvement is not achieved and sustained, or if there is any further instance of misconduct or unsatisfactory performance, the company reserves the right to proceed to dismissal. This may include summary dismissal in cases of gross misconduct.`
      )
    );
    if (consequences) {
      paragraphs.push(bodyText(consequences));
    }
  } else {
    paragraphs.push(boldBodyText("Consequences if Improvement Is Not Demonstrated"));
    paragraphs.push(
      bodyText(
        `If the required standards are not met within the specified timeframe, further disciplinary action will be taken, which may include a final written warning.`
      )
    );
    if (consequences) {
      paragraphs.push(bodyText(consequences));
    }
  }

  paragraphs.push(spacer());
  return paragraphs;
}

// ── Right to appeal (Written and Final only) ──

function buildAppealSection(level: string, companyName: string) {
  if (level === "Verbal") return [];

  const paragraphs = [];
  paragraphs.push(boldBodyText("Right of Appeal"));

  if (level === "Final") {
    paragraphs.push(
      bodyText(
        `You have the right to appeal against this final written warning. Any appeal must be submitted in writing to the Human Resources department within five working days of receiving this letter. Your appeal should clearly state the grounds on which you are appealing. An appeal hearing will be convened and conducted by a manager who has not previously been involved in this matter. The outcome of the appeal will be communicated to you in writing.`
      )
    );
  } else {
    paragraphs.push(
      bodyText(
        `You have the right to appeal against this written warning. If you wish to appeal, please submit your reasons in writing to the Human Resources department within five working days of receiving this letter. An appeal hearing will be arranged and the outcome communicated to you in writing.`
      )
    );
  }

  paragraphs.push(spacer());
  return paragraphs;
}

// ── Support paragraph (Verbal only) ──

function buildSupportSection(level: string, managerName: string) {
  if (level !== "Verbal") return [];

  return [
    bodyText(
      `I want you to know that I am here to support you through this process. If there are any obstacles preventing you from meeting expectations — whether workload, training needs, or personal circumstances — please let me know so we can work together to find a solution. My door is always open.`
    ),
    spacer(),
  ];
}

// ── Acknowledgment block ──

function buildAcknowledgmentBlock(level: string) {
  const paragraphs = [];

  if (level === "Verbal") {
    paragraphs.push(boldBodyText("Acknowledgment of Discussion"));
    paragraphs.push(
      bodyText(
        `By signing below, you acknowledge that this coaching discussion has taken place and that you understand the areas for improvement outlined above. Your signature does not indicate agreement with all points discussed, only that you have received this summary.`
      )
    );
  } else {
    paragraphs.push(boldBodyText("Acknowledgment of Receipt"));
    paragraphs.push(
      bodyText(
        `By signing below, you acknowledge that you have received a copy of this ${level.toLowerCase()} warning and that its contents have been explained to you. Your signature does not necessarily indicate agreement with the contents of this letter, only that you have received and read it.`
      )
    );
  }

  paragraphs.push(spacer());

  // Employee signature line
  paragraphs.push(
    richBodyText([
      new TextRun({
        text: "Employee Signature: ",
        size: BODY_SIZE,
        font: FONT,
      }),
      new TextRun({
        text: "________________________________",
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
    ])
  );
  paragraphs.push(
    richBodyText([
      new TextRun({
        text: "Print Name: ",
        size: BODY_SIZE,
        font: FONT,
      }),
      new TextRun({
        text: "________________________________",
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
    ])
  );
  paragraphs.push(
    richBodyText([
      new TextRun({
        text: "Date: ",
        size: BODY_SIZE,
        font: FONT,
      }),
      new TextRun({
        text: "________________________________",
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
    ])
  );

  paragraphs.push(spacer());

  // Witness signature line (Written and Final)
  if (level !== "Verbal") {
    paragraphs.push(
      richBodyText([
        new TextRun({
          text: "Witness Signature: ",
          size: BODY_SIZE,
          font: FONT,
        }),
        new TextRun({
          text: "________________________________",
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
      ])
    );
    paragraphs.push(
      richBodyText([
        new TextRun({
          text: "Print Name: ",
          size: BODY_SIZE,
          font: FONT,
        }),
        new TextRun({
          text: "________________________________",
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
      ])
    );
    paragraphs.push(
      richBodyText([
        new TextRun({
          text: "Date: ",
          size: BODY_SIZE,
          font: FONT,
        }),
        new TextRun({
          text: "________________________________",
          size: BODY_SIZE,
          font: FONT,
          color: COLOR_GRAY,
        }),
      ])
    );
  }

  return paragraphs;
}

// ── Confidentiality banner ──

function confidentialityBanner(level: string) {
  const config = getLevelConfig(level);
  return boldBodyText(config.confidentiality);
}

// ── Main generator ──

export async function generateWarningLetter(
  data: WarningLetterData
): Promise<Blob> {
  const today = todayFormatted();
  const config = getLevelConfig(data.warningLevel);

  const paragraphs = [
    // Confidentiality marking
    confidentialityBanner(data.warningLevel),
    spacer(),

    // Standard letter header
    ...letterHeader({
      senderName: data.managerName,
      senderTitle: data.managerTitle,
      senderCompany: data.companyName,
      date: today,
      recipientName: data.employeeName,
      recipientTitle: data.employeeTitle,
      recipientCompany: data.companyName,
    }),

    // Salutation and subject
    salutation(data.employeeName),
    subjectLine(config.subjectPrefix),

    // Opening paragraph — variant based on company name hash
    bodyText(getOpeningParagraph(data.warningLevel, data.employeeName, data.companyName)),
    spacer(),

    // Previous warnings (escalation-aware)
    ...buildPreviousWarningsSection(data.warningLevel, data.previousWarnings),

    // Incident details
    ...buildIncidentSection(data.warningLevel, data.dateOfIncident, data.descriptionOfIssue),

    // Structured improvement plan
    ...buildImprovementPlanSection(
      data.warningLevel,
      data.expectedImprovement,
      data.deadlineForImprovement
    ),

    // Consequences
    ...buildConsequencesSection(data.warningLevel, data.consequences),

    // Support section (Verbal only)
    ...buildSupportSection(data.warningLevel, data.managerName),

    // Right to appeal (Written and Final only)
    ...buildAppealSection(data.warningLevel, data.companyName),

    // Copy retention notice
    bodyText(
      `A copy of this letter will be placed on your personnel file${
        data.warningLevel === "Verbal"
          ? " as a record of this coaching discussion."
          : data.warningLevel === "Final"
          ? " and will remain active for a period of twelve months from the date of this letter, subject to any further disciplinary action."
          : " and will remain on record for a period of twelve months from the date of this letter."
      }`
    ),
    spacer(),

    // Footer with signature
    ...letterFooter({
      closingText: config.closingText,
      signerName: data.managerName,
      signerTitle: data.managerTitle,
      signerCompany: data.companyName,
    }),

    spacer(),
    spacer(),

    // Acknowledgment / signature block
    ...buildAcknowledgmentBlock(data.warningLevel),
  ];

  return await buildLetterDocument(paragraphs);
}
