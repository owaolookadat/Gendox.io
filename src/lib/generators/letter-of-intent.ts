import { Paragraph } from "docx";
import {
  letterHeader,
  letterFooter,
  buildLetterDocument,
  bodyText,
  boldBodyText,
  spacer,
  subjectLine,
  salutation,
  pickVariant,
  todayFormatted,
} from "./letter-utils";

export interface LetterOfIntentData {
  yourName: string;
  yourTitle: string;
  yourOrganization: string;
  recipientName: string;
  recipientTitle: string;
  recipientOrganization: string;
  purpose: string;
  subject: string;
  intentStatement: string;
  keyTerms: string;
  timeline: string;
  conditions: string;
}

// ── Purpose category detection ──

type IntentCategory = "purchase" | "partnership" | "employment" | "project" | "investment" | "general";

function detectIntentCategory(purpose: string, subject: string): IntentCategory {
  const lower = `${purpose} ${subject}`.toLowerCase();
  if (/purchas|acqui|buy|sale|asset|property|real estate|merger/.test(lower)) return "purchase";
  if (/partner|joint venture|collaborat|alliance|co-operat|consortium/.test(lower)) return "partnership";
  if (/employ|hire|recruit|position|role|job|appointment|engag/.test(lower)) return "employment";
  if (/project|develop|construct|build|implement|contract|deliver/.test(lower)) return "project";
  if (/invest|fund|capital|equity|financ|venture|stake/.test(lower)) return "investment";
  return "general";
}

// ── Binding status helpers ──

function getBindingClause(category: IntentCategory, seed: string): { isBinding: boolean; text: string } {
  // Most LOIs are non-binding. Only purchase/investment may warrant binding language.
  const bindingCategories: IntentCategory[] = ["purchase", "investment"];
  const couldBind = bindingCategories.includes(category);

  if (couldBind) {
    const variants = [
      {
        isBinding: false,
        text: "This Letter of Intent is not intended to create, and shall not be construed as creating, any legally binding obligation on either party, except for the confidentiality and exclusivity provisions set forth herein, which shall be binding upon execution. The parties intend to negotiate and enter into a definitive agreement incorporating the terms outlined below.",
      },
      {
        isBinding: false,
        text: "Except as specifically noted in the sections titled \"Confidentiality\" and \"Exclusivity\" below, this Letter of Intent represents a non-binding expression of the parties' mutual interest and intentions. A definitive binding agreement shall be executed separately upon completion of due diligence and successful negotiation of final terms.",
      },
    ];
    return pickVariant(variants, seed + "binding");
  }

  const variants = [
    {
      isBinding: false,
      text: "This Letter of Intent is not legally binding and does not create any enforceable obligation on either party. It is intended solely as a good-faith expression of the parties' mutual interest and their intention to negotiate the terms of a formal agreement.",
    },
    {
      isBinding: false,
      text: "This letter constitutes a non-binding statement of intent and does not obligate either party to enter into a definitive agreement. Both parties acknowledge that any binding obligations shall only arise from the execution of a formal agreement.",
    },
    {
      isBinding: false,
      text: "The parties acknowledge that this Letter of Intent is non-binding and serves as a framework for further discussions. Neither party shall be legally bound unless and until a definitive agreement is negotiated, executed, and delivered by both parties.",
    },
  ];
  return pickVariant(variants, seed + "binding");
}

// ── Purpose-driven opening ──

