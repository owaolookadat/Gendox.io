import { Paragraph, TextRun } from "docx";
import {
  BODY_SIZE,
  FONT,
  formatDate,
  todayFormatted,
  letterHeader,
  letterFooter,
  buildLetterDocument,
  bodyText,
  boldBodyText,
  richBodyText,
  salutation,
  subjectLine,
  spacer,
} from "./letter-utils";

export interface TerminationLetterData {
  companyName: string;
  employeeName: string;
  employeeTitle: string;
  terminationDate: string;
  reason: string;
  details: string;
  finalPayDate: string;
  benefitsEndDate: string;
  returnOfProperty: string;
  severanceDetails: string;
  hrContactName: string;
  hrContactEmail: string;
}

type TerminationReason =
  | "Performance"
  | "Misconduct"
  | "Redundancy"
  | "Restructuring"
  | "End of Contract"
  | "Probation Failure"
  | "Other";

function normaliseReason(raw: string): TerminationReason {
  const lower = raw.toLowerCase().trim();
  if (lower.includes("performance")) return "Performance";
  if (lower.includes("misconduct")) return "Misconduct";
  if (lower.includes("redundancy")) return "Redundancy";
  if (lower.includes("restructuring")) return "Restructuring";
  if (lower.includes("end of contract") || lower.includes("contract")) return "End of Contract";
  if (lower.includes("probation")) return "Probation Failure";
  return "Other";
}

// ── Subject lines by reason ──

function subjectText(reason: TerminationReason): string {
  switch (reason) {
    case "Performance":
      return "Termination of Employment — Performance";
    case "Misconduct":
      return "Termination of Employment — Gross Misconduct";
    case "Redundancy":
      return "Termination of Employment — Redundancy";
    case "Restructuring":
      return "Termination of Employment — Organisational Restructuring";
    case "End of Contract":
      return "End of Fixed-Term Contract";
    case "Probation Failure":
      return "Termination of Employment — Probationary Period";
    default:
      return "Termination of Employment";
  }
}

// ── Opening paragraphs tailored to reason ──

function openingParagraphs(data: TerminationLetterData, reason: TerminationReason): Paragraph[] {
  const name = data.employeeName;
  const title = data.employeeTitle;
  const company = data.companyName;
  const effectiveDate = formatDate(data.terminationDate);

  switch (reason) {
    case "Performance":
      return [
        bodyText(
          `Following a thorough review of your performance in the role of ${title} at ${company}, and after careful consideration of the steps taken to support your improvement, we regret to inform you that a decision has been made to terminate your employment. Your termination will take effect on ${effectiveDate}.`
        ),
        bodyText(
          `This decision has not been taken lightly. As documented in previous performance reviews and formal communications, specific areas requiring improvement were identified and communicated to you, along with the support and resources necessary to meet the required standards. Despite these measures, the expected level of performance has not been sustained.`
        ),
      ];

    case "Misconduct":
      return [
        bodyText(
          `This letter serves as formal notification that your employment with ${company} in the role of ${title} is terminated with immediate effect, or no later than ${effectiveDate}, on the grounds of gross misconduct.`
        ),
        bodyText(
          `Following a thorough investigation and a disciplinary hearing conducted in accordance with the company's disciplinary procedure, the outcome has confirmed that your conduct constitutes a serious breach of company policy and your contractual obligations. The nature of the misconduct is such that the relationship of trust and confidence between you and the company has been irreparably undermined.`
        ),
      ];

    case "Redundancy":
      return [
        bodyText(
          `It is with sincere regret that I write to confirm that your position of ${title} at ${company} has been made redundant. As a result, your employment will come to an end on ${effectiveDate}.`
        ),
        bodyText(
          `This decision is the outcome of a comprehensive business review and is driven solely by operational and economic factors. It is in no way a reflection of your performance, conduct, or contribution to the organisation, all of which have been valued. Every effort was made to identify suitable alternative roles within the company; however, no appropriate vacancy has been found.`
        ),
      ];

    case "Restructuring":
      return [
        bodyText(
          `Further to the recent consultation process regarding the organisational restructuring of ${company}, I am writing to confirm that your role of ${title} will cease to exist as part of these changes. Your employment will therefore end on ${effectiveDate}.`
        ),
        bodyText(
          `The restructuring is necessary to ensure the long-term viability and competitiveness of the business. This decision relates to changes in the structure and requirements of the organisation and does not reflect upon your individual capabilities or the quality of your work.`
        ),
      ];

    case "End of Contract":
      return [
        bodyText(
          `I am writing to confirm that your fixed-term contract of employment with ${company} in the role of ${title} will expire and will not be renewed. Your final day of employment will be ${effectiveDate}.`
        ),
        bodyText(
          `As set out in the terms of your contract, the engagement was for a defined period and the business requirements that gave rise to the role have now been fulfilled. We wish to thank you for the contribution you have made during the term of your contract.`
        ),
      ];

    case "Probation Failure":
      return [
        bodyText(
          `Following a review of your progress during the probationary period for the role of ${title} at ${company}, I regret to inform you that a decision has been made not to confirm your appointment. Your employment will therefore be terminated on ${effectiveDate}.`
        ),
        bodyText(
          `During the probationary period, regular assessments were carried out and feedback was provided to support you in meeting the standards required for the role. Notwithstanding the guidance and support offered, the necessary competencies and standards have not been consistently demonstrated. This decision has been taken in accordance with the probationary review process as outlined in your contract of employment.`
        ),
      ];

    default:
      return [
        bodyText(
          `This letter serves as formal notification that your employment with ${company} in the role of ${title} will be terminated effective ${effectiveDate}.`
        ),
      ];
  }
}

