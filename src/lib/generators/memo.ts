import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";

export interface MemoData {
  from: string;
  to: string;
  cc: string;
  date: string;
  subject: string;
  priority: string;
  body: string;
  actionRequired: string;
}

export async function generateMemo(data: MemoData): Promise<Blob> {
  const detailLine = (label: string, value: string) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 22 }),
        new TextRun({ text: value, size: 22, color: "333333" }),
      ],
      spacing: { after: 80 },
    });

  const doc = new Document({
    sections: [
      {
        children: [
          // MEMO heading
          new Paragraph({
            children: [
              new TextRun({ text: "MEMORANDUM", bold: true, size: 36 }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Header details
          detailLine("TO", data.to),
          detailLine("FROM", data.from),
          ...(data.cc
            ? [detailLine("CC", data.cc)]
            : []),
          detailLine("DATE", data.date),
          detailLine("SUBJECT", data.subject),
          ...(data.priority !== "Normal"
            ? [detailLine("PRIORITY", data.priority)]
            : []),

          // Divider
          new Paragraph({
            children: [
              new TextRun({
                text: "────────────────────────────────────────────────",
                size: 20,
                color: "999999",
              }),
            ],
            spacing: { before: 200, after: 400 },
          }),

          // Body
          ...data.body.split("\n").map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line.trim(),
                    size: 22,
                    color: "333333",
                  }),
                ],
                spacing: { after: 120 },
              })
          ),

          // Action Required
          ...(data.actionRequired
            ? [
                new Paragraph({
                  spacing: { before: 400 },
                  children: [
                    new TextRun({
                      text: "Action Required:",
                      bold: true,
                      size: 22,
                      color: "1a1a1a",
                    }),
                  ],
                }),
                ...data.actionRequired.split("\n").map(
                  (line) =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: line.trim(),
                          size: 22,
                          color: "333333",
                        }),
                      ],
                      spacing: { after: 80 },
                    })
                ),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