function getOpeningText(category: IntentCategory, data: LetterOfIntentData, seed: string): string {
  const org = data.yourOrganization.trim() || "the undersigned";

  switch (category) {
    case "purchase": {
      const variants = [
        `This letter sets forth the principal terms upon which ${org} intends to acquire or purchase the subject matter described below. We submit this Letter of Intent as an expression of our serious interest and to establish a framework for negotiating a definitive purchase agreement.`,
        `${org} is pleased to submit this Letter of Intent outlining the proposed terms for the acquisition described herein. This letter reflects our genuine interest in proceeding with the transaction and serves as the basis for further negotiations.`,
      ];
      return pickVariant(variants, seed);
    }
    case "partnership": {
      const variants = [
        `This letter expresses the intent of ${org} to enter into a strategic partnership with ${data.recipientOrganization}. We believe that a collaborative relationship between our organisations will create significant mutual value and wish to outline the proposed framework for this partnership.`,
        `${org} is pleased to express its interest in forming a partnership with ${data.recipientOrganization}. This Letter of Intent outlines the key principles and terms we propose as the foundation for a mutually beneficial collaboration.`,
      ];
      return pickVariant(variants, seed);
    }
    case "employment": {
      const variants = [
        `This letter serves as a formal expression of intent regarding the proposed employment or engagement described below. ${org} is pleased to outline the key terms and conditions being contemplated, subject to the execution of a formal employment agreement.`,
        `${org} is delighted to extend this Letter of Intent regarding the proposed position outlined herein. This letter summarises the principal terms of the anticipated engagement, which will be formalised in a definitive employment agreement.`,
      ];
      return pickVariant(variants, seed);
    }
    case "project": {
      const variants = [
        `This letter outlines the intent of ${org} to engage in the project described below. We are confident in the viability and value of this initiative and wish to establish the key parameters for moving forward toward a formal project agreement.`,
        `${org} is writing to express its intent to undertake the project described herein. This Letter of Intent establishes the proposed scope, timeline, and terms as a basis for developing a comprehensive project agreement.`,
      ];
      return pickVariant(variants, seed);
    }
    case "investment": {
      const variants = [
        `This letter sets forth the terms upon which ${org} proposes to make an investment in ${data.recipientOrganization} as described below. This Letter of Intent reflects our serious interest in this opportunity and our desire to proceed toward a definitive investment agreement.`,
        `${org} is pleased to express its intent to invest in ${data.recipientOrganization} on the terms outlined below. This letter serves as a framework for negotiation and due diligence leading to a formal investment agreement.`,
      ];
      return pickVariant(variants, seed);
    }
    default: {
      const variants = [
        `This letter serves as a formal expression of intent regarding ${data.purpose.toLowerCase()}. ${org} wishes to outline the key terms and intentions set forth below as a basis for further discussion and the negotiation of a definitive agreement.`,
        `${org} is writing to express its intent regarding the matter described below. This Letter of Intent summarises our proposed terms and demonstrates our commitment to pursuing a formal arrangement with ${data.recipientOrganization}.`,
      ];
      return pickVariant(variants, seed);
    }
  }
}

// ── Exclusivity clause ──

function getExclusivityClause(category: IntentCategory, seed: string): string | null {
  const exclusivityCategories: IntentCategory[] = ["purchase", "investment", "partnership"];
  if (!exclusivityCategories.includes(category)) return null;

  const variants = [
    "During the period commencing on the date of this letter and continuing for a period of sixty (60) days thereafter (the \"Exclusivity Period\"), neither party shall solicit, initiate, or engage in discussions or negotiations with any third party regarding a transaction substantially similar to that contemplated herein. This exclusivity provision shall be binding upon execution of this Letter of Intent.",
    "For a period of ninety (90) days from the date hereof, both parties agree to negotiate exclusively with each other regarding the transaction described in this letter. Neither party shall, directly or indirectly, solicit or entertain proposals from third parties for a similar arrangement during this period. This provision is intended to be legally binding.",
    "The parties agree to an exclusivity period of forty-five (45) days from the date of this letter, during which time both parties shall negotiate in good faith exclusively with each other. This exclusivity obligation shall survive regardless of whether a definitive agreement is ultimately executed.",
  ];
  return pickVariant(variants, seed + "exclusive");
}

// ── Confidentiality clause ──

function getConfidentialityClause(category: IntentCategory, seed: string): string {
  const variants = [
    "Each party agrees to treat as confidential all non-public information received from the other party in connection with the transactions contemplated by this letter. Neither party shall disclose such information to any third party without the prior written consent of the disclosing party, except as required by law or regulation. This confidentiality obligation shall survive the termination or expiration of this Letter of Intent for a period of two (2) years.",
    "All information exchanged between the parties in connection with this Letter of Intent and the proposed transaction shall be treated as confidential and proprietary. The receiving party shall protect such information with the same degree of care it uses to protect its own confidential information, but in no event less than reasonable care. This obligation shall remain in effect regardless of whether a definitive agreement is executed.",
    "The parties acknowledge that during the course of discussions, they may share sensitive business, financial, and operational information. Each party agrees to maintain strict confidentiality regarding all such information and to use it solely for the purpose of evaluating and negotiating the proposed arrangement. This provision shall be binding and enforceable.",
  ];
  return pickVariant(variants, seed + "confid");
}

