import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export interface MeetingMinutesData {
  meetingTitle: string;
  date: string;
  time: string;
  location: string;
  chairperson: string;
  attendees: string;
  absentees: string;
  agendaItems: string;
  discussionPoints: string;
  decisionsMade: string;
  actionItems: string;
  nextMeetingDate: string;
}

function multiLineParagraphs(text: string): Paragraph[] {
  return text
    .split("\n")
    .filter((line) => line.trim())
    .map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: `  ${line.trim()}`, size: 20, color: "333333" }),
          ],
          spacing: { after: 60 },
        })
    );
}

export async function generateMeetingMinutes(
  data: MeetingMinutesData
): Promise<Blob> {
  const sectionHeading = (text: string) =>
    new Paragraph({
      children: [
        new TextRun({ text, bold: true, size: 24, color: "1a1a1a" }),
      ],
      spacing: { before: 400, after: 150 },
    });

  const detailLine = (label: string, value: string) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 20 }),
        new TextRun({ text: value, size: 20, color: "333333" }),
      ],
      spacing: { after: 60 },
    });

  const doc = new Document({
    sections: [
      {
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: "MEETING MINUTES",
                bold: true,
                size: 36,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Meeting Title
          new Paragraph({
            children: [
              new TextRun({
                text: data.meetingTitle,
                bold: true,
                size: 28,
                color: "333333",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Meeting details
          detailLine("Date", data.date),
          detailLine("Time", data.time),
          detailLine("Location", data.location),
          detailLine("Chairperson", data.chairperson),

          new Paragraph({ spacing: { after: 200 }, children: [] }),

          // Attendees
          sectionHeading("Attendees"),
          ...multiLineParagraphs(data.attendees),

          // Absentees
          ...(data.absentees
            ? [sectionHeading("Absentees"), ...multiLineParagraphs(data.absentees)]
            : []),

          // Agenda
          sectionHeading("Agenda"),
          ...multiLineParagraphs(data.agendaItems),

          // Discussion Points
          sectionHeading("Discussion Points"),
          ...multiLineParagraphs(data.discussionPoints),

          // Decisions Made
          sectionHeading("Decisions Made"),
          ...multiLineParagraphs(data.decisionsMade),

          // Action Items
          sectionHeading("Action Items"),
          ...multiLineParagraphs(data.actionItems),

          // Next Meeting
          ...(data.nextMeetingDate
            ? [
                new Paragraph({ spacing: { after: 200 }, children: [] }),
                detailLine("Next Meeting Date", data.nextMeetingDate),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
