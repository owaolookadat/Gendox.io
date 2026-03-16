import { Document, Packer, Paragraph, TextRun } from "docx";

export interface JobDescriptionData {
  companyName: string;
  jobTitle: string;
  department: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  jobSummary: string;
  keyResponsibilities: string;
  requiredQualifications: string;
  preferredQualifications: string;
  benefits: string;
  applicationDeadline: string;
  howToApply: string;
}

function buildBulletList(text: string, size: number): Paragraph[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: `  •  ${line}`, size })],
        })
    );
}

export async function generateJobDescription(data: JobDescriptionData): Promise<Blob> {
  const paragraphs: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: data.companyName, bold: true, size: 28 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({ children: [new TextRun({ text: "JOB DESCRIPTION", bold: true, size: 26 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({ children: [new TextRun({ text: `Job Title: ${data.jobTitle}`, bold: true, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: `Department: ${data.department}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: `Location: ${data.location}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: `Employment Type: ${data.employmentType}`, size: 22 })] }),
  ];

  if (data.salaryRange) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `Salary Range: ${data.salaryRange}`, size: 22 })] }));
  }

  if (data.applicationDeadline) {
    const formatted = new Date(data.applicationDeadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `Application Deadline: ${formatted}`, size: 22 })] }));
  }

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Job Summary
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Job Summary", bold: true, size: 24 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.jobSummary, size: 22 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Key Responsibilities
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Key Responsibilities", bold: true, size: 24 })] }));
  paragraphs.push(...buildBulletList(data.keyResponsibilities, 22));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Required Qualifications
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Required Qualifications", bold: true, size: 24 })] }));
  paragraphs.push(...buildBulletList(data.requiredQualifications, 22));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  // Preferred Qualifications
  if (data.preferredQualifications) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Preferred Qualifications", bold: true, size: 24 })] }));
    paragraphs.push(...buildBulletList(data.preferredQualifications, 22));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  // Benefits
  if (data.benefits) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Benefits", bold: true, size: 24 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.benefits, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  // How to Apply
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "How to Apply", bold: true, size: 24 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.howToApply, size: 22 })] }));
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));

  paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${data.companyName} is an equal opportunity employer.`, italics: true, size: 20, color: "666666" })] }));

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
