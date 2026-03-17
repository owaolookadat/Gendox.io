import {
  letterHeader,
  letterFooter,
  buildLetterDocument,
  bodyText,
  spacer,
  subjectLine,
  FONT,
  BODY_SIZE,
} from "./letter-utils";
import { Paragraph, TextRun } from "docx";

export interface BusinessLetterData {
  yourName: string;
  yourTitle: string;
  yourCompany: string;
  yourAddress: string;
  recipientName: string;
  recipientTitle: string;
  recipientCompany: string;
  recipientAddress: string;
  date: string;
  subject: string;
  salutation: string;
  body: string;
  closing: string;
}

export async function generateBusinessLetter(
  data: BusinessLetterData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [];

  // ── Letterhead-style header ──
  paragraphs.push(
    ...letterHeader({
      senderName: data.yourName,
      senderTitle: data.yourTitle || undefined,
      senderCompany: data.yourCompany || undefined,
      senderAddress: data.yourAddress || undefined,
      date: data.date,
      recipientName: data.recipientName,
      recipientTitle: data.recipientTitle || undefined,
      recipientCompany: data.recipientCompany || undefined,
      recipientAddress: data.recipientAddress || undefined,
    })
  );

  // ── Salutation ──
  const salutationText =
    data.salutation === "To Whom It May Concern"
      ? "To Whom It May Concern,"
      : `${data.salutation} ${data.recipientName},`;

  paragraphs.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: salutationText,
          size: BODY_SIZE,
          font: FONT,
        }),
      ],
    })
  );

  // ── Subject line ──
  if (data.subject) {
    paragraphs.push(subjectLine(data.subject));
  }

  // ── Body paragraphs ──
  const bodyParagraphs = data.body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (const para of bodyParagraphs) {
    paragraphs.push(bodyText(para));
  }

  // ── Spacer before closing ──
  paragraphs.push(spacer());

  // ── Professional signature block ──
  paragraphs.push(
    ...letterFooter({
      closingText: data.closing,
      signerName: data.yourName,
      signerTitle: data.yourTitle || undefined,
      signerCompany: data.yourCompany || undefined,
    })
  );

  return await buildLetterDocument(paragraphs);
}
