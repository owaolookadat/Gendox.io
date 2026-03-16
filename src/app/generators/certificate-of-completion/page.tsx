"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateCertificateOfCompletion,
  CertificateOfCompletionData,
} from "@/lib/generators/certificate-of-completion";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CertificateOfCompletionPage() {
  const [recipientName, setRecipientName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [skillsCovered, setSkillsCovered] = useState("");
  const [gradeScore, setGradeScore] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [issuedByName, setIssuedByName] = useState("");
  const [issuedByTitle, setIssuedByTitle] = useState("");
  const [dateOfIssue, setDateOfIssue] = useState(
    new Date().toISOString().split("T")[0]
  );

  const isValid =
    recipientName &&
    courseName &&
    organizationName &&
    completionDate &&
    duration &&
    issuedByName &&
    issuedByTitle &&
    dateOfIssue;

  const handleDownload = async () => {
    const data: CertificateOfCompletionData = {
      recipientName, courseName, organizationName, completionDate,
      duration, description, skillsCovered, gradeScore,
      certificateNumber, issuedByName, issuedByTitle, dateOfIssue,
    };
    const blob = await generateCertificateOfCompletion(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `certificate-of-completion-${slugify(recipientName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Certificate of Completion Generator"
      description="Create a formal certificate of completion in seconds. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="recipientName" className={labelClass}>Recipient Name</label>
          <input id="recipientName" type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
        </div>

        <div>
          <label htmlFor="courseName" className={labelClass}>Course / Programme Name</label>
          <input id="courseName" type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Advanced Web Development" className={inputClass} />
        </div>

        <div>
          <label htmlFor="organizationName" className={labelClass}>Organization / Institution Name</label>
          <input id="organizationName" type="text" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} placeholder="Acme Training Academy" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="completionDate" className={labelClass}>Completion Date</label>
            <input id="completionDate" type="date" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="duration" className={labelClass}>Duration</label>
            <input id="duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 12 weeks, 40 hours" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the course or programme..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="skillsCovered" className={labelClass}>
            Skills / Topics Covered <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea id="skillsCovered" value={skillsCovered} onChange={(e) => setSkillsCovered(e.target.value)} placeholder="e.g. HTML, CSS, JavaScript, React, Node.js..." rows={3} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="gradeScore" className={labelClass}>
              Grade / Score <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input id="gradeScore" type="text" value={gradeScore} onChange={(e) => setGradeScore(e.target.value)} placeholder="e.g. A, 95%, Distinction" className={inputClass} />
          </div>
          <div>
            <label htmlFor="certificateNumber" className={labelClass}>
              Certificate Number <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input id="certificateNumber" type="text" value={certificateNumber} onChange={(e) => setCertificateNumber(e.target.value)} placeholder="e.g. CERT-2026-001" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="issuedByName" className={labelClass}>Issued By Name</label>
            <input id="issuedByName" type="text" value={issuedByName} onChange={(e) => setIssuedByName(e.target.value)} placeholder="John Smith" className={inputClass} />
          </div>
          <div>
            <label htmlFor="issuedByTitle" className={labelClass}>Issued By Title</label>
            <input id="issuedByTitle" type="text" value={issuedByTitle} onChange={(e) => setIssuedByTitle(e.target.value)} placeholder="Director of Training" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="dateOfIssue" className={labelClass}>Date of Issue</label>
          <input id="dateOfIssue" type="date" value={dateOfIssue} onChange={(e) => setDateOfIssue(e.target.value)} className={inputClass} />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Certificate of Completion" />
      </div>
    </ToolShell>
  );
}
