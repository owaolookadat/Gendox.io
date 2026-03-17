import { Paragraph, TextRun, BorderStyle, AlignmentType } from "docx";
import {
  FONT,
  BODY_SIZE,
  SMALL_SIZE,
  COLOR_DARK,
  COLOR_GRAY,
  COLOR_LIGHT,
  SPACING,
  SPACING_TIGHT,
  SPACING_NONE,
  formatDate,
  todayFormatted,
  simpleHash,
  pickVariant,
  letterHeader,
  letterFooter,
  buildLetterDocument,
  bodyText,
  boldBodyText,
  richBodyText,
  spacer,
  subjectLine,
} from "./letter-utils";

export interface OfferLetterData {
  companyName: string;
  companyAddress: string;
  candidateName: string;
  jobTitle: string;
  department: string;
  startDate: string;
  salary: number;
  payFrequency: string;
  benefitsSummary: string;
  reportingTo: string;
  employmentType: string;
  responseDeadline: string;
}

// ── Employment-type descriptions ──

function employmentTypeDescription(type: string): string {
  switch (type) {
    case "Full-Time":
      return "full-time, permanent";
    case "Part-Time":
      return "part-time";
    case "Contract":
      return "fixed-term contract";
    case "Temporary":
      return "temporary";
    default:
      return type.toLowerCase();
  }
}

function employmentTypeContext(type: string, jobTitle: string): string {
  switch (type) {
    case "Full-Time":
      return `As a full-time member of our team, you will be entitled to all standard employee benefits and will be expected to work standard business hours as determined by your manager.`;
    case "Part-Time":
      return `As a part-time employee, your working hours and schedule will be agreed upon with your manager. Benefits eligibility will be determined on a pro-rata basis in accordance with company policy.`;
    case "Contract":
      return `This is a fixed-term contract position. The terms and duration of the contract, including any provisions for renewal, will be outlined in your formal employment agreement.`;
    case "Temporary":
      return `This is a temporary position. The anticipated duration and any potential for extension or conversion to a permanent role will be discussed during your onboarding.`;
    default:
      return `The specific terms of your ${type.toLowerCase()} engagement will be outlined in your formal employment agreement.`;
  }
}

// ── Salary formatting ──

