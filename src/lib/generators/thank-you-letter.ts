import {
  letterHeader,
  letterFooter,
  buildLetterDocument,
  bodyText,
  pickVariant,
  todayFormatted,
  salutation,
} from "./letter-utils";
import { Paragraph } from "docx";

export interface ThankYouLetterData {
  yourName: string;
  recipientName: string;
  recipientTitle: string;
  companyOrganization: string;
  purpose: string;
  specificDetails: string;
  additionalMessage: string;
}

// ── Opening variants per purpose (selected deterministically by recipientName) ──

const openingVariants: Record<string, string[]> = {
  "Job Interview": [
    "Thank you so much for taking the time to meet with me to discuss the opportunity. I thoroughly enjoyed learning about the role and your team's vision.",
    "I wanted to reach out to express my sincere gratitude for the interview opportunity. It was a pleasure to learn about the position and your organisation's goals.",
    "Thank you for the engaging and insightful conversation during our interview. I came away with a much deeper understanding of the role and how I could contribute.",
  ],
  "Business Meeting": [
    "Thank you for taking the time to meet with me. I found our discussion both productive and thought-provoking, and I appreciate your openness in sharing your perspective.",
    "I wanted to express my appreciation for our recent meeting. The conversation was incredibly valuable and has given me a great deal to consider.",
    "Thank you for a truly constructive meeting. Your insights and expertise made the discussion both informative and genuinely enjoyable.",
  ],
  Gift: [
    "I wanted to take a moment to express my heartfelt gratitude for your incredibly generous and thoughtful gift. It truly brightened my day.",
    "Thank you so much for the wonderful gift. Your generosity and thoughtfulness mean more to me than words can adequately express.",
    "I am deeply touched by your kind and generous gift. It was such a lovely surprise, and I wanted you to know how much it means to me.",
  ],
  Hospitality: [
    "I wanted to express my warmest thanks for your incredible hospitality. Your generosity and warmth made the entire experience truly unforgettable.",
    "Thank you so much for welcoming me so graciously. Your kindness and attention to every detail made my visit an absolute delight.",
    "I am writing to express my heartfelt appreciation for your wonderful hospitality. From start to finish, your warmth and generosity made everything perfect.",
  ],
  Mentorship: [
    "I wanted to take a moment to express my deep and sincere appreciation for your mentorship and guidance. Your support has been transformative in my professional development.",
    "Thank you for being such an exceptional mentor. Your willingness to share your knowledge and experience has had a profound impact on my growth.",
    "I am writing to express my genuine gratitude for your continued mentorship. The time and wisdom you have so generously shared have been invaluable to me.",
  ],
  General: [
    "I am writing to express my sincere and heartfelt gratitude. Your kindness and generosity have made a real difference, and I want you to know how much it is appreciated.",
    "Thank you so much for everything. Your thoughtfulness and generosity have not gone unnoticed, and I wanted to take a moment to let you know how grateful I am.",
    "I wanted to reach out personally to express my deep appreciation. Your support and kindness have meant a great deal to me.",
  ],
};

// ── Purpose-specific body paragraphs ──

function getPurposeBody(
  purpose: string,
  recipientName: string,
  specificDetails: string
): string[] {
  const detail = specificDetails
    ? specificDetails
    : "";

  switch (purpose) {
    case "Job Interview":
      return [
        `Our conversation gave me valuable insight into the team's objectives and the challenges ahead. ${detail ? detail + " " : ""}I was particularly impressed by the collaborative culture you described, and I am confident that my skills and experience would allow me to make a meaningful contribution from day one.`,
        `I remain very enthusiastic about the opportunity and would welcome the chance to discuss how I can add value to your team. Please do not hesitate to reach out if you require any additional information or references — I am happy to provide whatever would be helpful.`,
      ];

    case "Business Meeting":
      return [
        `I found our exchange of ideas extremely productive. ${detail ? detail + " " : ""}The key points we discussed have reinforced my confidence that there is strong potential for a mutually beneficial collaboration, and I have already begun considering how we might move forward together.`,
        `I am eager to build on the momentum from our meeting and would welcome the opportunity to continue the conversation. Please let me know a convenient time to reconnect and discuss next steps in more detail.`,
      ];

    case "Gift":
      return [
        `${detail ? detail + " " : ""}Your thoughtfulness in choosing something so personal and meaningful truly touched me. It is clear that you put a great deal of care and consideration into the gesture, and that makes it all the more special.`,
        `Gifts like yours are a beautiful reminder of the kindness and generosity that exist in the world. I will treasure it and think of you fondly each time I see it. Thank you for your incredible thoughtfulness.`,
      ];

    case "Hospitality":
      return [
        `${detail ? detail + " " : ""}Every moment of my visit was made special by your warm welcome and generous spirit. From the wonderful conversations to the small touches that made me feel right at home, it was an experience I will always remember fondly.`,
        `Your hospitality set a truly remarkable standard of warmth and care. I would love to return the favour and welcome you to visit me at your earliest convenience — it would be my absolute pleasure to host you in return.`,
      ];

    case "Mentorship":
      return [
        `${detail ? detail + " " : ""}Your guidance has directly contributed to meaningful growth in both my professional capabilities and my confidence. The specific advice you have shared, the challenges you have encouraged me to take on, and the perspective you have offered have all shaped my approach in lasting ways.`,
        `The impact of your mentorship extends well beyond the immediate lessons — it has fundamentally influenced how I think about my career and my potential. I want you to know that your investment of time and energy has not been taken for granted, and I carry your wisdom with me in everything I do.`,
      ];

    case "General":
    default:
      return [
        `${detail ? detail + " " : ""}Your support has had a genuinely positive impact, and I want you to know that it has not gone unnoticed. The difference you have made is significant, and I am truly grateful for your willingness to help.`,
        `Looking ahead, I carry this experience with me as a reminder of the power of generosity and kindness. Thank you for being the kind of person who makes the world a better place through your actions.`,
      ];
  }
}

// ── Closing text per purpose ──

function getClosingText(purpose: string): string {
  switch (purpose) {
    case "Job Interview":
      return "With kind regards";
    case "Business Meeting":
      return "With best regards";
    case "Gift":
      return "With warmest thanks";
    case "Hospitality":
      return "With heartfelt gratitude";
    case "Mentorship":
      return "With deepest appreciation";
    case "General":
    default:
      return "With sincere appreciation";
  }
}

// ── Main generator ──

export async function generateThankYouLetter(
  data: ThankYouLetterData
): Promise<Blob> {
  const today = todayFormatted();
  const variants = openingVariants[data.purpose] || openingVariants["General"];
  const opening = pickVariant(variants, data.recipientName);
  const bodyParagraphs = getPurposeBody(
    data.purpose,
    data.recipientName,
    data.specificDetails
  );
  const closingText = getClosingText(data.purpose);

  const paragraphs: Paragraph[] = [
    ...letterHeader({
      senderName: data.yourName,
      date: today,
      recipientName: data.recipientName,
      recipientTitle: data.recipientTitle || undefined,
      recipientCompany: data.companyOrganization || undefined,
    }),

    salutation(data.recipientName),

    // Opening paragraph
    bodyText(opening),

    // Purpose-specific body paragraphs
    ...bodyParagraphs.map((p) => bodyText(p)),
  ];

  // Optional additional personal message
  if (data.additionalMessage) {
    paragraphs.push(bodyText(data.additionalMessage));
  }

  // Footer
  paragraphs.push(
    ...letterFooter({
      closingText,
      signerName: data.yourName,
    })
  );

  return buildLetterDocument(paragraphs);
}
