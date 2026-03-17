import { TextRun, Paragraph, AlignmentType } from "docx";
import {
  buildLetterDocument,
  bodyText,
  boldBodyText,
  spacer,
  pickVariant,
  formatDate,
  todayFormatted,
  FONT,
  BODY_SIZE,
  SPACING,
  COLOR_DARK,
} from "./letter-utils";

export interface AuthorizationLetterData {
  yourName: string;
  yourId: string;
  authorizedPersonName: string;
  authorizedPersonId: string;
  purpose: string;
  authorizationDetails: string;
  validFrom: string;
  validUntil: string;
  conditions: string;
}

// ── Purpose-driven language helpers ──

type PurposeCategory = "financial" | "medical" | "legal" | "property" | "general";

function detectPurpose(purpose: string): PurposeCategory {
  const lower = purpose.toLowerCase();
  if (/bank|financ|account|withdraw|deposit|transaction|payment|fund|cheque|check/.test(lower)) return "financial";
  if (/medical|health|hospital|doctor|treatment|insurance claim|prescription|patient/.test(lower)) return "medical";
  if (/legal|court|solicitor|attorney|lawsuit|litigation|filing|affidavit|notari/.test(lower)) return "legal";
  if (/property|real estate|land|deed|tenant|lease|rental|mortgage|title/.test(lower)) return "property";
  return "general";
}

function getPurposeOpenings(category: PurposeCategory, yourName: string, authorizedName: string): string[] {
  const base = `I, ${yourName}, being of sound mind and acting of my own free will, do hereby authorise ${authorizedName}`;
  switch (category) {
    case "financial":
      return [
        `${base} to act as my authorised representative in all financial matters described herein.`,
        `${base} to conduct the financial transactions and banking activities specified below on my behalf.`,
        `${base} to exercise the financial powers described in this letter, subject to the scope and limitations set forth herein.`,
      ];
    case "medical":
      return [
        `${base} to act as my authorised representative in all medical and healthcare matters described herein.`,
        `${base} to access my medical records, communicate with healthcare providers, and make decisions as specified below.`,
        `${base} to represent me in the healthcare matters outlined in this letter, including accessing protected health information.`,
      ];
    case "legal":
      return [
        `${base} to act as my authorised representative in the legal matters described herein.`,
        `${base} to represent my interests and act on my behalf in the legal proceedings and matters specified below.`,
        `${base} to execute the legal actions described in this letter, with full authority to sign documents and make representations on my behalf.`,
      ];
    case "property":
      return [
        `${base} to act as my authorised representative in all property-related matters described herein.`,
        `${base} to manage, transact, and oversee the property-related activities specified below on my behalf.`,
        `${base} to exercise the property management and transaction powers described in this letter.`,
      ];
    default:
      return [
        `${base} to act as my authorised representative for the purpose described herein.`,
        `${base} to perform the activities and exercise the authority specified below on my behalf.`,
        `${base} to represent me and act in my name with respect to the matters outlined in this letter.`,
      ];
  }
}

function getLiabilityDisclaimer(category: PurposeCategory): string {
  switch (category) {
    case "financial":
      return "I acknowledge that I shall remain personally liable for any financial obligations, debts, or commitments arising from actions taken by the Authorised Person within the scope of this authorisation. The Authorised Person shall not be held personally liable for outcomes resulting from actions taken in good faith and within the authority granted herein.";
    case "medical":
      return "I acknowledge that the Authorised Person is acting in good faith on my behalf and shall not be held liable for medical outcomes resulting from decisions made within the scope of this authorisation. This authorisation does not create a medical power of attorney unless explicitly stated and executed in accordance with applicable law.";
    case "legal":
      return "I acknowledge that the Authorised Person is acting on my instructions and within the scope defined herein. I accept full responsibility for the legal consequences of actions taken under this authorisation. The Authorised Person shall not be held personally liable for outcomes arising from actions taken in good faith within the granted authority.";
    case "property":
      return "I acknowledge that I remain the legal owner and bear ultimate responsibility for all property-related decisions and obligations arising from actions taken under this authorisation. The Authorised Person shall not be held personally liable for outcomes resulting from actions taken in good faith and within the scope granted herein.";
    default:
      return "I acknowledge full responsibility for the actions taken by the Authorised Person within the scope of this authorisation. The Authorised Person shall not be held personally liable for outcomes resulting from actions taken in good faith and within the authority granted herein.";
  }
}

