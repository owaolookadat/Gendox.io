import { Document, Packer, Paragraph, TextRun } from "docx";

export interface InternshipCertificateData {
  organizationName: string;
  internName: string;
  department: string;
  internshipTitle: string;
  startDate: string;
  endDate: string;
  duration: string;
  projectDescription: string;
  skillsGained: string;
  performanceRating: string;
  supervisorName: string;
  supervisorTitle: string;
  dateOfIssue: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateInternshipCertificate(
  data: InternshipCertificateData
): Promise<Blob> {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.organizationName, bold: true, size: 28 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: "INTERNSHIP COMPLETION CERTIFICATE",
          bold: true,
          size: 26,
          underline: {},
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: `Date: ${formatDate(data.dateOfIssue)}`, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [new TextRun({ text: "To Whom It May Concern,", size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({
          text: `This is to certify that ${data.internName} has successfully completed an internship at ${data.organizationName} in the ${data.department} department.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "Internship Details:", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Role: ${data.internshipTitle}`, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Period: ${formatDate(data.startDate)} to ${formatDate(data.endDate)} (${data.duration})`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({
      children: [
        new TextRun({ text: "Project / Work Description:", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.projectDescription, size: 22 })],
    }),
  ];

  if (data.skillsGained) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Skills Gained:", bold: true, size: 22 }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.skillsGained, size: 22 })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Overall Performance: ${data.performanceRating}`,
          bold: true,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `We wish ${data.internName} all the best in their future career.`,
          size: 22,
        }),
      ],
    })
  );
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.supervisorName, bold: true, size: 22 })],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.supervisorTitle, size: 22 })],
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: data.organizationName, size: 22 })],
    })
  );

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
