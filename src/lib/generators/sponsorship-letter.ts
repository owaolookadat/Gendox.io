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
  formatDate,
  todayFormatted,
  FONT,
  BODY_SIZE,
} from "./letter-utils";

export interface SponsorshipLetterData {
  yourName: string;
  yourTitle: string;
  yourOrganization: string;
  recipientName: string;
  recipientOrganization: string;
  eventName: string;
  eventDate: string;
  eventDescription: string;
  sponsorshipAmount: string;
  benefitsToSponsor: string;
  responseDeadline: string;
  contactDetails: string;
}

// ── Sponsorship tier detection ──

type SponsorshipTier = "platinum" | "gold" | "silver" | "bronze" | "custom";

function detectTier(amount: string): SponsorshipTier {
  const lower = amount.toLowerCase();
  if (/platinum|title|headline|premier|principal/.test(lower)) return "platinum";
  if (/gold|major|lead|primary/.test(lower)) return "gold";
  if (/silver|supporting|secondary/.test(lower)) return "silver";
  if (/bronze|basic|community|starter/.test(lower)) return "bronze";
  return "custom";
}

function getTierLanguage(tier: SponsorshipTier): { label: string; description: string } {
  switch (tier) {
    case "platinum":
      return {
        label: "Platinum / Title Sponsor",
        description: "As a Platinum-level sponsor, your organisation will receive the highest level of visibility and brand integration, including exclusive naming rights, prime placement across all materials, and priority access to attendees and participants.",
      };
    case "gold":
      return {
        label: "Gold Sponsor",
        description: "As a Gold-level sponsor, your organisation will enjoy prominent branding, significant visibility across event communications, and priority recognition in all major event touchpoints.",
      };
    case "silver":
      return {
        label: "Silver Sponsor",
        description: "As a Silver-level sponsor, your organisation will receive meaningful brand exposure, recognition in event materials, and access to networking opportunities with attendees.",
      };
    case "bronze":
      return {
        label: "Bronze / Community Sponsor",
        description: "As a Bronze-level sponsor, your organisation will be recognised for its support with branding on select materials and acknowledgement during the event.",
      };
    default:
      return {
        label: "Event Sponsor",
        description: "As an event sponsor, your organisation will receive tailored visibility and recognition benefits commensurate with the sponsorship level described below.",
      };
  }
}

// ── ROI-focused benefits ──

function getROIBenefits(tier: SponsorshipTier, eventName: string, seed: string): string[] {
  const common = [
    `Direct access to a highly targeted audience of professionals, decision-makers, and stakeholders attending ${eventName}.`,
    "Enhanced brand credibility through association with a well-organised, reputable event.",
  ];

  switch (tier) {
    case "platinum":
      return [
        ...common,
        "Exclusive naming rights: the event will be co-branded with your organisation's name and logo.",
        "Keynote speaking slot or panel participation for your leadership team.",
        "Full-page advertisement in the official event programme and all printed materials.",
        "Dedicated social media campaign featuring your brand before, during, and after the event.",
        "First right of refusal for sponsorship of future editions.",
        "Complimentary VIP passes for your executive team and key clients.",
      ];
    case "gold":
      return [
        ...common,
        "Prominent logo placement on all event signage, banners, and digital screens.",
        "Half-page advertisement in the official event programme.",
        "Social media mentions and dedicated posts across event channels.",
        "Exhibition space in a prime location within the event venue.",
        "Complimentary passes for your team members.",
      ];
    case "silver":
      return [
        ...common,
        "Logo displayed on event website, email communications, and printed materials.",
        "Acknowledgement during opening and closing ceremonies.",
        "Social media mentions across event channels.",
        "Exhibition space within the event venue.",
      ];
    case "bronze":
      return [
        ...common,
        "Logo featured on event website and select printed materials.",
        "Verbal acknowledgement during the event.",
        "Social media mention on event channels.",
      ];
    default:
      return common;
  }
}

// ── Media coverage section ──

