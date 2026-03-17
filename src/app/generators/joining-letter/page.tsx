"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateJoiningLetter,
  JoiningLetterData,
} from "@/lib/generators/joining-letter";
import { saveAs } from "file-saver";

const probationOptions = ["None", "1 Month", "3 Months", "6 Months"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function JoiningLetterPage() {
  const seoData = getToolSeoContent("joining-letter");
  const relatedTools = getRelatedTools("joining-letter");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [reportingTo, setReportingTo] = useState("");
  const [salary, setSalary] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [probationPeriod, setProbationPeriod] = useState("3 Months");
  const [documentsRequired, setDocumentsRequired] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [hrContactName, setHrContactName] = useState("");
  const [hrContactEmail, setHrContactEmail] = useState("");

  const isValid =
    companyName &&
    companyAddress &&
    employeeName &&
    jobTitle &&
    department &&
    dateOfJoining &&
    reportingTo &&
    salary &&
    hrContactName &&
    hrContactEmail;

  const handleDownload = async () => {
    const data: JoiningLetterData = {
      companyName, companyAddress, employeeName, jobTitle, department,
      dateOfJoining, reportingTo, salary, workingHours, probationPeriod,
      documentsRequired, dressCode, hrContactName, hrContactEmail,
    };
    const blob = await generateJoiningLetter(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `joining-letter-${slugify(employeeName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Joining Letter Generator"
      description="Create a formal joining / appointment letter in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="companyName" className={labelClass}>Company Name</label>
          <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" className={inputClass} />
        </div>

        <div>
          <label htmlFor="companyAddress" className={labelClass}>Company Address</label>
          <textarea id="companyAddress" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="123 Business Street, London, EC1A 1BB" rows={2} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employeeName" className={labelClass}>Employee Name</label>
            <input id="employeeName" type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
          </div>
          <div>
            <label htmlFor="jobTitle" className={labelClass}>Job Title</label>
            <input id="jobTitle" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Software Engineer" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="department" className={labelClass}>Department</label>
            <input id="department" type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering" className={inputClass} />
          </div>
          <div>
            <label htmlFor="dateOfJoining" className={labelClass}>Date of Joining</label>
            <input id="dateOfJoining" type="date" value={dateOfJoining} onChange={(e) => setDateOfJoining(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reportingTo" className={labelClass}>Reporting To</label>
            <input id="reportingTo" type="text" value={reportingTo} onChange={(e) => setReportingTo(e.target.value)} placeholder="John Smith, CTO" className={inputClass} />
          </div>
          <div>
            <label htmlFor="salary" className={labelClass}>Salary</label>
            <input id="salary" type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. £50,000 per annum" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="workingHours" className={labelClass}>
              Working Hours <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input id="workingHours" type="text" value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} placeholder="e.g. 9:00 AM to 5:30 PM" className={inputClass} />
          </div>
          <div>
            <label htmlFor="probationPeriod" className={labelClass}>Probation Period</label>
            <select id="probationPeriod" value={probationPeriod} onChange={(e) => setProbationPeriod(e.target.value)} className={inputClass}>
              {probationOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="documentsRequired" className={labelClass}>
            Documents Required <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea id="documentsRequired" value={documentsRequired} onChange={(e) => setDocumentsRequired(e.target.value)} placeholder="e.g. ID proof, address proof, education certificates..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="dressCode" className={labelClass}>
            Dress Code <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input id="dressCode" type="text" value={dressCode} onChange={(e) => setDressCode(e.target.value)} placeholder="e.g. Business casual" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hrContactName" className={labelClass}>HR Contact Name</label>
            <input id="hrContactName" type="text" value={hrContactName} onChange={(e) => setHrContactName(e.target.value)} placeholder="Sarah Johnson" className={inputClass} />
          </div>
          <div>
            <label htmlFor="hrContactEmail" className={labelClass}>HR Contact Email</label>
            <input id="hrContactEmail" type="text" value={hrContactEmail} onChange={(e) => setHrContactEmail(e.target.value)} placeholder="hr@company.com" className={inputClass} />
          </div>
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Joining Letter" />
      </div>
    </ToolShell>
  );
}
