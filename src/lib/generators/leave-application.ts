import { Paragraph, TextRun } from "docx";
import {
  FONT,
  BODY_SIZE,
  NAME_SIZE,
  SPACING,
  SPACING_TIGHT,
  COLOR_DARK,
  COLOR_GRAY,
  formatDate,
  todayFormatted,
  letterHeader,
  letterFooter,
  bodyText,
  boldBodyText,
  spacer,
  subjectLine,
  salutation,
  buildLetterDocument,
  richBodyText,
  contactLine,
} from "./letter-utils";

export interface LeaveApplicationData {
  employeeName: string;
  employeeId: string;
  department: string;
  managerName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  emergencyContact: string;
  handoverTo: string;
  dateOfApplication: string;
}

// ── Leave-type-driven opening paragraph ──

function leaveOpeningParagraph(data: LeaveApplicationData): string {
  const days = data.numberOfDays;
  const dayWord = days === 1 ? "day" : "days";
  const from = formatDate(data.startDate);
  const to = formatDate(data.endDate);

  switch (data.leaveType) {
    case "Sick Leave":
      return (
        `I am writing to request sick leave for a period of ${days} ${dayWord}, ` +
        `from ${from} to ${to}. Due to health-related circumstances, I require ` +
        `time away from work to recover and attend to necessary medical care.`
      );

    case "Personal Leave":
      return (
        `I am writing to request personal leave for a period of ${days} ${dayWord}, ` +
        `from ${from} to ${to}. I need to attend to a private matter that ` +
        `requires my attention during this time.`
      );

    case "Maternity/Paternity":
      return (
        `I am pleased to inform you that I will be welcoming a new addition to my ` +
        `family and would like to formally request maternity/paternity leave for ` +
        `a period of ${days} ${dayWord}, from ${from} to ${to}, in accordance ` +
        `with the company's parental leave policy.`
      );

    case "Emergency":
      return (
        `I am writing to urgently request emergency leave for a period of ` +
        `${days} ${dayWord}, from ${from} to ${to}. I understand that this ` +
        `request comes at short notice and I apologise for any inconvenience caused.`
      );

    case "Annual Leave":
    default:
      return (
        `I am writing to formally request annual leave for a period of ` +
        `${days} ${dayWord}, from ${from} to ${to}. I have ensured that ` +
        `this period does not conflict with any critical project deadlines ` +
        `or team commitments.`
      );
  }
}

// ── Leave-type-driven reason context ──

function leaveReasonParagraph(data: LeaveApplicationData): string {
  if (!data.reason) return "";

  switch (data.leaveType) {
    case "Sick Leave":
      return (
        `For your reference, the nature of my leave relates to the following: ` +
        `${data.reason}. I will provide any required medical documentation upon ` +
        `my return, should it be needed in accordance with company policy.`
      );

    case "Emergency":
      return (
        `The circumstances necessitating this leave are as follows: ` +
        `${data.reason}. I appreciate your understanding given the ` +
        `urgent nature of this situation.`
      );

    case "Personal Leave":
      return `The reason for my leave request is: ${data.reason}.`;

    case "Maternity/Paternity":
      return (
        `Additional details regarding my leave: ${data.reason}. I am happy ` +
        `to discuss any further arrangements or documentation required under ` +
        `the company's parental leave provisions.`
      );

    case "Annual Leave":
    default:
      return `The reason for my leave request is: ${data.reason}.`;
  }
}

// ── Leave-type-driven closing tone ──

function leaveClosingParagraph(data: LeaveApplicationData): string {
  const returnDate = formatDate(data.endDate);

  switch (data.leaveType) {
    case "Sick Leave":
      return (
        `I anticipate returning to work on ${returnDate}, health permitting. ` +
        `I will keep you informed of any changes to my expected return date ` +
        `and will provide updates as appropriate.`
      );

    case "Emergency":
      return (
        `I will make every effort to return to work by ${returnDate} and will ` +
        `keep you updated on my situation. I am grateful for your understanding ` +
        `and flexibility during this time.`
      );

    case "Maternity/Paternity":
      return (
        `My planned return date is ${returnDate}. I will remain in touch ` +
        `during my leave as needed and will coordinate my return to ensure ` +
        `a smooth transition back into my responsibilities.`
      );

    case "Personal Leave":
    case "Annual Leave":
    default:
      return (
        `I confirm that I will be available to resume duties on ${returnDate}. ` +
        `I will ensure all outstanding responsibilities are addressed ` +
        `prior to the commencement of my leave.`
      );
  }
}

export async function generateLeaveApplication(
  data: LeaveApplicationData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [];

  // ── Header ──
  paragraphs.push(
    ...letterHeader({
      senderName: data.employeeName,
      senderTitle: data.department ? `Department: ${data.department}` : undefined,
      senderCompany: data.employeeId ? `Employee ID: ${data.employeeId}` : undefined,
      date: formatDate(data.dateOfApplication || new Date().toISOString()),
      recipientName: data.managerName,
    })
  );

  // ── Subject line ──
  paragraphs.push(
    subjectLine(`${data.leaveType} Application — ${formatDate(data.startDate)} to ${formatDate(data.endDate)}`)
  );
  paragraphs.push(spacer());

  // ── Salutation ──
  paragraphs.push(salutation(data.managerName));

  // ── Opening paragraph (leave-type-driven) ──
  paragraphs.push(bodyText(leaveOpeningParagraph(data)));

  // ── Reason paragraph (leave-type-driven) ──
  const reasonText = leaveReasonParagraph(data);
  if (reasonText) {
    paragraphs.push(bodyText(reasonText));
  }

  // ── Handover arrangements ──
  if (data.handoverTo) {
    paragraphs.push(boldBodyText("Handover Arrangements"));
    paragraphs.push(
      bodyText(
        `I have coordinated with ${data.handoverTo} to manage my responsibilities ` +
        `during my absence. I will prepare a comprehensive handover document outlining ` +
        `all ongoing tasks, deadlines, and key contacts to ensure continuity of work. ` +
        `${data.handoverTo} has agreed to serve as the primary point of contact for ` +
        `any matters that may arise during this period.`
      )
    );
  }

  // ── Emergency contact ──
  if (data.emergencyContact) {
    paragraphs.push(boldBodyText("Emergency Contact"));
    paragraphs.push(
      bodyText(
        `Should any urgent matter require my attention during my leave, ` +
        `I can be reached at: ${data.emergencyContact}. Please do not hesitate ` +
        `to contact me in the event of any critical or time-sensitive issues.`
      )
    );
  }

  // ── Closing paragraph (leave-type-driven) ──
  paragraphs.push(bodyText(leaveClosingParagraph(data)));

  // ── Professional sign-off ──
  paragraphs.push(
    bodyText(
      "I kindly request your approval for this leave application and am happy " +
      "to discuss any concerns or adjustments. Thank you for your consideration."
    )
  );

  // ── Footer ──
  paragraphs.push(
    ...letterFooter({
      closingText: "Yours sincerely",
      signerName: data.employeeName,
      signerTitle: data.department ? data.department : undefined,
    })
  );

  return buildLetterDocument(paragraphs);
}