function getMediaVisibility(tier: SponsorshipTier, eventName: string): string {
  const base = `${eventName} attracts significant attention from industry media, influencers, and professional networks.`;

  switch (tier) {
    case "platinum":
    case "gold":
      return `${base} As a top-tier sponsor, your brand will feature prominently in all press releases, media kits, and post-event coverage. We anticipate coverage in industry publications, social media reach across thousands of engaged followers, and inclusion in any recorded or broadcast content from the event.`;
    case "silver":
      return `${base} Your brand will be included in press releases, event photography, and post-event reporting. Social media visibility will include mentions and tagged posts throughout the event.`;
    default:
      return `${base} Your organisation will be acknowledged in event communications and included in post-event reporting shared with attendees and media contacts.`;
  }
}

// ── Tax note ──

function getTaxNote(seed: string): string {
  const variants = [
    "Depending on your jurisdiction, sponsorship contributions may be tax-deductible as a business expense. We recommend consulting your tax adviser to determine the deductibility of this sponsorship under applicable tax laws.",
    "Sponsorship contributions may qualify as a deductible business expense in many jurisdictions. We encourage you to consult with your financial adviser regarding the tax implications of this sponsorship.",
    "Please note that sponsorship payments may be eligible for tax relief as a legitimate business promotion expense. We recommend seeking professional tax advice to confirm the position in your jurisdiction.",
  ];
  return pickVariant(variants, seed + "tax");
}

// ── Call-to-action ──

function getCallToAction(deadline: string, contactDetails: string, seed: string): string[] {
  const hasDeadline = !!deadline;
  const deadlineText = hasDeadline ? formatDate(deadline) : "";

  const urgencyVariants = hasDeadline
    ? [
        `To secure your sponsorship position, we kindly request confirmation by ${deadlineText}. Sponsorship allocations are limited and will be assigned on a first-come, first-served basis. Early commitment ensures maximum exposure in pre-event marketing materials.`,
        `We encourage you to confirm your participation by ${deadlineText} to guarantee inclusion in all pre-event promotional materials and communications. Tier availability is limited and subject to early confirmation.`,
        `Please respond by ${deadlineText} to take advantage of this opportunity. Early confirmation allows us to maximise your brand's visibility in all advance publicity and marketing campaigns.`,
      ]
    : [
        "We encourage an early response to allow adequate time for branding integration and pre-event marketing coordination. Sponsorship positions are limited and will be allocated on a first-come, first-served basis.",
        "An early commitment will ensure your brand receives maximum exposure across all event communications and promotional channels. We look forward to discussing this opportunity with you at your earliest convenience.",
      ];

  const result = [pickVariant(urgencyVariants, seed + "cta")];

  if (contactDetails.trim()) {
    result.push(`To discuss this opportunity further or to confirm your sponsorship, please contact: ${contactDetails.trim()}.`);
  }

  return result;
}

// ── Main generator ──

