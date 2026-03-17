import { Paragraph, TextRun } from "docx";
import {
  letterHeader,
  letterFooter,
  buildLetterDocument,
  bodyText,
  boldBodyText,
  richBodyText,
  spacer,
  todayFormatted,
  formatDate,
  BODY_SIZE,
  FONT,
  SPACING,
  SPACING_TIGHT,
  COLOR_DARK,
  COLOR_GRAY,
} from "./letter-utils";

export interface DemandLetterData {
  yourName: string;
  yourAddress: string;
  recipientName: string;
  recipientAddress: string;
  subject: string;
  amountOwed: string;
  descriptionOfClaim: string;
  supportingFacts: string;
  demand: string;
  deadline: string;
  consequences: string;
}

// ── Helper: "SENT VIA RECORDED DELIVERY" notice ──

function recordedDeliveryNotice(): Paragraph {
  return new Paragraph({
    spacing: SPACING,
    children: [
      new TextRun({
        text: "SENT VIA RECORDED DELIVERY",
        bold: true,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_DARK,
      }),
    ],
  });
}

// ── Helper: bold subject line with formal demand prefix ──

function formalSubjectLine(subject: string, hasAmount: boolean): Paragraph {
  const prefix = hasAmount
    ? "FORMAL DEMAND — LETTER BEFORE ACTION"
    : "FORMAL DEMAND";
  return new Paragraph({
    spacing: SPACING,
    children: [
      new TextRun({
        text: `Re: ${prefix} — ${subject}`,
        bold: true,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_DARK,
      }),
    ],
  });
}

// ── Helper: horizontal rule ──

function horizontalRule(): Paragraph {
  return new Paragraph({
    spacing: SPACING,
    border: {
      bottom: {
        style: "single" as any,
        size: 6,
        color: "cccccc",
        space: 1,
      },
    },
    children: [],
  });
}

// ── Build the opening paragraph ──

function buildOpening(data: DemandLetterData): string {
  const amount = data.amountOwed.trim();
  if (amount) {
    return (
      `I am writing to formally demand payment of ${amount} which is owed to me and remains outstanding. ` +
      `This letter constitutes a formal letter before action. Should this matter not be resolved within the timeframe set out below, ` +
      `I shall have no alternative but to issue proceedings without further notice.`
    );
  }
  return (
    `I am writing to formally demand resolution of the matter described below. ` +
    `This letter constitutes a formal letter before action. Should this matter not be resolved within the timeframe set out below, ` +
    `I shall have no alternative but to issue proceedings without further notice.`
  );
}

// ── Build the legal basis paragraph ──

function buildLegalBasis(data: DemandLetterData): string {
  const amount = data.amountOwed.trim();
  const lines: string[] = [];

  lines.push(
    `The facts set out above give rise to a clear legal obligation on your part.`
  );

  if (amount) {
    lines.push(
      `The debt in question constitutes a breach of contract and/or an obligation arising under the terms agreed between us. ` +
      `You may also wish to note that under the Late Payment of Commercial Debts (Interest) Act 1998, I am entitled to claim statutory ` +
      `interest at 8% above the Bank of England base rate on any outstanding commercial debt, in addition to reasonable recovery costs.`
    );
  } else {
    lines.push(
      `Your failure to act constitutes a breach of the obligations owed to me, whether arising under contract, ` +
      `consumer protection legislation, or the general duty of care. I reserve the right to rely on all applicable legal provisions ` +
      `in any subsequent proceedings.`
    );
  }

  return lines.join(" ");
}

// ── Build the demand with deadline ──

function buildDemandSection(data: DemandLetterData): string {
  const deadlineStr = data.deadline ? formatDate(data.deadline) : "[Deadline]";
  const amount = data.amountOwed.trim();

  const lines: string[] = [data.demand.trim()];

  if (amount) {
    lines.push(
      `I require payment of ${amount} in full, to be received no later than ${deadlineStr}.`
    );
  } else {
    lines.push(
      `I require full compliance with the above demand no later than ${deadlineStr}.`
    );
  }

  return lines.join(" ");
}

// ── Build the consequences paragraph ──

function buildConsequences(data: DemandLetterData): string {
  const amount = data.amountOwed.trim();
  const userConsequences = data.consequences.trim();

  const lines: string[] = [];

  lines.push(
    `If I do not receive a satisfactory response within the timeframe specified above, I intend to take the following steps without further notice:`
  );

  if (userConsequences) {
    lines.push(userConsequences);
  }

  // Standard legal consequences
  const standardConsequences: string[] = [];

  if (amount) {
    standardConsequences.push(
      `Issue a claim through the County Court (Small Claims Track or Fast Track as appropriate) for the full amount outstanding, ` +
      `together with statutory interest accrued to date and continuing to accrue until judgment or payment, whichever is sooner.`
    );
    standardConsequences.push(
      `Seek recovery of all court fees, reasonable legal costs, and any additional costs permitted under the Late Payment of Commercial Debts (Interest) Act 1998.`
    );
    standardConsequences.push(
      `Report the outstanding debt to relevant credit reference agencies where applicable.`
    );
  } else {
    standardConsequences.push(
      `Issue proceedings in the County Court seeking an appropriate remedy, including but not limited to damages, specific performance, or injunctive relief.`
    );
    standardConsequences.push(
      `Seek recovery of all court fees, legal costs, and any consequential losses arising from your failure to act.`
    );
  }

  standardConsequences.push(
    `Report this matter to any relevant regulatory bodies or industry ombudsman services as appropriate.`
  );

  lines.push(standardConsequences.join(" "));

  return lines.join(" ");
}