function getScopeLimitations(category: PurposeCategory): string[] {
  const common = [
    "The Authorised Person shall not delegate the authority granted herein to any third party without prior written consent from the Authorising Party.",
    "Any action taken outside the scope of this authorisation shall be considered unauthorised and not binding upon the Authorising Party.",
  ];

  switch (category) {
    case "financial":
      return [
        ...common,
        "The Authorised Person shall not open new accounts, apply for credit, or create financial obligations not explicitly described in this authorisation.",
        "All financial transactions must be documented and receipts retained for the Authorising Party's records.",
      ];
    case "medical":
      return [
        ...common,
        "The Authorised Person shall act in accordance with any advance directives or known medical preferences of the Authorising Party.",
        "This authorisation does not extend to end-of-life decisions unless explicitly stated herein.",
      ];
    case "legal":
      return [
        ...common,
        "The Authorised Person shall not enter into settlements, plea agreements, or waive legal rights without explicit written consent from the Authorising Party.",
        "All legal documents signed under this authorisation must be retained and copies provided to the Authorising Party.",
      ];
    case "property":
      return [
        ...common,
        "The Authorised Person shall not sell, mortgage, or encumber the property beyond the scope explicitly described in this authorisation.",
        "Any modifications to the property must be documented and the Authorising Party notified promptly.",
      ];
    default:
      return common;
  }
}

// ── Main generator ──

