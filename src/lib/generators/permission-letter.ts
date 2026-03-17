import { TextRun, Paragraph } from "docx";
import {
  letterHeader,
  letterFooter,
  buildLetterDocument,
  bodyText,
  boldBodyText,
  richBodyText,
  spacer,
  subjectLine,
  salutation,
  pickVariant,
  todayFormatted,
  FONT,
  BODY_SIZE,
} from "./letter-utils";

export interface PermissionLetterData {
  yourName: string;
  yourTitle: string;
  organization: string;
  recipientName: string;
  recipientTitle: string;
  permissionType: string;
  details: string;
  dates: string;
  justification: string;
  conditions: string;
}

// ── Permission type detection ──

type PermissionCategory = "leave" | "event" | "resource" | "travel" | "facility" | "general";

function detectPermissionType(permissionType: string): PermissionCategory {
  const lower = permissionType.toLowerCase();
  if (/leave|absence|holiday|vacation|time off|sick|personal day|maternity|paternity|bereavement/.test(lower)) return "leave";
  if (/event|conference|seminar|workshop|meeting|ceremony|function|gathering|celebration/.test(lower)) return "event";
  if (/resource|equipment|software|tool|material|access|system|database|server|lab/.test(lower)) return "resource";
  if (/travel|trip|visit|tour|field|offsite|business travel|overseas/.test(lower)) return "travel";
  if (/facility|room|space|venue|building|office|premises|parking|storage/.test(lower)) return "facility";
  return "general";
}

// ── Tone-driven openings ──

function getOpeningParagraphs(category: PermissionCategory, data: PermissionLetterData, seed: string): string[] {
  const type = data.permissionType.toLowerCase();

  switch (category) {
    case "leave": {
      const variants = [
        `I am writing to formally request permission for ${type}. I have carefully considered the timing of this request to minimise any disruption to ongoing work and team commitments.`,
        `I respectfully submit this request for ${type}. I have ensured that my current responsibilities are accounted for and wish to outline the details for your consideration.`,
        `Please accept this letter as my formal application for ${type}. I have given careful thought to the operational requirements of my role and wish to propose the following arrangement.`,
      ];
      return [pickVariant(variants, seed)];
    }
    case "event": {
      const variants = [
        `I am writing to request permission to participate in ${type}. I believe this opportunity will contribute positively to my professional development and to our team's objectives.`,
        `I would like to formally request approval to attend ${type}. I have identified significant value in this opportunity and wish to present the details for your consideration.`,
        `Please consider this letter as my formal request for authorisation to take part in ${type}. I am confident this will be a worthwhile investment of time and resources.`,
      ];
      return [pickVariant(variants, seed)];
    }
    case "resource": {
      const variants = [
        `I am writing to request access to ${type}. This resource is essential for the effective completion of my current responsibilities, and I wish to outline the specifics of my request.`,
        `I respectfully request permission to utilise ${type}. I have identified a clear operational need and wish to present my case for your approval.`,
        `Please accept this letter as a formal request for authorisation to access ${type}. I have assessed the requirements of my current workload and determined that this access would significantly enhance productivity.`,
      ];
      return [pickVariant(variants, seed)];
    }
    case "travel": {
      const variants = [
        `I am writing to request authorisation for ${type}. I have thoroughly evaluated the purpose and expected outcomes of this travel and wish to present the details for your approval.`,
        `I would like to formally request permission for ${type}. I have prepared a comprehensive overview of the trip's objectives and anticipated benefits.`,
        `Please consider this letter as my formal request for travel authorisation regarding ${type}. I am confident the outcomes will justify the time and expenditure involved.`,
      ];
      return [pickVariant(variants, seed)];
    }
    case "facility": {
      const variants = [
        `I am writing to request permission to use ${type}. I have reviewed the availability and wish to outline the purpose and scope of my request.`,
        `I respectfully submit this request for access to ${type}. I have ensured the proposed usage aligns with organisational policies and have included the relevant details below.`,
        `Please accept this formal request for use of ${type}. I have confirmed that the proposed dates and usage requirements are compatible with existing bookings and regulations.`,
      ];
      return [pickVariant(variants, seed)];
    }
    default: {
      const variants = [
        `I am writing to formally request permission for ${type}. I would like to provide the following details for your consideration and approval.`,
        `I respectfully submit this request regarding ${type}. I have outlined the relevant details below and look forward to your response.`,
        `Please accept this letter as my formal request for ${type}. I have included all pertinent information to support your decision-making process.`,
      ];
      return [pickVariant(variants, seed)];
    }
  }
}

