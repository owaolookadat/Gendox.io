"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateInternshipCertificate,
  InternshipCertificateData,
} from "@/lib/generators/internship-certificate";
import { saveAs } from "file-saver";

const performanceRatings = [
  "Outstanding",
  "Excellent",
  "Good",
  "Satisfactory",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function InternshipCertificatePage() {
  const [organizationName, setOrganizationName] = useState("");
  const [internName, setInternName] = useState("");
  const [department, setDepartment] = useState("");
  const [internshipTitle, setInternshipTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [skillsGained, setSkillsGained] = useState("");
  const [performanceRating, setPerformanceRating] = useState("Good");
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorTitle, setSupervisorTitle] = useState("");
  const [dateOfIssue, setDateOfIssue] = useState(
    new Date().toISOString().split("T")[0]
  );

  const isValid =
    organizationName &&
    internName &&
    department &&
    internshipTitle &&
    startDate &&
    endDate &&
    duration &&
    projectDescription &&
    supervisorName &&
    supervisorTitle &&
    dateOfIssue;

  const handleDownload = async () => {
    const data: InternshipCertificateData = {
      organizationName, internName, department, internshipTitle,
      startDate, endDate, duration, projectDescription, skillsGained,
      performanceRating, supervisorName, supervisorTitle, dateOfIssue,
    };
    const blob = await generateInternshipCertificate(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `internship-certificate-${slugify(internName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Internship Certificate Generator"
      description="Create a professional internship completion certificate in seconds. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="organizationName" className={labelClass}>Company / Organization Name</label>
          <input id="organizationName" type="text" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} placeholder="Acme Corp" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="internName" className={labelClass}>Intern Name</label>
            <input id="internName" type="text" value={internName} onChange={(e) => setInternName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
          </div>
          <div>
            <label htmlFor="department" className={labelClass}>Department</label>
            <input id="department" type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="internshipTitle" className={labelClass}>Internship Title / Role</label>
          <input id="internshipTitle" type="text" value={internshipTitle} onChange={(e) => setInternshipTitle(e.target.value)} placeholder="Software Engineering Intern" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="startDate" className={labelClass}>Start Date</label>
            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="endDate" className={labelClass}>End Date</label>
            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="duration" className={labelClass}>Duration</label>
            <input id="duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="3 months" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="projectDescription" className={labelClass}>Project / Work Description</label>
          <textarea id="projectDescription" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Describe the intern's project and work..." rows={4} className={inputClass} />
        </div>

        <div>
          <label htmlFor="skillsGained" className={labelClass}>
            Skills Gained <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea id="skillsGained" value={skillsGained} onChange={(e) => setSkillsGained(e.target.value)} placeholder="e.g. React, TypeScript, Agile methodology..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="performanceRating" className={labelClass}>Performance Rating</label>
          <select id="performanceRating" value={performanceRating} onChange={(e) => setPerformanceRating(e.target.value)} className={inputClass}>
            {performanceRatings.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="supervisorName" className={labelClass}>Supervisor Name</label>
            <input id="supervisorName" type="text" value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} placeholder="John Smith" className={inputClass} />
          </div>
          <div>
            <label htmlFor="supervisorTitle" className={labelClass}>Supervisor Title</label>
            <input id="supervisorTitle" type="text" value={supervisorTitle} onChange={(e) => setSupervisorTitle(e.target.value)} placeholder="Engineering Manager" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="dateOfIssue" className={labelClass}>Date of Issue</label>
          <input id="dateOfIssue" type="date" value={dateOfIssue} onChange={(e) => setDateOfIssue(e.target.value)} className={inputClass} />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Internship Certificate" />
      </div>
    </ToolShell>
  );
}
