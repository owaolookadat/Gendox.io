import {
  letterHeader,
  letterFooter,
  buildLetterDocument,
  bodyText,
  boldBodyText,
  simpleHash,
  todayFormatted,
  formatDate,
  salutation,
  subjectLine,
  spacer,
  BODY_SIZE,
  FONT,
  COLOR_GRAY,
} from "./letter-utils";
import { Paragraph, TextRun } from "docx";

export interface ComplaintLetterData {
  yourName: string;
  yourAddress: string;
  recipientName: string;
  recipientTitle: string;
  organizationName: string;
  organizationAddress: string;
  dateOfIssue: string;
  subject: string;
  descriptionOfComplaint: string;
  previousAttempts: string;
  desiredResolution: string;
  deadlineForResponse: string;
}

// ── Opening variants (selected deterministically by subject hash) ──

const openingVariants = [
  (subject: string, dateOfIssue: string) =>
    `I am writing to formally register my dissatisfaction regarding ${subject}. Despite my reasonable expectations as a customer, the experience I encountered on ${dateOfIssue} fell significantly below an acceptable standard, and I believe this matter requires your immediate attention.`,
  (subject: string, dateOfIssue: string) =>
    `I wish to raise a formal complaint concerning ${subject}, relating to an incident on ${dateOfIssue}. I am deeply disappointed by the level of service I have received and feel compelled to bring this matter to your attention directly.`,
  (subject: string, dateOfIssue: string) =>
    `I am compelled to write to you regarding a serious matter concerning ${subject}. The issue, which occurred on ${dateOfIssue}, has caused me considerable inconvenience and frustration, and I expect it to be addressed with the urgency it deserves.`,
];

// ── Severity-based closing variants ──

function getClosingParagraphs(
  deadlineForResponse: string,
  previousAttempts: string
): { paragraphs: string[]; closingText: string } {
  const hasDeadline = !!deadlineForResponse;
  const hasPreviousAttempts = !!previousAttempts;
  const formattedDeadline = hasDeadline
    ? formatDate(deadlineForResponse)
    : "";

  // Higher severity: has previous attempts and a deadline
  if (hasPreviousAttempts && hasDeadline) {
    return {
      paragraphs: [
        `I require a full written response to this complaint no later than ${formattedDeadline}. Given the history of this matter and my previous unsuccessful attempts at resolution, I must advise you that should I not receive a satisfactory response within this timeframe, I will not hesitate to escalate this complaint to the relevant regulatory body, ombudsman, or seek independent legal advice to protect my interests.`,
        `I am confident that your organisation will wish to resolve this matter promptly and avoid the need for further action. I reserve all my rights in this matter, including but not limited to any remedies available to me under applicable consumer protection legislation.`,
      ],
      closingText: "Yours faithfully",
    };
  }

  // Medium severity: has deadline but no previous attempts
  if (hasDeadline) {
    return {
      paragraphs: [
        `I would appreciate a written acknowledgement of this complaint within five working days, and a full and substantive response no later than ${formattedDeadline}. Should this deadline pass without resolution, I may be obliged to consider alternative means of resolving this matter, including referral to the appropriate regulatory authority or ombudsman service.`,
        `I trust that your organisation takes customer complaints seriously and will give this matter the prompt attention it warrants.`,
      ],
      closingText: "Yours sincerely",
    };
  }

  // Lower severity: no deadline
  return {
    paragraphs: [
      `I would appreciate a written acknowledgement of this complaint within five working days, followed by a full response outlining the steps you intend to take to resolve this matter. I trust this will receive your prompt and careful attention.`,
    ],
    closingText: "Yours sincerely",
  };
}

// ── Reference number line ──

function referenceLine(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 40 },
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
      new TextRun({
        text: value,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
    ],
  });
}

// ── Main generator ──

export async function generateComplaintLetter(
  data: ComplaintLetterData
): Promise<Blob> {
  const today = todayFormatted();
  const formattedDateOfIssue = formatDate(data.dateOfIssue);

  // Select opening variant deterministically
  const variantIndex = simpleHash(data.subject) % openingVariants.length;
  const openingText = openingVariants[variantIndex](
    data.subject,
    formattedDateOfIssue
  );

  // Get severity-appropriate closing
  const closingInfo = getClosingParagraphs(
    data.deadlineForResponse,
    data.previousAttempts
  );

  // Generate a reference number from the date and subject
  const refHash = simpleHash(data.subject + data.dateOfIssue)
    .toString(36)
    .toUpperCase()
    .slice(0, 6);
  const yourReference = `CMP-${refHash}`;

  const paragraphs: Paragraph[] = [
    // Standard letter header
    ...letterHeader({
      senderName: data.yourName,
      senderAddress: data.yourAddress || undefined,
      date: today,
      recipientName: data.recipientName,
      recipientTitle: data.recipientTitle || undefined,
      recipientCompany: data.organizationName,
      recipientAddress: data.organizationAddress || undefined,
    }),

    // Reference numbers
    referenceLine("Your ref", yourReference),
    spacer(),

    // Salutation
    salutation(data.recipientName),

    // Subject line
    subjectLine(data.subject),

    // Strong opening paragraph
    bodyText(openingText),

    // Detailed description
    boldBodyText("Details of Complaint"),
    bodyText(
      `${data.descriptionOfComplaint} This matter has caused me significant inconvenience and falls well short of the standard I would reasonably expect from your organisation.`
    ),
  ];

  // Previous attempts with escalation language
  if (data.previousAttempts) {
    paragraphs.push(boldBodyText("Previous Attempts at Resolution"));
    paragraphs.push(
      bodyText(
        `I have already made reasonable efforts to resolve this matter through your normal channels, as outlined below. Regrettably, these attempts have failed to produce a satisfactory outcome, which has necessitated this formal written complaint.`
      )
    );
    paragraphs.push(bodyText(data.previousAttempts));
  }

  // Desired resolution with specific, actionable demands
  paragraphs.push(boldBodyText("Required Resolution"));
  paragraphs.push(
    bodyText(
      `In order to resolve this complaint to my satisfaction, I require the following action to be taken: ${data.desiredResolution}. I believe this to be a fair and reasonable expectation given the circumstances described above.`
    )
  );

  // Deadline and consequences paragraphs
  for (const p of closingInfo.paragraphs) {
    paragraphs.push(bodyText(p));
  }

  // Footer
  paragraphs.push(
    ...letterFooter({
      closingText: closingInfo.closingText,
      signerName: data.yourName,
    })
  );

  return buildLetterDocument(paragraphs);
}