// ── Details paragraph (user-provided context) ──

function detailsParagraph(data: TerminationLetterData, reason: TerminationReason): Paragraph[] {
  if (!data.details.trim()) return [];

  const preamble: Record<TerminationReason, string> = {
    Performance:
      "The specific performance concerns that have led to this decision are detailed below:",
    Misconduct:
      "The findings of the disciplinary investigation are summarised as follows:",
    Redundancy:
      "For your reference, the business rationale for this decision is set out below:",
    Restructuring:
      "The changes affecting your role are outlined below:",
    "End of Contract":
      "For context, the following information is provided:",
    "Probation Failure":
      "The areas in which the required standards were not met are summarised below:",
    Other:
      "The circumstances surrounding this decision are outlined below:",
  };

  return [
    boldBodyText(preamble[reason]),
    bodyText(data.details.trim()),
  ];
}

// ── Return of property paragraph (conditional) ──

function returnOfPropertyParagraphs(data: TerminationLetterData): Paragraph[] {
  if (!data.returnOfProperty.trim()) return [];

  return [
    boldBodyText("Return of Company Property"),
    bodyText(
      `You are required to return all company property in your possession on or before your final day of employment. This includes, but is not limited to: ${data.returnOfProperty.trim()}. Please arrange the return of these items with ${data.hrContactName} at your earliest convenience. Failure to return company property may result in the cost of replacement being deducted from your final pay, in accordance with the terms of your employment contract.`
    ),
  ];
}

// ── Final pay and benefits paragraph ──

function finalPayParagraphs(data: TerminationLetterData, reason: TerminationReason): Paragraph[] {
  const payDate = formatDate(data.finalPayDate);
  const benefitsDate = formatDate(data.benefitsEndDate);

  const accruals =
    reason === "Misconduct"
      ? "Your final pay, which will include salary owed up to and including your termination date and any accrued but untaken statutory holiday entitlement, will be processed on"
      : "Your final pay, which will include salary owed up to and including your termination date, any accrued but untaken holiday entitlement, and any other contractual payments due, will be processed on";

  return [
    boldBodyText("Final Pay and Benefits"),
    bodyText(
      `${accruals} ${payDate}. Any applicable deductions, including tax, national insurance, pension contributions, and any outstanding amounts owed to the company, will be applied in the usual manner.`
    ),
    bodyText(
      `Your participation in company benefit schemes, including but not limited to health insurance, pension, and any other employee benefits, will continue until ${benefitsDate}, after which date your coverage will cease. You will receive separate written confirmation of your options regarding the continuation or transfer of any applicable benefits, including pension entitlements.`
    ),
  ];
}

// ── Severance details paragraph (conditional) ──

function severanceParagraphs(data: TerminationLetterData, reason: TerminationReason): Paragraph[] {
  if (!data.severanceDetails.trim()) return [];

  const intro =
    reason === "Redundancy" || reason === "Restructuring"
      ? "In recognition of your service and in accordance with company policy and statutory requirements, the following severance arrangements have been made:"
      : "Subject to the terms and conditions set out below, the following severance arrangements have been offered:";

  return [
    boldBodyText("Severance Arrangements"),
    bodyText(intro),
    bodyText(data.severanceDetails.trim()),
    bodyText(
      `The severance payment is subject to the deduction of tax and national insurance contributions as required by law. Where applicable, receipt of the severance payment may be conditional upon the execution of a settlement agreement, the terms of which will be provided separately. You are advised to seek independent legal advice before entering into any such agreement, and a reasonable contribution towards the cost of that advice will be provided by the company.`
    ),
  ];
}

