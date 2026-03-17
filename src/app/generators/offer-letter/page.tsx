"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateOfferLetter,
  OfferLetterData,
} from "@/lib/generators/offer-letter";
import { saveAs } from "file-saver";

const payFrequencies = ["Annual", "Monthly", "Hourly"];
const employmentTypes = ["Full-time", "Part-time", "Contract"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function OfferLetterPage() {
  const seoData = getToolSeoContent("offer-letter");
  const relatedTools = getRelatedTools("offer-letter");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [salary, setSalary] = useState<number>(0);
  const [payFrequency, setPayFrequency] = useState("Annual");
  const [benefitsSummary, setBenefitsSummary] = useState("");
  const [reportingTo, setReportingTo] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [responseDeadline, setResponseDeadline] = useState("");

  const isValid =
    companyName &&
    companyAddress &&
    candidateName &&
    jobTitle &&
    department &&
    startDate &&
    salary > 0 &&
    reportingTo &&
    responseDeadline;

  const handleDownload = async () => {
    const data: OfferLetterData = {
      companyName,
      companyAddress,
      candidateName,
      jobTitle,
      department,
      startDate,
      salary,
      payFrequency,
      benefitsSummary,
      reportingTo,
      employmentType,
      responseDeadline,
    };

    const blob = await generateOfferLetter(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `offer-letter-${slugify(candidateName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Offer Letter Generator"
      description="Create a professional job offer letter in seconds. Download as Word document instantly."
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

        <div>
          <label htmlFor="companyAddress" className={labelClass}>
            Company Address
          </label>
          <textarea
            id="companyAddress"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            placeholder="123 Business Street, London, EC1A 1BB"
            rows={2}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="candidateName" className={labelClass}>
              Candidate Name
            </label>
            <input
              id="candidateName"
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Jane Doe"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="jobTitle" className={labelClass}>
              Job Title
            </label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Software Engineer"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="department" className={labelClass}>
              Department
            </label>
            <input
              id="department"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Engineering"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="reportingTo" className={labelClass}>
              Reporting To
            </label>
            <input
              id="reportingTo"
              type="text"
              value={reportingTo}
              onChange={(e) => setReportingTo(e.target.value)}
              placeholder="John Smith, CTO"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="startDate" className={labelClass}>
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="salary" className={labelClass}>
              Salary
            </label>
            <input
              id="salary"
              type="number"
              value={salary || ""}
              onChange={(e) => setSalary(Number(e.target.value))}
              placeholder="50000"
              min="0"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="payFrequency" className={labelClass}>
              Pay Frequency
            </label>
            <select
              id="payFrequency"
              value={payFrequency}
              onChange={(e) => setPayFrequency(e.target.value)}
              className={inputClass}
            >
              {payFrequencies.map((pf) => (
                <option key={pf} value={pf}>
                  {pf}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="employmentType" className={labelClass}>
              Employment Type
            </label>
            <select
              id="employmentType"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className={inputClass}
            >
              {employmentTypes.map((et) => (
                <option key={et} value={et}>
                  {et}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="benefitsSummary" className={labelClass}>
            Benefits Summary{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="benefitsSummary"
            value={benefitsSummary}
            onChange={(e) => setBenefitsSummary(e.target.value)}
            placeholder="Health insurance, pension scheme, 25 days annual leave..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="responseDeadline" className={labelClass}>
            Response Deadline
          </label>
          <input
            id="responseDeadline"
            type="date"
            value={responseDeadline}
            onChange={(e) => setResponseDeadline(e.target.value)}
            className={inputClass}
          />
        </div>

        <DownloadButton
          onClick={handleDownload}
          disabled={!isValid}
          label="Download Offer Letter"
        />
      </div>
    </ToolShell>
  );
}
