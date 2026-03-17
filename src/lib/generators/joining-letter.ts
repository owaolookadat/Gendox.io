import { Paragraph, TextRun } from "docx";
import {
  FONT,
  BODY_SIZE,
  NAME_SIZE,
  SPACING,
  SPACING_TIGHT,
  SPACING_NONE,
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

export interface JoiningLetterData {
  companyName: string;
  companyAddress: string;
  employeeName: string;
  jobTitle: string;
  department: string;
  dateOfJoining: string;
  reportingTo: string;
  salary: string;
  workingHours: string;
  probationPeriod: string;
  documentsRequired: string;
  dressCode: string;
  hrContactName: string;
  hrContactEmail: string;
}

// ── Section heading helper ──

function sectionHeading(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: BODY_SIZE,
        font: FONT,
        color: COLOR_DARK,
        underline: {},
      }),
    ],
  });
}

// ── Detail row: bold label + value ──

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

export async function generateJoiningLetter(
  data: JoiningLetterData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [];
  const today = todayFormatted();

  // ── Company letterhead ──
  paragraphs.push(
    ...letterHeader({
      senderName: data.companyName,
      senderAddress: data.companyAddress,
      date: today,
      recipientName: data.employeeName,
    })
  );

  // ── Subject line ──
  paragraphs.push(subjectLine(`Joining Letter — ${data.jobTitle}, ${data.department}`));
  paragraphs.push(spacer());

  // ── Salutation ──
  paragraphs.push(salutation(data.employeeName));

  // ── Congratulatory opening ──
  paragraphs.push(
    bodyText(
      `We are delighted to welcome you to ${data.companyName}! Following the ` +
      `successful completion of our selection process, we are pleased to confirm ` +
      `your appointment as ${data.jobTitle} in the ${data.department} department. ` +
      `Your skills, experience, and enthusiasm make you an excellent addition to our team, ` +
      `and we are confident that you will make valuable contributions to the organisation.`
    )
  );

  // ── Section: Position Details ──
  paragraphs.push(sectionHeading("Position Details"));
  paragraphs.push(detailRow("Job Title", data.jobTitle));
  paragraphs.push(detailRow("Department", data.department));
  paragraphs.push(detailRow("Date of Joining", formatDate(data.dateOfJoining)));
  paragraphs.push(detailRow("Reporting To", data.reportingTo));
  if (data.dressCode) {
    paragraphs.push(detailRow("Dress Code", data.dressCode));
  }

  // ── Section: Compensation ──
  paragraphs.push(sectionHeading("Compensation"));
  paragraphs.push(
    bodyText(
      `Your compensation package has been set at ${data.salary}. Full details ` +
      `of your remuneration, including any applicable benefits, allowances, and ` +
      `deductions, will be outlined in your employment contract.`
    )
  );

  // ── Section: Working Hours ──
  if (data.workingHours) {
    paragraphs.push(sectionHeading("Working Hours"));
    paragraphs.push(
      bodyText(
        `Your standard working hours will be ${data.workingHours}. Specific ` +
        `arrangements regarding breaks, flexible working, and overtime policies ` +
        `will be communicated by your line manager during your induction.`
      )
    );
  }

  // ── Section: Probation Period ──
  if (data.probationPeriod && data.probationPeriod !== "None") {
    paragraphs.push(sectionHeading("Probation Period"));
    paragraphs.push(
      bodyText(
        `Your appointment is subject to the successful completion of a probationary ` +
        `period of ${data.probationPeriod}. During this time, your performance, ` +
        `conduct, and suitability for the role will be evaluated. A formal review ` +
        `will be conducted at the end of the probation period, following which your ` +
        `appointment will be confirmed subject to satisfactory assessment.`
      )
    );
  }

  // ── Section: Required Documents ──
  if (data.documentsRequired) {
    paragraphs.push(sectionHeading("Required Documents"));
    paragraphs.push(
      bodyText(
        "Please bring the following documents on your first day of joining. " +
        "Original copies will be required for verification, and photocopies will " +
        "be retained for our records:"
      )
    );
    // Split documents by newline or comma and list them
    const docs = data.documentsRequired
      .split(/[,\n]/)
      .map((d) => d.trim())
      .filter(Boolean);
    for (const doc of docs) {
      paragraphs.push(
        new Paragraph({
          spacing: SPACING_TIGHT,
          indent: { left: 360 },
          children: [
            new TextRun({
              text: `\u2022  ${doc}`,
              size: BODY_SIZE,
              font: FONT,
            }),
          ],
        })
      );
    }
  }

  // ── HR Contact ──
  paragraphs.push(spacer());
  paragraphs.push(
    bodyText(
      `Should you have any questions prior to your joining date, or require any ` +
      `assistance with the onboarding process, please do not hesitate to contact ` +
      `${data.hrContactName} at ${data.hrContactEmail}. We are here to ensure ` +
      `your transition is as smooth as possible.`
    )
  );

  // ── Warm closing ──
  paragraphs.push(
    bodyText(
      `We are truly excited to have you join ${data.companyName} and look forward ` +
      `to a productive and rewarding professional relationship. Welcome aboard!`
    )
  );

  // ── Signature block for HR ──
  paragraphs.push(
    ...letterFooter({
      closingText: "Yours sincerely",
      signerName: data.hrContactName,
      signerTitle: "Human Resources",
      signerCompany: data.companyName,
    })
  );

  return buildLetterDocument(paragraphs);
}