function formatSalary(amount: number, frequency: string): string {
  const formatted = new Intl.NumberFormat("en-GB", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  switch (frequency) {
    case "Annual":
      return `${formatted} per annum`;
    case "Monthly":
      return `${formatted} per month`;
    case "Hourly":
      return `${formatted} per hour`;
    case "Weekly":
      return `${formatted} per week`;
    default:
      return formatted;
  }
}

function paymentScheduleNote(frequency: string): string {
  switch (frequency) {
    case "Annual":
      return "paid in equal monthly instalments";
    case "Monthly":
      return "paid on or before the last working day of each month";
    case "Hourly":
      return "payable in arrears on a monthly basis";
    case "Weekly":
      return "paid weekly in arrears";
    default:
      return "paid in accordance with the company's standard payroll schedule";
  }
}

// ── Acceptance section ──

function acceptanceSection(
  candidateName: string,
  jobTitle: string,
  companyName: string
): Paragraph[] {
  const divider = new Paragraph({
    spacing: { before: 400, after: 200 },
    border: {
      top: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: COLOR_LIGHT,
        space: 8,
      },
    },
    children: [],
  });

  const heading = new Paragraph({
    spacing: SPACING,
    children: [
      new TextRun({
        text: "ACCEPTANCE OF OFFER",
        bold: true,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_DARK,
      }),
    ],
  });

  const declaration = new Paragraph({
    spacing: SPACING,
    children: [
      new TextRun({
        text: `I, ${candidateName}, accept the offer of employment for the position of ${jobTitle} at ${companyName} on the terms and conditions set out in this letter.`,
        size: BODY_SIZE,
        font: FONT,
      }),
    ],
  });

  const signLabel = new Paragraph({
    spacing: { after: 0 },
    children: [
      new TextRun({
        text: "Signature: ________________________________________",
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
    ],
  });

  const printedName = new Paragraph({
    spacing: { before: 300, after: 0 },
    children: [
      new TextRun({
        text: `Printed Name: ${candidateName}`,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
    ],
  });

  const dateLine = new Paragraph({
    spacing: { before: 300, after: 0 },
    children: [
      new TextRun({
        text: "Date: ________________________________________",
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_GRAY,
      }),
    ],
  });

  const returnNote = new Paragraph({
    spacing: { before: 400 },
    children: [
      new TextRun({
        text: "Please sign and return a copy of this letter to confirm your acceptance.",
        italics: true,
        size: SMALL_SIZE,
        font: FONT,
        color: COLOR_LIGHT,
      }),
    ],
  });

  return [divider, heading, declaration, spacer(), signLabel, printedName, dateLine, returnNote];
}

// ── Main generator ──

export async function generateOfferLetter(
  data: OfferLetterData
): Promise<Blob> {
  const today = todayFormatted();
  const paragraphs: Paragraph[] = [];

  // ── Header ──
  paragraphs.push(
    ...letterHeader({
      senderName: data.companyName,
      senderAddress: data.companyAddress,
      date: today,
      recipientName: data.candidateName,
    })
  );

  // ── Subject line ──
  paragraphs.push(subjectLine(`Offer of Employment — ${data.jobTitle}`));

  // ── Salutation ──
  paragraphs.push(bodyText(`Dear ${data.candidateName},`));

  // ── Opening paragraph (varies by company name) ──
  const openingVariants = [
    `Following our recent discussions, we are delighted to extend an offer of employment to you on behalf of ${data.companyName}. Your skills, experience, and enthusiasm stood out throughout the selection process, and we are confident you will make an outstanding contribution to our team.`,
    `On behalf of ${data.companyName}, I am thrilled to confirm that we would like to offer you a position with our organisation. Your qualifications and the professionalism you demonstrated during the interview process left a strong impression, and we believe you will be a tremendous asset to the team.`,
    `It is with great pleasure that I write to formally offer you a role at ${data.companyName}. Having carefully evaluated all candidates, we are convinced that your background and capabilities make you the ideal fit for this position, and we are excited about the prospect of you joining us.`,
    `We are very pleased to inform you that, after careful consideration, ${data.companyName} would like to offer you employment with our organisation. Your experience and the qualities you displayed during the selection process make you an excellent match for this role, and we look forward to welcoming you aboard.`,
  ];
  paragraphs.push(bodyText(pickVariant(openingVariants, data.companyName)));

  // ── Role details paragraph ──
  const typeDesc = employmentTypeDescription(data.employmentType);
  paragraphs.push(
    bodyText(
      `We are offering you the ${typeDesc} position of ${data.jobTitle} within the ${data.department} department. In this role, you will report directly to ${data.reportingTo}. ${employmentTypeContext(data.employmentType, data.jobTitle)}`
    )
  );

  // ── Compensation paragraph ──
  const salaryStr = formatSalary(data.salary, data.payFrequency);
  const scheduleNote = paymentScheduleNote(data.payFrequency);
  paragraphs.push(
    richBodyText([
      new TextRun({
        text: "Your starting compensation will be ",
        size: BODY_SIZE,
        font: FONT,
      }),
      new TextRun({
        text: `£${salaryStr}`,
        bold: true,
        size: BODY_SIZE,
        font: FONT,
      }),
      new TextRun({
        text: `, ${scheduleNote}. This figure is gross and subject to all applicable statutory deductions including income tax and National Insurance contributions. Your compensation will be reviewed in line with the company's standard review cycle.`,
        size: BODY_SIZE,
        font: FONT,
      }),
    ])
  );

  // ── Benefits paragraph (if provided) ──
  if (data.benefitsSummary && data.benefitsSummary.trim()) {
    paragraphs.push(
      bodyText(
        `In addition to your salary, you will be eligible for the following benefits: ${data.benefitsSummary.trim()}. Full details of all benefit entitlements, including eligibility criteria and enrolment procedures, will be provided during your onboarding.`
      )
    );
  }

  // ── Start date and onboarding paragraph ──
  const startDateStr = formatDate(data.startDate);
  paragraphs.push(
    bodyText(
      `Your anticipated start date is ${startDateStr}. On your first day, please report to reception where a member of the ${data.department} team will greet you and guide you through the onboarding process. You will receive further details regarding documentation, identification requirements, and any pre-employment checks in a separate communication prior to your start date.`
    )
  );

  // ── Response deadline paragraph ──
  const deadlineStr = formatDate(data.responseDeadline);
  paragraphs.push(
    bodyText(
      `This offer is contingent upon the satisfactory completion of any pre-employment checks and the receipt of satisfactory references. We kindly ask that you confirm your acceptance of this offer in writing by ${deadlineStr}. Should you have any questions or require clarification on any aspect of this offer, please do not hesitate to contact us — we are happy to discuss.`
    )
  );

  // ── Welcoming close paragraph ──
  const closingVariants = [
    `We are genuinely excited about the possibility of you joining ${data.companyName} and are confident that this role will provide you with an engaging and rewarding career opportunity. We very much look forward to your positive response.`,
    `Everyone involved in the selection process was impressed by your candidacy, and we truly believe this is the beginning of a mutually rewarding professional relationship. We eagerly await your response and hope to welcome you to ${data.companyName} soon.`,
    `We believe you will thrive at ${data.companyName}, and we are committed to supporting your professional development from day one. We hope you are as enthusiastic about this opportunity as we are, and we look forward to hearing from you.`,
  ];
  paragraphs.push(bodyText(pickVariant(closingVariants, data.candidateName + data.companyName)));

  // ── Footer / sign-off ──
  paragraphs.push(
    ...letterFooter({
      closingText: "Yours sincerely",
      signerName: data.companyName,
    })
  );

  // ── Acceptance section ──
  paragraphs.push(
    ...acceptanceSection(data.candidateName, data.jobTitle, data.companyName)
  );

  return buildLetterDocument(paragraphs);
}
