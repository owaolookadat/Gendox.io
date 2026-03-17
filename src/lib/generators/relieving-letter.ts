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
  senderName,
  contactLine,
  addressLines,
} from "./letter-utils";

export interface RelievingLetterData {
  companyName: string;
  companyAddress: string;
  employeeName: string;
  employeeDesignation: string;
  employeeId: string;
  department: string;
  dateOfJoining: string;
  dateOfResignation: string;
  lastWorkingDay: string;
  reasonForLeaving: string;
  outstandingDuesCleared: boolean;
  issuerName: string;
  issuerDesignation: string;
  dateOfIssue: string;
}

// ── Detail row helper ──

function detailRow(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: SPACING_TIGHT,
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_DARK,
      }),
      new TextRun({
        text: value,
        size: BODY_SIZE,
        font: FONT,
      }),
    ],
  });
}

// ── Reason-driven opening paragraph ──

function relievingOpeningParagraph(data: RelievingLetterData): string {
  const name = data.employeeName;
  const designation = data.employeeDesignation;
  const dept = data.department;
  const company = data.companyName;
  const lastDay = formatDate(data.lastWorkingDay);

  switch (data.reasonForLeaving.toLowerCase()) {
    case "retirement":
      return (
        `We are writing to formally confirm that ${name} has been relieved from ` +
        `the position of ${designation} in the ${dept} department at ${company}, ` +
        `effective ${lastDay}, upon reaching retirement. We congratulate ` +
        `${name} on a distinguished career and are grateful for the many years ` +
        `of dedicated service and invaluable contributions to the organisation.`
      );

    case "layoff":
    case "redundancy":
      return (
        `This letter serves to formally confirm that ${name} has been relieved ` +
        `from the position of ${designation} in the ${dept} department at ` +
        `${company}, effective ${lastDay}. This separation was the result of ` +
        `organisational restructuring and is in no way a reflection of ` +
        `${name}'s professional capabilities or performance. We sincerely ` +
        `appreciate the contributions made during this period of employment.`
      );

    case "resignation":
    default:
      return (
        `This letter confirms that ${name} has been relieved from the position ` +
        `of ${designation} in the ${dept} department at ${company}, effective ` +
        `${lastDay}, following the acceptance of the resignation submitted on ` +
        `${formatDate(data.dateOfResignation)}. During the notice period, all ` +
        `professional responsibilities and handover activities were completed ` +
        `satisfactorily.`
      );
  }
}

// ── Service tenure description ──

function serviceTenureParagraph(data: RelievingLetterData): string {
  const joinDate = new Date(data.dateOfJoining + (data.dateOfJoining.includes("T") ? "" : "T00:00:00"));
  const endDate = new Date(data.lastWorkingDay + (data.lastWorkingDay.includes("T") ? "" : "T00:00:00"));

  const totalMonths =
    (endDate.getFullYear() - joinDate.getFullYear()) * 12 +
    (endDate.getMonth() - joinDate.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  const tenure = parts.length > 0 ? parts.join(" and ") : "less than one month";

  return (
    `${data.employeeName} served the organisation for a total tenure of ` +
    `${tenure}, from ${formatDate(data.dateOfJoining)} to ` +
    `${formatDate(data.lastWorkingDay)}.`
  );
}

// ── Outstanding dues paragraph ──

function duesParagraph(cleared: boolean): string {
  if (cleared) {
    return (
      "We confirm that all outstanding dues, including final settlement, " +
      "have been cleared in full. There are no pending financial obligations " +
      "on either side, and all company property has been returned in " +
      "satisfactory condition."
    );
  }
  return (
    "Please note that the settlement of certain outstanding dues remains " +
    "pending and will be processed in accordance with the company's standard " +
    "separation procedures. The employee will be notified separately " +
    "regarding the final settlement timeline and details."
  );
}

// ── Reason-driven closing wish ──

function closingWishParagraph(data: RelievingLetterData): string {
  const name = data.employeeName;

  switch (data.reasonForLeaving.toLowerCase()) {
    case "retirement":
      return (
        `On behalf of the entire team at ${data.companyName}, we extend our ` +
        `heartfelt congratulations to ${name} on this well-deserved retirement. ` +
        `The dedication, leadership, and expertise demonstrated over the years ` +
        `have left a lasting impact on the organisation. We wish ${name} a ` +
        `fulfilling and joyful retirement.`
      );

    case "layoff":
    case "redundancy":
      return (
        `We sincerely thank ${name} for the commitment and professionalism ` +
        `shown during the tenure at ${data.companyName}. We understand that ` +
        `this transition may be challenging, and we wish ${name} every success ` +
        `in future professional endeavours. We are happy to provide references ` +
        `upon request.`
      );

    case "resignation":
    default:
      return (
        `We thank ${name} for the valuable contributions made to ` +
        `${data.companyName} and wish every success in future professional ` +
        `endeavours. The skills and dedication demonstrated during the tenure ` +
        `here have been greatly appreciated, and we part on the best of terms.`
      );
  }
}

export async function generateRelievingLetter(
  data: RelievingLetterData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [];

  // ── Company letterhead ──
  paragraphs.push(
    ...letterHeader({
      senderName: data.companyName,
      senderAddress: data.companyAddress,
      date: formatDate(data.dateOfIssue),
      recipientName: data.employeeName,
      recipientTitle: data.employeeDesignation,
    })
  );

  // ── Subject line ──
  paragraphs.push(subjectLine("Relieving Letter"));
  paragraphs.push(spacer());

  // ── Salutation ──
  paragraphs.push(salutation(data.employeeName));

  // ── Opening (reason-driven) ──
  paragraphs.push(bodyText(relievingOpeningParagraph(data)));

  // ── Service details ──
  paragraphs.push(boldBodyText("Service Details"));
  if (data.employeeId) {
    paragraphs.push(detailRow("Employee ID", data.employeeId));
  }
  paragraphs.push(detailRow("Designation", data.employeeDesignation));
  paragraphs.push(detailRow("Department", data.department));
  paragraphs.push(detailRow("Date of Joining", formatDate(data.dateOfJoining)));
  paragraphs.push(detailRow("Date of Resignation", formatDate(data.dateOfResignation)));
  paragraphs.push(detailRow("Last Working Day", formatDate(data.lastWorkingDay)));
  paragraphs.push(detailRow("Reason for Separation", data.reasonForLeaving));

  // ── Service tenure ──
  paragraphs.push(spacer());
  paragraphs.push(bodyText(serviceTenureParagraph(data)));

  // ── Outstanding dues ──
  paragraphs.push(bodyText(duesParagraph(data.outstandingDuesCleared)));

  // ── Closing wish (reason-driven) ──
  paragraphs.push(bodyText(closingWishParagraph(data)));

  // ── Authority footer ──
  paragraphs.push(
    bodyText(
      "This letter is issued upon request and serves as formal confirmation " +
      "of separation from the organisation."
    )
  );

  paragraphs.push(
    ...letterFooter({
      closingText: "Yours sincerely",
      signerName: data.issuerName,
      signerTitle: data.issuerDesignation,
      signerCompany: data.companyName,
    })
  );

  return buildLetterDocument(paragraphs);
}
