import { Document, Packer, Paragraph, TextRun } from "docx";

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

function formatDate(dateStr?: string): string {
  const date = dateStr ? new Date(dateStr) : new Date();
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateSponsorshipLetter(
  data: SponsorshipLetterData
): Promise<Blob> {
  const todayFormatted = formatDate();

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.yourName, bold: true, size: 24 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.yourTitle, size: 24 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.yourOrganization, size: 24 })],
    }),
    new Paragraph({ children: [] }),
    new Paragraph({
      children: [new TextRun({ text: todayFormatted, size: 24 })],
    }),
    new Paragraph({ children: [] }),
    new Paragraph({
      children: [new TextRun({ text: data.recipientName, size: 24 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.recipientOrganization, size: 24 })],
    }),
    new Paragraph({ children: [] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Re: Sponsorship Opportunity — ${data.eventName}`,
          bold: true,
          size: 24,
        }),
      ],
    }),
    new Paragraph({ children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: `Dear ${data.recipientName},`, size: 24 }),
      ],
    }),
    new Paragraph({ children: [] }),
  ];

  // Opening
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `On behalf of ${data.yourOrganization}, I am writing to invite ${data.recipientOrganization} to become a sponsor of ${data.eventName}.`,
          size: 24,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Event Description
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "About the Event", bold: true, size: 24 }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));

  if (data.eventDate) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Date: ", bold: true, size: 24 }),
          new TextRun({ text: formatDate(data.eventDate), size: 24 }),
        ],
      })
    );
    paragraphs.push(new Paragraph({ children: [] }));
  }

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.eventDescription.trim(), size: 24 }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Sponsorship details
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Sponsorship Details",
          bold: true,
          size: 24,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Sponsorship Amount/Type: ", bold: true, size: 24 }),
        new TextRun({ text: data.sponsorshipAmount.trim(), size: 24 }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Benefits
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Benefits to Your Organisation",
          bold: true,
          size: 24,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.benefitsToSponsor.trim(), size: 24 }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));

  // Deadline
  if (data.responseDeadline) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `We kindly request your response by ${formatDate(data.responseDeadline)} to allow adequate time for planning and coordination.`,
            size: 24,
          }),
        ],
      })
    );
    paragraphs.push(new Paragraph({ children: [] }));
  }

  // Closing
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `We would be delighted to discuss this opportunity further. Please feel free to contact us at: ${data.contactDetails.trim()}.`,
          size: 24,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Thank you for considering this sponsorship opportunity. We look forward to the possibility of partnering with you.",
          size: 24,
        }),
      ],
    })
  );

  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: "Yours sincerely,", size: 24 })],
    })
  );
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.yourName, size: 24 })],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.yourTitle, size: 24 })],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.yourOrganization, size: 24 })],
    })
  );

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
