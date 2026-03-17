import { TextRun } from "docx";
import {
  letterHeader,
  letterFooter,
  buildLetterDocument,
  bodyText,
  boldBodyText,
  richBodyText,
  salutation,
  spacer,
  pickVariant,
  simpleHash,
  todayFormatted,
  formatDate,
  BODY_SIZE,
  FONT,
} from "./letter-utils";

export interface ApologyLetterData {
  yourName: string;
  recipientName: string;
  context: string;
  dateOfIncident: string;
  whatHappened: string;
  acknowledgement: string;
  stepsToPrevent: string;
  closingMessage: string;
}

// ── Context-aware opening variants ──

const PROFESSIONAL_OPENINGS = [
  (name: string, incidentRef: string) =>
    `I am writing to formally address and sincerely apologise for the matter that arose${incidentRef}. I recognise the seriousness of this situation and wish to address it directly.`,
  (name: string, incidentRef: string) =>
    `Please accept my sincere apologies regarding the incident${incidentRef}. I take full responsibility for what occurred and believe it is important to address this matter formally.`,
  (name: string, incidentRef: string) =>
    `I wish to formally acknowledge and apologise for the situation${incidentRef}. I understand the gravity of this matter and want to assure you it is being treated with the utmost seriousness.`,
];

const PERSONAL_OPENINGS = [
  (name: string, incidentRef: string) =>
    `I have been thinking a great deal about what happened${incidentRef}, and I want you to know how truly sorry I am. You deserve a heartfelt apology, and I hope this letter conveys the depth of my regret.`,
  (name: string, incidentRef: string) =>
    `I owe you a sincere apology for what happened${incidentRef}. I care deeply about our relationship, and I am sorry for the hurt I have caused.`,
  (name: string, incidentRef: string) =>
    `There is no easy way to say this, but I need you to know how sorry I am about what occurred${incidentRef}. You mean a great deal to me, and I deeply regret my actions.`,
];

const CUSTOMER_SERVICE_OPENINGS = [
  (name: string, incidentRef: string) =>
    `Thank you for bringing this matter to our attention. I am writing to sincerely apologise for the experience you had${incidentRef}. Your satisfaction is our highest priority, and we fell short of the standard you rightly expect.`,
  (name: string, incidentRef: string) =>
    `I want to personally apologise for the issue you experienced${incidentRef}. We pride ourselves on delivering excellent service, and I am sorry that we did not meet that standard in your case.`,
  (name: string, incidentRef: string) =>
    `Please accept our sincere apologies for the difficulties you encountered${incidentRef}. We take all customer concerns seriously, and I want to assure you that your experience does not reflect our values.`,
];

const WORKPLACE_OPENINGS = [
  (name: string, incidentRef: string) =>
    `I am writing to acknowledge and apologise for my conduct${incidentRef}. I understand that my actions had an impact on the team and the wider project, and I want to address this directly.`,
  (name: string, incidentRef: string) =>
    `I owe you and the team a sincere apology for what happened${incidentRef}. I recognise that my behaviour affected the working environment, and I take full responsibility.`,
  (name: string, incidentRef: string) =>
    `I want to formally apologise for the situation${incidentRef}. I understand the effect this had on team morale and project progress, and I am committed to making it right.`,
];

// ── Context-aware impact acknowledgement wrappers ──

function buildImpactSection(context: string, acknowledgement: string): string {
  const ack = acknowledgement.trim();
  switch (context) {
    case "Professional":
      return `I fully appreciate the professional implications of this matter. ${ack} I understand that trust is fundamental to our working relationship, and I recognise that my actions may have undermined that trust.`;
    case "Personal":
      return `I have reflected deeply on how this affected you. ${ack} I understand that words alone cannot undo the hurt, but I want you to know that I truly see the impact of my actions.`;
    case "Customer Service":
      return `We understand the frustration and inconvenience this has caused you. ${ack} Your time and trust are valuable to us, and we recognise that this experience may have affected your confidence in our service.`;
    case "Workplace":
      return `I recognise the impact this had on the team's workflow and morale. ${ack} I understand that my actions created additional pressure on colleagues and may have affected project timelines.`;
    default:
      return `I acknowledge the impact of what happened. ${ack}`;
  }
}

// ── Context-aware preventive steps wrappers ──

function buildPreventionSection(context: string, steps: string): string {
  const s = steps.trim();
  switch (context) {
    case "Professional":
      return `To ensure this does not happen again, I have put the following measures in place: ${s} I am also open to any additional recommendations you may have to strengthen our processes.`;
    case "Personal":
      return `I am committed to making real changes going forward. ${s} I understand that rebuilding trust takes time, and I am prepared to put in the effort.`;
    case "Customer Service":
      return `We have taken immediate steps to prevent a recurrence: ${s} We have also reviewed our internal procedures to ensure that no other customer is affected in the same way.`;
    case "Workplace":
      return `I have taken concrete steps to address this and prevent it from happening again: ${s} I am also committed to seeking feedback from colleagues to ensure my conduct meets the standards expected of our team.`;
    default:
      return `To prevent recurrence, I will take the following steps: ${s}`;
  }
}