// ── Timeline milestones ──

function getTimelineMilestones(category: IntentCategory, timeline: string, seed: string): string[] {
  if (!timeline.trim()) return [];

  const milestones: string[] = [timeline.trim()];

  // Add category-specific milestone suggestions
  switch (category) {
    case "purchase":
      milestones.push(
        "The parties anticipate the following key milestones: completion of due diligence, negotiation and execution of a definitive purchase agreement, satisfaction of any conditions precedent, and closing of the transaction."
      );
      break;
    case "partnership":
      milestones.push(
        "The anticipated milestones include: finalisation of partnership terms, execution of a formal partnership agreement, operational integration planning, and commencement of joint activities."
      );
      break;
    case "employment":
      milestones.push(
        "The anticipated milestones include: completion of background checks and references, negotiation of a formal employment contract, and commencement of duties on the agreed start date."
      );
      break;
    case "project":
      milestones.push(
        "Key project milestones are expected to include: execution of a project agreement, mobilisation and resource allocation, commencement of works, interim deliverable reviews, and final completion and handover."
      );
      break;
    case "investment":
      milestones.push(
        "Key milestones include: completion of financial and legal due diligence, negotiation and execution of definitive investment documents, satisfaction of conditions precedent, and disbursement of funds."
      );
      break;
  }

  return milestones;
}

// ── Termination / withdrawal ──

function getTerminationProvision(category: IntentCategory, seed: string): string {
  const variants = [
    "Either party may withdraw from this Letter of Intent at any time by providing written notice to the other party. Upon withdrawal, all obligations under this letter shall cease, except for those provisions expressly stated to survive termination (including confidentiality and, if applicable, exclusivity provisions). Neither party shall be liable for any costs, damages, or losses arising from such withdrawal, except as otherwise agreed in writing.",
    "This Letter of Intent may be terminated by either party at any time prior to the execution of a definitive agreement, by delivering written notice of termination to the other party. Upon termination, each party shall return or destroy all confidential information received from the other party. Termination shall not affect any obligations that are expressly stated to survive.",
    "Either party reserves the right to discontinue negotiations and withdraw from this Letter of Intent at any time and for any reason. Such withdrawal shall be communicated in writing and shall not give rise to any liability on the part of the withdrawing party, except in respect of obligations that are expressly stated to be binding (such as confidentiality).",
  ];
  return pickVariant(variants, seed + "term");
}

// ── Governing law ──

function getGoverningLaw(seed: string): string {
  const variants = [
    "This Letter of Intent shall be governed by and construed in accordance with the laws of the applicable jurisdiction. Any disputes arising out of or in connection with this letter shall be resolved through good-faith negotiation in the first instance, and if unresolved, through the courts of competent jurisdiction.",
    "The construction, validity, and performance of this Letter of Intent shall be governed by the laws of the relevant jurisdiction. The parties agree to submit to the jurisdiction of the appropriate courts for the resolution of any disputes, having first attempted to resolve the matter through negotiation.",
  ];
  return pickVariant(variants, seed + "law");
}

// ── Main generator ──

