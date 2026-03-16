import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
} from "docx";

export interface EmploymentContractData {
  employerName: string;
  employerAddress: string;
  employeeName: string;
  employeeAddress: string;
  jobTitle: string;
  department: string;
  startDate: string;
  employmentType: string;
  salary: number;
  payFrequency: string;
  workingHours: string;
  probationPeriod: string;
  noticePeriod: string;
  benefits: string;
  confidentialityClause: boolean;
  nonCompeteClause: boolean;
  governingLaw: string;
}

export async function generateEmploymentContract(
  data: EmploymentContractData
): Promise<Blob> {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "EMPLOYMENT CONTRACT",
          bold: true,
          size: 32,
        }),
      ],
    }),

    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `This Employment Contract ("Contract") is entered into between:`,
          size: 22,
        }),
      ],
    }),

    // Employer
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Employer: ", bold: true, size: 22 }),
        new TextRun({ text: data.employerName, size: 22 }),
      ],
    }),
    ...data.employerAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 20, color: "555555" }),
          ],
        })
    ),
    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // Employee
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "Employee: ", bold: true, size: 22 }),
        new TextRun({ text: data.employeeName, size: 22 }),
      ],
    }),
    ...data.employeeAddress.split("\n").map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({ text: line.trim(), size: 20, color: "555555" }),
          ],
        })
    ),
    new Paragraph({ spacing: { after: 300 }, children: [] }),

    // 1. Position
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "1. POSITION AND DUTIES", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The Employer agrees to employ ${data.employeeName} in the position of ${data.jobTitle}${data.department ? ` in the ${data.department} department` : ""}. The Employee shall perform all duties and responsibilities associated with this position as directed by the Employer.`,
          size: 22,
        }),
      ],
    }),

    // 2. Start Date & Type
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "2. COMMENCEMENT AND TYPE OF EMPLOYMENT",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `This employment shall commence on ${data.startDate}. The nature of this employment is ${data.employmentType}.`,
          size: 22,
        }),
      ],
    }),

    // 3. Remuneration
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "3. REMUNERATION", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The Employee shall receive a salary of ${data.salary.toLocaleString()} payable ${data.payFrequency.toLowerCase()}, subject to applicable tax deductions and withholdings.`,
          size: 22,
        }),
      ],
    }),

    // 4. Working Hours
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "4. WORKING HOURS", bold: true, size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `The Employee's normal working hours shall be ${data.workingHours}. The Employee may be required to work additional hours as reasonably necessary to fulfil the duties of the role.`,
          size: 22,
        }),
      ],
    }),

    // 5. Probation
    ...(data.probationPeriod !== "None"
      ? [
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "5. PROBATIONARY PERIOD",
                bold: true,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `The Employee shall be subject to a probationary period of ${data.probationPeriod}. During this period, either party may terminate the employment with one week's written notice. Upon successful completion of the probationary period, the terms of this Contract shall continue in full force.`,
                size: 22,
              }),
            ],
          }),
        ]
      : []),

    // 6. Notice Period
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `${data.probationPeriod !== "None" ? "6" : "5"}. TERMINATION AND NOTICE`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `Either party may terminate this Contract by providing ${data.noticePeriod} written notice to the other party. The Employer reserves the right to terminate the employment immediately for gross misconduct or material breach of this Contract.`,
          size: 22,
        }),
      ],
    }),
  ];

  let clauseNum = data.probationPeriod !== "None" ? 7 : 6;

  // Benefits
  if (data.benefits) {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `${clauseNum}. BENEFITS`,
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: `The Employee shall be entitled to the following benefits: ${data.benefits}`,
            size: 22,
          }),
        ],
      })
    );
    clauseNum++;
  }

  // Confidentiality
  if (data.confidentialityClause) {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `${clauseNum}. CONFIDENTIALITY`,
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: `The Employee agrees to keep confidential all proprietary information, trade secrets, and business affairs of the Employer both during and after the term of employment. The Employee shall not disclose any such information to third parties without the prior written consent of the Employer.`,
            size: 22,
          }),
        ],
      })
    );
    clauseNum++;
  }

  // Non-Compete
  if (data.nonCompeteClause) {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `${clauseNum}. NON-COMPETE`,
            bold: true,
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: `For a period of 12 months following the termination of this employment, the Employee agrees not to engage in any business activity that directly competes with the Employer's business, nor solicit any clients or employees of the Employer, within a reasonable geographic scope related to the Employer's operations.`,
            size: 22,
          }),
        ],
      })
    );
    clauseNum++;
  }

  // Governing Law
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `${clauseNum}. GOVERNING LAW`,
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `This Contract shall be governed by and construed in accordance with the laws of ${data.governingLaw}.`,
          size: 22,
        }),
      ],
    })
  );

  // Signatures
  children.push(
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "IN WITNESS WHEREOF, the parties have executed this Contract.",
          bold: true,
          size: 22,
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: "______________________________", size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 50 },
      children: [
        new TextRun({ text: `${data.employerName} (Employer)`, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: "Date: _______________", size: 22 })],
    }),
    new Paragraph({ spacing: { after: 400 }, children: [] }),
    new Paragraph({
      children: [
        new TextRun({ text: "______________________________", size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 50 },
      children: [
        new TextRun({ text: `${data.employeeName} (Employee)`, size: 22 }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: "Date: _______________", size: 22 })],
    })
  );

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBlob(doc);
}