// ── Context-aware closings ──

function buildClosingParagraphs(
  context: string,
  closingMessage: string,
  recipientName: string
): string[] {
  const paras: string[] = [];

  if (closingMessage.trim()) {
    paras.push(closingMessage.trim());
  }

  switch (context) {
    case "Professional":
      paras.push(
        `I would welcome the opportunity to discuss this matter further at your convenience. Please do not hesitate to contact me if you would like to arrange a meeting to discuss how we can move forward constructively.`
      );
      break;
    case "Personal":
      paras.push(
        `I understand if you need time and space, and I respect whatever you decide. I genuinely hope we can work through this together, and I am here whenever you are ready to talk.`
      );
      break;
    case "Customer Service":
      paras.push(
        `As a gesture of goodwill, we would like to discuss how we can make this right for you. Please do not hesitate to contact us directly so we can ensure your experience going forward meets the high standards you deserve.`
      );
      break;
    case "Workplace":
      paras.push(
        `I am fully committed to contributing positively to the team going forward. I would appreciate the opportunity to discuss this with you and to agree on any further steps that would help restore confidence in my commitment to our shared goals.`
      );
      break;
    default:
      paras.push(
        `I hope we can move forward from this, and I am committed to making things right.`
      );
      break;
  }

  return paras;
}

// ── Closing salutation by context ──

function closingText(context: string): string {
  switch (context) {
    case "Professional":
      return "Yours sincerely";
    case "Personal":
      return "With heartfelt apologies";
    case "Customer Service":
      return "With sincere apologies";
    case "Workplace":
      return "With sincere regards";
    default:
      return "Yours sincerely";
  }
}

// ── Section heading label by context ──

function whatHappenedHeading(context: string): string {
  switch (context) {
    case "Customer Service":
      return "Details of the Issue";
    case "Professional":
      return "Summary of the Matter";
    case "Workplace":
      return "What Occurred";
    default:
      return "What Happened";
  }
}

function impactHeading(context: string): string {
  switch (context) {
    case "Customer Service":
      return "Understanding the Impact on You";
    case "Professional":
      return "Acknowledgement of Impact";
    case "Workplace":
      return "Impact on the Team";
    default:
      return "My Acknowledgement";
  }
}

function preventionHeading(context: string): string {
  switch (context) {
    case "Customer Service":
      return "Steps We Are Taking";
    case "Professional":
      return "Remediation Measures";
    case "Workplace":
      return "Commitment to Change";
    default:
      return "Steps to Prevent Recurrence";
  }
}

// ── Main generator ──

export async function generateApologyLetter(
  data: ApologyLetterData
): Promise<Blob> {
  const today = todayFormatted();
  const incidentRef = data.dateOfIncident
    ? ` on ${formatDate(data.dateOfIncident)}`
    : "";

  const ctx = data.context || "Professional";
  const seed = data.recipientName + data.yourName;

  // Pick context-appropriate opening
  let openingVariants: Array<(name: string, ref: string) => string>;
  switch (ctx) {
    case "Personal":
      openingVariants = PERSONAL_OPENINGS;
      break;
    case "Customer Service":
      openingVariants = CUSTOMER_SERVICE_OPENINGS;
      break;
    case "Workplace":
      openingVariants = WORKPLACE_OPENINGS;
      break;
    default:
      openingVariants = PROFESSIONAL_OPENINGS;
      break;
  }

  const openingFn = pickVariant(openingVariants, seed);
  const openingText = openingFn(data.recipientName, incidentRef);

  // Build paragraphs
  const paragraphs = [
    ...letterHeader({
      senderName: data.yourName,
      date: today,
      recipientName: data.recipientName,
    }),

    salutation(data.recipientName, ctx === "Personal" ? "friendly" : "formal"),

    // Opening paragraph
    bodyText(openingText),

    // What happened section
    boldBodyText(whatHappenedHeading(ctx)),
    bodyText(data.whatHappened.trim()),

    // Impact acknowledgement section
    boldBodyText(impactHeading(ctx)),
    bodyText(buildImpactSection(ctx, data.acknowledgement)),

    // Prevention steps section
    boldBodyText(preventionHeading(ctx)),
    bodyText(buildPreventionSection(ctx, data.stepsToPrevent)),
  ];

  // Closing paragraphs (custom message + context-appropriate wrap-up)
  const closingParas = buildClosingParagraphs(
    ctx,
    data.closingMessage,
    data.recipientName
  );
  for (const p of closingParas) {
    paragraphs.push(bodyText(p));
  }

  // Sign off
  paragraphs.push(
    ...letterFooter({
      closingText: closingText(ctx),
      signerName: data.yourName,
    })
  );

  return buildLetterDocument(paragraphs);
}