export async function generateSponsorshipLetter(
  data: SponsorshipLetterData
): Promise<Blob> {
  const today = todayFormatted();
  const seed = `${data.yourName}${data.recipientName}${data.eventName}`;
  const tier = detectTier(data.sponsorshipAmount);
  const tierInfo = getTierLanguage(tier);

  const paragraphs: Paragraph[] = [];

  // ── Header ──
  paragraphs.push(
    ...letterHeader({
      senderName: data.yourName,
      senderTitle: data.yourTitle || undefined,
      senderCompany: data.yourOrganization || undefined,
      date: today,
      recipientName: data.recipientName,
      recipientCompany: data.recipientOrganization || undefined,
    })
  );

  // ── Subject ──
  paragraphs.push(subjectLine(`Sponsorship Opportunity \u2014 ${data.eventName}`));

  // ── Salutation ──
  paragraphs.push(salutation(data.recipientName));
  paragraphs.push(spacer());

  // ── Opening ──
  const openingVariants = [
    `On behalf of ${data.yourOrganization}, I am delighted to invite ${data.recipientOrganization} to become a valued sponsor of ${data.eventName}. We believe a partnership with your organisation would be mutually beneficial and would significantly enhance the experience for all participants.`,
    `I am writing to present an exciting sponsorship opportunity for ${data.recipientOrganization}. ${data.yourOrganization} is organising ${data.eventName}, and we would be honoured to welcome your organisation as a sponsor. This partnership offers exceptional visibility and engagement opportunities.`,
    `It gives me great pleasure to extend this invitation to ${data.recipientOrganization} to partner with us as a sponsor of ${data.eventName}. We have designed our sponsorship packages to deliver measurable value and meaningful brand exposure for our partners.`,
  ];
  paragraphs.push(bodyText(pickVariant(openingVariants, seed)));

  paragraphs.push(spacer());

  // ── About the Event ──
  paragraphs.push(boldBodyText("About the Event"));
  if (data.eventDate) {
    paragraphs.push(
      richBodyText([
        new TextRun({ text: "Date: ", bold: true, size: BODY_SIZE, font: FONT }),
        new TextRun({ text: formatDate(data.eventDate), size: BODY_SIZE, font: FONT }),
      ])
    );
  }
  paragraphs.push(bodyText(data.eventDescription.trim()));

  paragraphs.push(spacer());

  // ── Sponsorship Tier ──
  paragraphs.push(boldBodyText("Sponsorship Level"));
  paragraphs.push(
    richBodyText([
      new TextRun({ text: "Tier: ", bold: true, size: BODY_SIZE, font: FONT }),
      new TextRun({ text: tierInfo.label, size: BODY_SIZE, font: FONT }),
    ])
  );
  paragraphs.push(
    richBodyText([
      new TextRun({ text: "Sponsorship Amount/Type: ", bold: true, size: BODY_SIZE, font: FONT }),
      new TextRun({ text: data.sponsorshipAmount.trim(), size: BODY_SIZE, font: FONT }),
    ])
  );
  paragraphs.push(spacer());
  paragraphs.push(bodyText(tierInfo.description));

  paragraphs.push(spacer());

  // ── ROI-Focused Benefits ──
  paragraphs.push(boldBodyText("Sponsorship Benefits and Return on Investment"));
  const roiBenefits = getROIBenefits(tier, data.eventName, seed);
  for (let i = 0; i < roiBenefits.length; i++) {
    paragraphs.push(bodyText(`${i + 1}. ${roiBenefits[i]}`));
  }

  // Include user-provided benefits if they add beyond the defaults
  if (data.benefitsToSponsor.trim()) {
    paragraphs.push(spacer());
    paragraphs.push(boldBodyText("Additional Benefits"));
    paragraphs.push(bodyText(data.benefitsToSponsor.trim()));
  }

  paragraphs.push(spacer());

  // ── Media Coverage and Visibility ──
  paragraphs.push(boldBodyText("Media Coverage and Visibility"));
  paragraphs.push(bodyText(getMediaVisibility(tier, data.eventName)));

  paragraphs.push(spacer());

  // ── Tax Deductibility ──
  paragraphs.push(boldBodyText("Tax Considerations"));
  paragraphs.push(bodyText(getTaxNote(seed)));

  paragraphs.push(spacer());

  // ── Call to Action ──
  paragraphs.push(boldBodyText("Next Steps"));
  const ctaParagraphs = getCallToAction(data.responseDeadline, data.contactDetails, seed);
  for (const text of ctaParagraphs) {
    paragraphs.push(bodyText(text));
  }

  paragraphs.push(spacer());

  // ── Closing ──
  const closingVariants = [
    "We are confident that this partnership will deliver exceptional value for your organisation and we look forward to the opportunity to collaborate. Thank you for considering this sponsorship invitation.",
    "Thank you for considering this opportunity. We are passionate about creating meaningful partnerships and would be delighted to discuss how we can tailor this sponsorship to best serve your organisation's goals.",
    "We are excited about the prospect of partnering with your organisation and are confident this sponsorship will provide outstanding returns. We look forward to hearing from you.",
  ];
  paragraphs.push(bodyText(pickVariant(closingVariants, seed + "final")));

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

  return buildLetterDocument(paragraphs);
}