export async function generateLetterOfIntent(
  data: LetterOfIntentData
): Promise<Blob> {
  const today = todayFormatted();
  const seed = `${data.yourName}${data.recipientName}${data.purpose}${data.subject}`;
  const category = detectIntentCategory(data.purpose, data.subject);
  const bindingInfo = getBindingClause(category, seed);

  const paragraphs: Paragraph[] = [];

  // ── Header ──
  paragraphs.push(
    ...letterHeader({
      senderName: data.yourName,
      senderTitle: data.yourTitle || undefined,
      senderCompany: data.yourOrganization || undefined,
      date: today,
      recipientName: data.recipientName,
      recipientTitle: data.recipientTitle || undefined,
      recipientCompany: data.recipientOrganization || undefined,
    })
  );

  // ── Subject ──
  paragraphs.push(subjectLine(`Letter of Intent \u2014 ${data.subject}`));

  // ── Salutation ──
  paragraphs.push(salutation(data.recipientName));
  paragraphs.push(spacer());

  // ── Opening with purpose-driven language ──
  paragraphs.push(bodyText(getOpeningText(category, data, seed)));

  paragraphs.push(spacer());

  // ── Binding Status ──
  paragraphs.push(boldBodyText("Nature of This Letter"));
  paragraphs.push(bodyText(bindingInfo.text));

  paragraphs.push(spacer());

  // ── Statement of Intent ──
  paragraphs.push(boldBodyText("Statement of Intent"));
  paragraphs.push(bodyText(data.intentStatement.trim()));

  paragraphs.push(spacer());

  // ── Key Terms and Details ──
  paragraphs.push(boldBodyText("Key Terms and Details"));
  paragraphs.push(bodyText(data.keyTerms.trim()));

  paragraphs.push(spacer());

  // ── Timeline Milestones ──
  const milestones = getTimelineMilestones(category, data.timeline, seed);
  if (milestones.length > 0) {
    paragraphs.push(boldBodyText("Timeline and Milestones"));
    for (const milestone of milestones) {
      paragraphs.push(bodyText(milestone));
    }
    paragraphs.push(spacer());
  }

  // ── Conditions ──
  if (data.conditions.trim()) {
    paragraphs.push(boldBodyText("Conditions Precedent"));
    paragraphs.push(bodyText(data.conditions.trim()));
    paragraphs.push(spacer());
  }

  // ── Exclusivity ──
  const exclusivity = getExclusivityClause(category, seed);
  if (exclusivity) {
    paragraphs.push(boldBodyText("Exclusivity"));
    paragraphs.push(bodyText(exclusivity));
    paragraphs.push(spacer());
  }

  // ── Confidentiality ──
  paragraphs.push(boldBodyText("Confidentiality"));
  paragraphs.push(bodyText(getConfidentialityClause(category, seed)));

  paragraphs.push(spacer());

  // ── Termination / Withdrawal ──
  paragraphs.push(boldBodyText("Termination and Withdrawal"));
  paragraphs.push(bodyText(getTerminationProvision(category, seed)));

  paragraphs.push(spacer());

  // ── Governing Law ──
  paragraphs.push(boldBodyText("Governing Law"));
  paragraphs.push(bodyText(getGoverningLaw(seed)));

  paragraphs.push(spacer());

  // ── Closing ──
  const closingVariants = [
    `We look forward to progressing discussions and working toward a mutually satisfactory definitive agreement. Please do not hesitate to contact us should you have any questions or wish to discuss any aspect of this letter.`,
    `We are confident that the proposed arrangement will be beneficial to both parties and look forward to finalising the terms in a definitive agreement. We welcome the opportunity to discuss this letter at your earliest convenience.`,
    `We are enthusiastic about the prospect of formalising this arrangement and believe it will deliver significant value for all parties involved. We are available to meet at your convenience to advance discussions.`,
  ];
  paragraphs.push(bodyText(pickVariant(closingVariants, seed + "close")));

  paragraphs.push(spacer());

  // ── Footer ──
  paragraphs.push(
    ...letterFooter({
      closingText: "Yours sincerely",
      signerName: data.yourName,
      signerTitle: data.yourTitle || undefined,
      signerCompany: data.yourOrganization || undefined,
    })
  );

  // ── Acknowledgement block for counter-signature ──
  paragraphs.push(spacer());
  paragraphs.push(spacer());

  paragraphs.push(boldBodyText("Acknowledgement and Acceptance"));
  paragraphs.push(bodyText("By signing below, the recipient acknowledges receipt of this Letter of Intent and confirms their interest in proceeding with discussions on the terms outlined herein."));
  paragraphs.push(spacer());
  paragraphs.push(bodyText("Signature: ____________________________"));
  paragraphs.push(bodyText(`Name: ${data.recipientName}`));
  if (data.recipientTitle.trim()) {
    paragraphs.push(bodyText(`Title: ${data.recipientTitle}`));
  }
  paragraphs.push(bodyText(`Organisation: ${data.recipientOrganization}`));
  paragraphs.push(bodyText("Date: ____________________________"));

  return buildLetterDocument(paragraphs);
}
