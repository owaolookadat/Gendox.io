"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateTerminationLetter,
  TerminationLetterData,
} from "@/lib/generators/termination-letter";
import { saveAs } from "file-saver";

const reasons = [
  "Performance",
  "Misconduct",
  "Redundancy",
  "Restructuring",
  "End of Contract",
  "Probation Failure",
  "Other",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function TerminationLetterPage() {
  const seoData = getToolSeoContent("termination-letter");
  const relatedTools = getRelatedTools("termination-letter");
  const [companyName, setCompanyName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeTitle, setEmployeeTitle] = useState("");
  const [terminationDate, setTerminationDate] = useState("");
  const [reason, setReason] = useState("Performance");
  const [details, setDetails] = useState("");
  const [finalPayDate, setFinalPayDate] = useState("");
  const [benefitsEndDate, setBenefitsEndDate] = useState("");
  const [returnOfProperty, setReturnOfProperty] = useState("");
  const [severanceDetails, setSeveranceDetails] = useState("");
  const [hrContactName, setHrContactName] = useState("");
  const [hrContactEmail, setHrContactEmail] = useState("");

  const isValid =
    companyName &&
    employeeName &&
    employeeTitle &&
    terminationDate &&
    details &&
    finalPayDate &&
    benefitsEndDate &&
    hrContactName &&
    hrContactEmail;

  const handleDownload = async () => {
    const data: TerminationLetterData = {
      companyName,
      employeeName,
      employeeTitle,
      terminationDate,
      reason,
      details,
      finalPayDate,
      benefitsEndDate,
      returnOfProperty,
      severanceDetails,
      hrContactName,
      hrContactEmail,
    };

    const blob = await generateTerminationLetter(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `termination-letter-${slugify(employeeName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Termination Letter Generator"
      description="Generate a formal termination letter in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
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
              placeholder="Software Engineer"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="terminationDate" className={labelClass}>
              Termination Date
            </label>
            <input
              id="terminationDate"
              type="date"
              value={terminationDate}
              onChange={(e) => setTerminationDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="reason" className={labelClass}>
              Reason
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={inputClass}
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="details" className={labelClass}>
            Details
          </label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide details about the reason for termination..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="finalPayDate" className={labelClass}>
              Final Pay Date
            </label>
            <input
              id="finalPayDate"
              type="date"
              value={finalPayDate}
              onChange={(e) => setFinalPayDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="benefitsEndDate" className={labelClass}>
              Benefits End Date
            </label>
            <input
              id="benefitsEndDate"
              type="date"
              value={benefitsEndDate}
              onChange={(e) => setBenefitsEndDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="returnOfProperty" className={labelClass}>
            Return of Property{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="returnOfProperty"
            value={returnOfProperty}
            onChange={(e) => setReturnOfProperty(e.target.value)}
            placeholder="Laptop, access cards, company phone..."
            rows={2}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="severanceDetails" className={labelClass}>
            Severance Details{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="severanceDetails"
            value={severanceDetails}
            onChange={(e) => setSeveranceDetails(e.target.value)}
            placeholder="Details of any severance package..."
            rows={2}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hrContactName" className={labelClass}>
              HR Contact Name
            </label>
            <input
              id="hrContactName"
              type="text"
              value={hrContactName}
              onChange={(e) => setHrContactName(e.target.value)}
              placeholder="Sarah Johnson"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="hrContactEmail" className={labelClass}>
              HR Contact Email
            </label>
            <input
              id="hrContactEmail"
              type="email"
              value={hrContactEmail}
              onChange={(e) => setHrContactEmail(e.target.value)}
              placeholder="hr@acme.com"
              className={inputClass}
            />
          </div>
        </div>

        <DownloadButton
          onClick={handleDownload}
          disabled={!isValid}
          label="Download Termination Letter"
        />
      </div>
    </ToolShell>
  );
}