// ── Justification section headers by category ──

function getJustificationHeader(category: PermissionCategory): string {
  switch (category) {
    case "leave": return "Justification and Coverage Plan";
    case "event": return "Justification and Expected Outcomes";
    case "resource": return "Business Justification";
    case "travel": return "Purpose and Justification";
    case "facility": return "Purpose and Justification";
    default: return "Justification";
  }
}

// ── Risk / liability acknowledgement ──

function getRiskAcknowledgement(category: PermissionCategory, seed: string): string | null {
  switch (category) {
    case "travel": {
      const variants = [
        "I acknowledge that travel involves inherent risks and confirm that I will comply with all organisational travel policies, including health and safety protocols, and will maintain appropriate travel insurance coverage throughout the duration of the trip.",
        "I understand the responsibilities associated with business travel and confirm my adherence to all applicable organisational policies, including risk assessment requirements, travel insurance provisions, and duty of care obligations.",
      ];
      return pickVariant(variants, seed + "risk");
    }
    case "event": {
      const variants = [
        "I acknowledge that attendance at external events is subject to organisational guidelines and confirm that I will represent the organisation professionally. I accept responsibility for adhering to all event-related policies and will provide a summary of key takeaways upon return.",
        "I understand my obligations as a representative of the organisation at external events and will conduct myself in accordance with our code of conduct. I will ensure relevant learnings are shared with the team following the event.",
      ];
      return pickVariant(variants, seed + "risk");
    }
    case "resource": {
      const variants = [
        "I acknowledge responsibility for the proper use and care of the requested resource and agree to adhere to all usage policies and guidelines. I will promptly report any issues, damage, or security concerns to the appropriate parties.",
        "I accept full responsibility for the resource during the period of access and will comply with all organisational policies governing its use. I will return or relinquish access promptly upon completion of the stated purpose.",
      ];
      return pickVariant(variants, seed + "risk");
    }
    default:
      return null;
  }
}

// ── Approval chain reference ──

function getApprovalChainNote(category: PermissionCategory): string {
  switch (category) {
    case "leave":
      return "I understand this request requires your direct approval and, if applicable, endorsement from the HR department. I am happy to follow any additional approval steps required by organisational policy.";
    case "travel":
      return "I understand this request may require approval from multiple levels of management and the finance department. I am prepared to provide any additional documentation or cost estimates as required.";
    case "resource":
      return "I understand that access to this resource may require authorisation from the relevant department head or IT administrator in addition to your approval. I am happy to liaise with the appropriate parties.";
    default:
      return "I understand this request follows our standard approval process and I am happy to provide any additional information required by the relevant approving authorities.";
  }
}

// ── Closing variants ──

