"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateWarningLetter,
  WarningLetterData,
} from "@/lib/generators/warning-letter";
import { saveAs } from "file-saver";

const warningLevels = [
  "First Written",
  "Second Written",
  "Final Written",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function WarningLetterPage() {
  const [companyName, setCompanyName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerTitle, setManagerTitle] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeTitle, setEmployeeTitle] = useState("");
  const [warningLevel, setWarningLevel] = useState("First Written");
  const [dateOfIncident, setDateOfIncident] = useState("");
  const [descriptionOfIssue, setDescriptionOfIssue] = useState("");
  const [previousWarnings, setPreviousWarnings] = useState("");
  const [expectedImprovement, setExpectedImprovement] = useState("");
  const [deadlineForImprovement, setDeadlineForImprovement] = useState("");
  const [consequences, setConsequences] = useState("");

  const isValid =
    companyName &&
    managerName &&
    managerTitle &&
    employeeName &&
    employeeTitle &&
    dateOfIncident &&
    descriptionOfIssue &&
    expectedImprovement &&
    deadlineForImprovement &&
    consequences;

  const handleDownload = async () => {
    const data: WarningLetterData = {
      companyName,
      managerName,
      managerTitle,
      employeeName,
      employeeTitle,
      warningLevel,
      dateOfIncident,
      descriptionOfIssue,
      previousWarnings,
      expectedImprovement,
      deadlineForImprovement,
      consequences,
    };

    const blob = await generateWarningLetter(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `warning-letter-${slugify(employeeName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Warning Letter Generator"
      description="Generate a formal employee warning letter in seconds. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="companyName" className={labelClass}>
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Corp"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="managerName" className={labelClass}>
              Manager Name
            </label>
            <input
              id="managerName"
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="Jane Doe"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="managerTitle" className={labelClass}>
              Manager Title
            </label>
            <input
              id="managerTitle"
              type="text"
              value={managerTitle}
              onChange={(e) => setManagerTitle(e.target.value)}
              placeholder="HR Manager"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employeeName" className={labelClass}>
              Employee Name
            </label>
            <input
              id="employeeName"
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="John Smith"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="employeeTitle" className={labelClass}>
              Employee Title
            </label>
            <input
              id="employeeTitle"
              type="text"
              value={employeeTitle}
              onChange={(e) => setEmployeeTitle(e.target.value)}
              placeholder="Software Developer"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="warningLevel" className={labelClass}>
              Warning Level
            </label>
            <select
              id="warningLevel"
              value={warningLevel}
              onChange={(e) => setWarningLevel(e.target.value)}
              className={inputClass}
            >
              {warningLevels.map((wl) => (
                <option key={wl} value={wl}>
                  {wl}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dateOfIncident" className={labelClass}>
              Date of Incident
            </label>
            <input
              id="dateOfIncident"
              type="date"
              value={dateOfIncident}
              onChange={(e) => setDateOfIncident(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="descriptionOfIssue" className={labelClass}>
            Description of Issue
          </label>
          <textarea
            id="descriptionOfIssue"
            value={descriptionOfIssue}
            onChange={(e) => setDescriptionOfIssue(e.target.value)}
            placeholder="Describe the issue or incident in detail..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="previousWarnings" className={labelClass}>
            Previous Warnings{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="previousWarnings"
            value={previousWarnings}
            onChange={(e) => setPreviousWarnings(e.target.value)}
            placeholder="Details of any previous warnings issued..."
            rows={2}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="expectedImprovement" className={labelClass}>
            Expected Improvement
          </label>
          <textarea
            id="expectedImprovement"
            value={expectedImprovement}
            onChange={(e) => setExpectedImprovement(e.target.value)}
            placeholder="Describe the specific improvements expected..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="deadlineForImprovement" className={labelClass}>
            Deadline for Improvement
          </label>
          <input
            id="deadlineForImprovement"
            type="date"
            value={deadlineForImprovement}
            onChange={(e) => setDeadlineForImprovement(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="consequences" className={labelClass}>
            Consequences if Not Improved
          </label>
          <textarea
            id="consequences"
            value={consequences}
            onChange={(e) => setConsequences(e.target.value)}
            placeholder="Describe consequences if improvement is not achieved..."
            rows={3}
            className={inputClass}
          />
        </div>

        <DownloadButton
          onClick={handleDownload}
          disabled={!isValid}
          label="Download Warning Letter"
        />
      </div>
    </ToolShell>
  );
}