export async function generateAuthorizationLetter(
  data: AuthorizationLetterData
): Promise<Blob> {
  const today = todayFormatted();
  const seed = `${data.yourName}${data.authorizedPersonName}${data.purpose}`;
  const category = detectPurpose(data.purpose);

  const paragraphs: Paragraph[] = [];

  // ── Title ──
  paragraphs.push(
    new Paragraph({
      spacing: SPACING,
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "LETTER OF AUTHORIZATION",
          bold: true,
          size: 32,
          font: FONT,
          color: COLOR_DARK,
        }),
      ],
    })
  );

  paragraphs.push(spacer());

  // ── Date ──
  paragraphs.push(bodyText(`Date: ${today}`));
  paragraphs.push(spacer());

  // ── Salutation ──
  paragraphs.push(bodyText("To Whom It May Concern,"));
  paragraphs.push(spacer());

  // ── Authorization statement with purpose-driven language ──
  const openings = getPurposeOpenings(category, data.yourName, data.authorizedPersonName);
  let authStatement = pickVariant(openings, seed);

  // Append ID references if provided
  const idParts: string[] = [];
  if (data.yourId.trim()) {
    idParts.push(`Authorising Party ID/Reference: ${data.yourId}`);
  }
  if (data.authorizedPersonId.trim()) {
    idParts.push(`Authorised Person ID/Reference: ${data.authorizedPersonId}`);
  }

  paragraphs.push(bodyText(authStatement));

  if (idParts.length > 0) {
    paragraphs.push(spacer());
    paragraphs.push(boldBodyText("Identification"));
    for (const part of idParts) {
      paragraphs.push(bodyText(part));
    }
  }

  paragraphs.push(spacer());

  // ── Purpose ──
  paragraphs.push(boldBodyText("Purpose of Authorisation"));
  paragraphs.push(bodyText(`This authorisation is granted for the specific purpose of: ${data.purpose}.`));

  paragraphs.push(spacer());

  // ── Scope of Authorization ──
  paragraphs.push(boldBodyText("Scope of Authorisation"));
  paragraphs.push(bodyText(data.authorizationDetails.trim()));

  paragraphs.push(spacer());

  // ── Scope Limitations ──
  paragraphs.push(boldBodyText("Scope Limitations"));
  const limitations = getScopeLimitations(category);
  for (let i = 0; i < limitations.length; i++) {
    paragraphs.push(bodyText(`${i + 1}. ${limitations[i]}`));
  }

  paragraphs.push(spacer());

  // ── Validity Period ──
  paragraphs.push(boldBodyText("Validity Period"));
  paragraphs.push(
    bodyText(
      `This authorisation shall take effect on ${formatDate(data.validFrom)} and shall remain in force until ${formatDate(data.validUntil)}, unless revoked earlier in accordance with the revocation provisions below.`
    )
  );

  paragraphs.push(spacer());

  // ── Revocation Clause ──
  paragraphs.push(boldBodyText("Revocation"));
  const revocationVariants = [
    "The Authorising Party reserves the right to revoke this authorisation at any time by providing written notice to the Authorised Person and to any third party relying on this authorisation. Upon receipt of such notice, all authority granted herein shall immediately cease.",
    "This authorisation may be revoked by the Authorising Party at any time without cause. Revocation shall be effective upon delivery of written notice to the Authorised Person. The Authorising Party shall also notify any relevant third parties of the revocation.",
    "The Authorising Party may withdraw this authorisation at their sole discretion by issuing written notice. All actions taken by the Authorised Person prior to receiving notice of revocation shall remain valid, but no further authority shall be exercised after revocation.",
  ];
  paragraphs.push(bodyText(pickVariant(revocationVariants, seed + "revoke")));

  paragraphs.push(spacer());

  // ── Conditions and Limitations ──
  if (data.conditions.trim()) {
    paragraphs.push(boldBodyText("Additional Conditions and Limitations"));
    paragraphs.push(bodyText(data.conditions.trim()));
    paragraphs.push(spacer());
  }

  // ── Liability Disclaimer ──
  paragraphs.push(boldBodyText("Liability and Indemnification"));
  paragraphs.push(bodyText(getLiabilityDisclaimer(category)));

  paragraphs.push(spacer());

  // ── Governing Law ──
  paragraphs.push(boldBodyText("General Provisions"));
  paragraphs.push(
    bodyText(
      "This letter of authorisation shall be governed by and construed in accordance with the laws of the applicable jurisdiction. If any provision of this authorisation is found to be unenforceable, the remaining provisions shall continue in full force and effect."
    )
  );

  paragraphs.push(spacer());

  // ── Closing ──
  const closingVariants = [
    "Please accept this letter as formal authorisation. Should you require any further verification or have any questions regarding the scope of this authorisation, please do not hesitate to contact me directly.",
    "This letter serves as my formal and voluntary grant of authority as described above. I am available to provide additional verification or clarification as needed.",
    "I confirm that this authorisation is given freely and voluntarily. For any queries or verification requirements, I may be contacted directly using the details provided.",
  ];
  paragraphs.push(bodyText(pickVariant(closingVariants, seed + "closing")));

  paragraphs.push(spacer());

  // ── Signature block: Authorising Party ──
  paragraphs.push(boldBodyText("Authorising Party"));
  paragraphs.push(spacer());
  paragraphs.push(bodyText("Signature: ____________________________"));
  paragraphs.push(bodyText(`Name: ${data.yourName}`));
  if (data.yourId.trim()) {
    paragraphs.push(bodyText(`ID/Reference: ${data.yourId}`));
  }
  paragraphs.push(bodyText(`Date: ${today}`));

  paragraphs.push(spacer());

  // ── Witness / Notary block ──
  paragraphs.push(boldBodyText("Witness / Notary Acknowledgement"));
  paragraphs.push(spacer());
  paragraphs.push(bodyText("I hereby confirm that the above-named Authorising Party signed this document in my presence and appeared to act of their own free will."));
  paragraphs.push(spacer());
  paragraphs.push(bodyText("Witness Signature: ____________________________"));
  paragraphs.push(bodyText("Witness Name: ____________________________"));
  paragraphs.push(bodyText("Date: ____________________________"));
  paragraphs.push(spacer());
  paragraphs.push(bodyText("Notary Public (if applicable):"));
  paragraphs.push(bodyText("Signature: ____________________________"));
  paragraphs.push(bodyText("Commission No.: ____________________________"));
  paragraphs.push(bodyText("My commission expires: ____________________________"));

  return buildLetterDocument(paragraphs);
}