// ── Legal rights and appeal process paragraph ──

function legalRightsParagraphs(data: TerminationLetterData, reason: TerminationReason): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(boldBodyText("Your Rights"));

  if (reason === "Misconduct" || reason === "Performance" || reason === "Probation Failure") {
    paragraphs.push(
      bodyText(
        `You have the right to appeal this decision. Any appeal must be submitted in writing to ${data.hrContactName} at ${data.hrContactEmail} within five working days of the date of this letter. Your appeal should set out the grounds on which you wish to challenge this decision. The appeal will be heard by a manager who was not involved in the original decision-making process, and you will have the right to be accompanied at the appeal hearing by a colleague or trade union representative.`
      )
    );
  } else if (reason === "Redundancy" || reason === "Restructuring") {
    paragraphs.push(
      bodyText(
        `You have the right to reasonable time off during your notice period to seek alternative employment or to arrange training, in accordance with your statutory entitlements. If you believe that the selection for redundancy was unfair, or that insufficient consultation was carried out, you have the right to raise a formal grievance or appeal. Any appeal should be submitted in writing to ${data.hrContactName} at ${data.hrContactEmail} within five working days of the date of this letter.`
      )
    );
  } else {
    paragraphs.push(
      bodyText(
        `If you have any concerns about the circumstances of your termination, or if you believe the process has not been conducted fairly, you have the right to raise these through the company's grievance procedure. Any such concerns should be submitted in writing to ${data.hrContactName} at ${data.hrContactEmail}.`
      )
    );
  }

  paragraphs.push(
    bodyText(
      `You will receive a written reference upon request, confirming your dates of employment and role held. Any further queries regarding your entitlements, including pension transfers, continuation of benefits, or any other matter arising from the termination of your employment, should be directed to ${data.hrContactName} at ${data.hrContactEmail}.`
    )
  );

  return paragraphs;
}

// ── Closing text by reason ──

function closingText(reason: TerminationReason): string {
  switch (reason) {
    case "Redundancy":
    case "Restructuring":
    case "End of Contract":
      return "With best wishes for the future";
    case "Misconduct":
      return "Yours faithfully";
    case "Performance":
    case "Probation Failure":
      return "Yours sincerely";
    default:
      return "Yours sincerely";
  }
}

// ── Confidentiality reminder (for misconduct/performance) ──

function confidentialityParagraph(reason: TerminationReason): Paragraph[] {
  if (reason !== "Misconduct" && reason !== "Performance") return [];

  return [
    boldBodyText("Confidentiality and Post-Employment Obligations"),
    bodyText(
      `You are reminded that your obligations under the confidentiality, intellectual property, and any restrictive covenant clauses contained in your contract of employment will continue to apply following the termination of your employment. You must not retain, copy, or disclose any confidential information, trade secrets, or proprietary materials belonging to the company.`
    ),
  ];
}

// ── Main generator function ──

export async function generateTerminationLetter(
  data: TerminationLetterData
): Promise<Blob> {
  const reason = normaliseReason(data.reason);
  const today = todayFormatted();

  const paragraphs: Paragraph[] = [];

  // Header
  paragraphs.push(
    ...letterHeader({
      senderName: data.hrContactName,
      senderTitle: "Human Resources Department",
      senderCompany: data.companyName,
      senderEmail: data.hrContactEmail,
      date: today,
      recipientName: data.employeeName,
      recipientTitle: data.employeeTitle,
      recipientCompany: data.companyName,
    })
  );

  // Salutation and subject
  paragraphs.push(salutation(data.employeeName));
  paragraphs.push(subjectLine(subjectText(reason)));

  // Opening paragraphs (reason-aware)
  paragraphs.push(...openingParagraphs(data, reason));

  // Details paragraph
  paragraphs.push(...detailsParagraph(data, reason));

  // Confidentiality (misconduct/performance only)
  paragraphs.push(...confidentialityParagraph(reason));

  // Return of property (conditional)
  paragraphs.push(...returnOfPropertyParagraphs(data));

  // Final pay and benefits
  paragraphs.push(...finalPayParagraphs(data, reason));

  // Severance (conditional)
  paragraphs.push(...severanceParagraphs(data, reason));

  // Legal rights and appeal
  paragraphs.push(...legalRightsParagraphs(data, reason));

  // Footer
  paragraphs.push(
    ...letterFooter({
      closingText: closingText(reason),
      signerName: data.hrContactName,
      signerTitle: "Human Resources Department",
      signerCompany: data.companyName,
    })
  );

  return buildLetterDocument(paragraphs);
}