function getClosingText(category: PermissionCategory, seed: string): string {
  const variants: Record<PermissionCategory, string[]> = {
    leave: [
      "I have made arrangements to ensure continuity of my responsibilities during the requested period. I am happy to discuss handover plans or any alternative arrangements you may prefer.",
      "I am committed to ensuring that my absence causes minimal disruption and have prepared a coverage plan. I welcome any suggestions or modifications you may wish to propose.",
    ],
    event: [
      "I am confident that this event will provide valuable insights and development opportunities. I will prepare a summary report and share key learnings with the team upon my return.",
      "I believe this opportunity aligns well with our team's objectives and my professional development plan. I am happy to discuss the expected benefits in further detail.",
    ],
    resource: [
      "I am committed to using the requested resource responsibly and in accordance with all applicable policies. I will ensure timely return or relinquishment of access upon completion.",
      "Thank you for considering this request. I am available to discuss any aspects of the proposed usage and am happy to accommodate any conditions you may wish to impose.",
    ],
    travel: [
      "I believe this trip will deliver meaningful value to our team and organisation. I will provide a detailed report of outcomes and action items upon my return.",
      "I am confident the objectives of this travel align with our organisational priorities. I am happy to provide a detailed cost-benefit analysis if required.",
    ],
    facility: [
      "I will ensure the facility is used in accordance with all policies and returned in the condition in which it was found. I am happy to coordinate with facilities management as needed.",
      "Thank you for considering this request. I will adhere to all facility usage guidelines and coordinate with the relevant teams to ensure smooth logistics.",
    ],
    general: [
      "I would be grateful for your consideration and look forward to your response. Please do not hesitate to contact me should you require any further information or clarification.",
      "Thank you for taking the time to review this request. I am available to discuss any aspects in further detail and am happy to provide additional supporting information as needed.",
    ],
  };

  return pickVariant(variants[category], seed + "close");
}

// ── Main generator ──

export async function generatePermissionLetter(
  data: PermissionLetterData
): Promise<Blob> {
  const today = todayFormatted();
  const seed = `${data.yourName}${data.recipientName}${data.permissionType}`;
  const category = detectPermissionType(data.permissionType);

  const paragraphs: Paragraph[] = [];

  // ── Header ──
  paragraphs.push(
    ...letterHeader({
      senderName: data.yourName,
      senderTitle: data.yourTitle || undefined,
      senderCompany: data.organization || undefined,
      date: today,
      recipientName: data.recipientName,
      recipientTitle: data.recipientTitle || undefined,
      recipientCompany: data.organization || undefined,
    })
  );

  // ── Subject ──
  paragraphs.push(subjectLine(`Request for Permission \u2014 ${data.permissionType}`));

  // ── Salutation ──
  paragraphs.push(salutation(data.recipientName));
  paragraphs.push(spacer());

  // ── Opening with permission-type tone ──
  const openings = getOpeningParagraphs(category, data, seed);
  for (const text of openings) {
    paragraphs.push(bodyText(text));
  }

  paragraphs.push(spacer());

  // ── Details of Request ──
  paragraphs.push(boldBodyText("Details of Request"));
  paragraphs.push(bodyText(data.details.trim()));

  paragraphs.push(spacer());

  // ── Dates ──
  paragraphs.push(
    richBodyText([
      new TextRun({ text: "Dates/Duration: ", bold: true, size: BODY_SIZE, font: FONT }),
      new TextRun({ text: data.dates.trim(), size: BODY_SIZE, font: FONT }),
    ])
  );

  paragraphs.push(spacer());

  // ── Justification ──
  if (data.justification.trim()) {
    paragraphs.push(boldBodyText(getJustificationHeader(category)));
    paragraphs.push(bodyText(data.justification.trim()));
    paragraphs.push(spacer());
  }

  // ── Risk / Liability Acknowledgement ──
  const riskText = getRiskAcknowledgement(category, seed);
  if (riskText) {
    paragraphs.push(boldBodyText("Risk and Liability Acknowledgement"));
    paragraphs.push(bodyText(riskText));
    paragraphs.push(spacer());
  }

  // ── Conditions ──
  if (data.conditions.trim()) {
    paragraphs.push(boldBodyText("Proposed Conditions and Commitments"));
    paragraphs.push(bodyText(data.conditions.trim()));
    paragraphs.push(spacer());
  }

  // ── Approval chain reference ──
  paragraphs.push(boldBodyText("Approval Process"));
  paragraphs.push(bodyText(getApprovalChainNote(category)));

  paragraphs.push(spacer());

  // ── Closing ──
  paragraphs.push(bodyText(getClosingText(category, seed)));

  paragraphs.push(spacer());

  // ── Footer ──
  paragraphs.push(
    ...letterFooter({
      closingText: "Yours sincerely",
      signerName: data.yourName,
      signerTitle: data.yourTitle || undefined,
      signerCompany: data.organization || undefined,
    })
  );

  return buildLetterDocument(paragraphs);
}
