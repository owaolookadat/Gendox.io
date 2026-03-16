import { Document, Packer, Paragraph, TextRun } from "docx";

export interface CompanyProfileData {
  companyName: string;
  foundedYear: string;
  headquarters: string;
  industry: string;
  companyType: string;
  numberOfEmployees: string;
  missionStatement: string;
  companyOverview: string;
  productsServices: string;
  keyAchievements: string;
  leadershipTeam: string;
  contactInformation: string;
}

export async function generateCompanyProfile(data: CompanyProfileData): Promise<Blob> {
  const paragraphs: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: data.companyName, bold: true, size: 36 })] }),
    new Paragraph({ children: [new TextRun({ text: "Company Profile", size: 26, color: "666666" })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // Quick Facts
    new Paragraph({ children: [new TextRun({ text: "Company Overview", bold: true, size: 26 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
    new Paragraph({ children: [new TextRun({ text: `Founded: ${data.foundedYear}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: `Headquarters: ${data.headquarters}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: `Industry: ${data.industry}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: `Company Type: ${data.companyType}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: `Number of Employees: ${data.numberOfEmployees}`, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // Mission Statement
    new Paragraph({ children: [new TextRun({ text: "Mission Statement", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: data.missionStatement, italics: true, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // About
    new Paragraph({ children: [new TextRun({ text: "About Us", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: data.companyOverview, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),

    // Products & Services
    new Paragraph({ children: [new TextRun({ text: "Products & Services", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: data.productsServices, size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: "" })] }),
  ];

  if (data.keyAchievements) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Key Achievements", bold: true, size: 24 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.keyAchievements, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  if (data.leadershipTeam) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Leadership Team", bold: true, size: 24 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: data.leadershipTeam, size: 22 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
  }

  // Contact
  paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Contact Information", bold: true, size: 24 })] }));
  const contactLines = data.contactInformation.split("\n").filter(Boolean);
  for (const line of contactLines) {
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: line, size: 22 })] }));
  }

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(doc);
}
