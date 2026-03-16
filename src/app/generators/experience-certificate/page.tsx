"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateExperienceCertificate,
  ExperienceCertificateData,
} from "@/lib/generators/experience-certificate";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ExperienceCertificatePage() {
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeDesignation, setEmployeeDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [dateOfLeaving, setDateOfLeaving] = useState("");
  const [duties, setDuties] = useState("");
  const [performanceSummary, setPerformanceSummary] = useState("");
  const [issuerName, setIssuerName] = useState("");
  const [issuerDesignation, setIssuerDesignation] = useState("");
  const [dateOfIssue, setDateOfIssue] = useState(
    new Date().toISOString().split("T")[0]
  );

  const isValid =
    companyName &&
    companyAddress &&
    employeeName &&
    employeeDesignation &&
    department &&
    dateOfJoining &&
    dateOfLeaving &&
    duties &&
    issuerName &&
    issuerDesignation &&
    dateOfIssue;

  const handleDownload = async () => {
    const data: ExperienceCertificateData = {
      companyName, companyAddress, employeeName, employeeDesignation,
      department, dateOfJoining, dateOfLeaving, duties, performanceSummary,
      issuerName, issuerDesignation, dateOfIssue,
    };
    const blob = await generateExperienceCertificate(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `experience-certificate-${slugify(employeeName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Experience Certificate Generator"
      description="Create a formal experience/employment certificate in seconds. Download as Word document instantly."
      category="Document Generator"
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
            <label htmlFor="employeeDesignation" className={labelClass}>Employee Designation</label>
            <input id="employeeDesignation" type="text" value={employeeDesignation} onChange={(e) => setEmployeeDesignation(e.target.value)} placeholder="Software Engineer" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="department" className={labelClass}>Department</label>
          <input id="department" type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateOfJoining" className={labelClass}>Date of Joining</label>
            <input id="dateOfJoining" type="date" value={dateOfJoining} onChange={(e) => setDateOfJoining(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="dateOfLeaving" className={labelClass}>Date of Leaving</label>
            <input id="dateOfLeaving" type="date" value={dateOfLeaving} onChange={(e) => setDateOfLeaving(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="duties" className={labelClass}>Duties / Responsibilities</label>
          <textarea id="duties" value={duties} onChange={(e) => setDuties(e.target.value)} placeholder="Describe the employee's key duties and responsibilities..." rows={4} className={inputClass} />
        </div>

        <div>
          <label htmlFor="performanceSummary" className={labelClass}>
            Performance Summary <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea id="performanceSummary" value={performanceSummary} onChange={(e) => setPerformanceSummary(e.target.value)} placeholder="Brief summary of employee's performance..." rows={3} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="issuerName" className={labelClass}>Issuer Name</label>
            <input id="issuerName" type="text" value={issuerName} onChange={(e) => setIssuerName(e.target.value)} placeholder="John Smith" className={inputClass} />
          </div>
          <div>
            <label htmlFor="issuerDesignation" className={labelClass}>Issuer Designation</label>
            <input id="issuerDesignation" type="text" value={issuerDesignation} onChange={(e) => setIssuerDesignation(e.target.value)} placeholder="HR Manager" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="dateOfIssue" className={labelClass}>Date of Issue</label>
          <input id="dateOfIssue" type="date" value={dateOfIssue} onChange={(e) => setDateOfIssue(e.target.value)} className={inputClass} />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Experience Certificate" />
      </div>
    </ToolShell>
  );
}