// ── "Without prejudice save as to costs" notice ──

function withoutPrejudiceNotice(): string {
  return (
    `This letter is written without prejudice save as to costs. In the event that proceedings are issued, ` +
    `I reserve the right to bring this letter to the attention of the court on the question of costs, ` +
    `in accordance with Part 36 of the Civil Procedure Rules and the court's general discretion as to costs.`
  );
}

// ── Interest calculation note ──

function interestNote(amountOwed: string): string {
  return (
    `Please note that statutory interest continues to accrue on the outstanding sum of ${amountOwed} at the rate of 8% per annum above the ` +
    `Bank of England base rate from the date on which payment became due. The longer this debt remains unpaid, the greater the total ` +
    `sum for which you will be liable.`
  );
}

// ── Litigation timeline notice ──

function litigationTimeline(deadline: string): string {
  const deadlineStr = deadline ? formatDate(deadline) : "[Deadline]";
  return (
    `For the avoidance of doubt, if I have not received a satisfactory response by ${deadlineStr}, ` +
    `I will instruct solicitors and/or commence proceedings promptly thereafter. Court proceedings will be issued ` +
    `within 14 days of the expiry of the above deadline. This letter should be treated as formal notification ` +
    `in compliance with the Pre-Action Protocol for Debt Claims and/or the Practice Direction on Pre-Action Conduct.`
  );
}

// ── Main generator ──

export async function generateDemandLetter(
  data: DemandLetterData
): Promise<Blob> {
  const today = todayFormatted();
  const hasAmount = !!data.amountOwed.trim();

  const paragraphs: Paragraph[] = [
    // Professional letterhead-style header
    ...letterHeader({
      senderName: data.yourName,
      senderAddress: data.yourAddress,
      date: today,
      recipientName: data.recipientName,
      recipientAddress: data.recipientAddress,
    }),

    // Recorded delivery notice
    recordedDeliveryNotice(),

    // Formal subject line
    formalSubjectLine(data.subject, hasAmount),

    // Salutation — use "Dear Sir/Madam" style for formal legal letters
    new Paragraph({
      spacing: SPACING,
      children: [
        new TextRun({
          text: `Dear ${data.recipientName},`,
          size: BODY_SIZE,
          font: FONT,
        }),
      ],
    }),

    // Opening paragraph
    bodyText(buildOpening(data)),

    // Statement of facts
    boldBodyText("Statement of Facts"),
    bodyText(data.descriptionOfClaim.trim()),

    // Supporting facts / evidence
    boldBodyText("Supporting Evidence"),
    bodyText(data.supportingFacts.trim()),

    // Legal basis
    boldBodyText("Legal Basis"),
    bodyText(buildLegalBasis(data)),

    // Specific demand with deadline
    boldBodyText("Demand"),
    bodyText(buildDemandSection(data)),
  ];

  // Interest calculation note (for debt demands only)
  if (hasAmount) {
    paragraphs.push(boldBodyText("Interest"));
    paragraphs.push(bodyText(interestNote(data.amountOwed.trim())));
  }

  // Consequences of non-compliance
  paragraphs.push(boldBodyText("Consequences of Non-Compliance"));
  paragraphs.push(bodyText(buildConsequences(data)));

  // Litigation timeline
  paragraphs.push(boldBodyText("Litigation Timeline"));
  paragraphs.push(bodyText(litigationTimeline(data.deadline)));

  // Without prejudice save as to costs
  paragraphs.push(horizontalRule());
  paragraphs.push(
    richBodyText([
      new TextRun({
        text: withoutPrejudiceNotice(),
        italics: true,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
    ])
  );
  paragraphs.push(horizontalRule());

  // Closing
  paragraphs.push(
    bodyText(
      `I trust this matter can be resolved without the need for court proceedings. However, please be advised that I am fully prepared to ` +
      `pursue all available legal remedies should you fail to comply with this demand within the timeframe specified.`
    )
  );

  // Professional sign-off
  paragraphs.push(
    ...letterFooter({
      closingText: "Yours faithfully",
      signerName: data.yourName,
    })
  );

  return buildLetterDocument(paragraphs);
}
