"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateRelievingLetter,
  RelievingLetterData,
} from "@/lib/generators/relieving-letter";
import { saveAs } from "file-saver";

const reasonOptions = [
  "Resignation",
  "Retirement",
  "End of Contract",
  "Mutual Agreement",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function RelievingLetterPage() {
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeDesignation, setEmployeeDesignation] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [dateOfResignation, setDateOfResignation] = useState("");
  const [lastWorkingDay, setLastWorkingDay] = useState("");
  const [reasonForLeaving, setReasonForLeaving] = useState("Resignation");
  const [outstandingDuesCleared, setOutstandingDuesCleared] = useState(true);
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
    dateOfResignation &&
    lastWorkingDay &&
    issuerName &&
    issuerDesignation &&
    dateOfIssue;

  const handleDownload = async () => {
    const data: RelievingLetterData = {
      companyName, companyAddress, employeeName, employeeDesignation,
      employeeId, department, dateOfJoining, dateOfResignation,
      lastWorkingDay, reasonForLeaving, outstandingDuesCleared,
      issuerName, issuerDesignation, dateOfIssue,
    };
    const blob = await generateRelievingLetter(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `relieving-letter-${slugify(employeeName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Relieving Letter Generator"
      description="Create a formal relieving letter confirming employee separation in seconds. Download as Word document instantly."
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employeeId" className={labelClass}>
              Employee ID <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input id="employeeId" type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="EMP-001" className={inputClass} />
          </div>
          <div>
            <label htmlFor="department" className={labelClass}>Department</label>
            <input id="department" type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="dateOfJoining" className={labelClass}>Date of Joining</label>
            <input id="dateOfJoining" type="date" value={dateOfJoining} onChange={(e) => setDateOfJoining(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="dateOfResignation" className={labelClass}>Date of Resignation</label>
            <input id="dateOfResignation" type="date" value={dateOfResignation} onChange={(e) => setDateOfResignation(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="lastWorkingDay" className={labelClass}>Last Working Day</label>
            <input id="lastWorkingDay" type="date" value={lastWorkingDay} onChange={(e) => setLastWorkingDay(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="reasonForLeaving" className={labelClass}>Reason for Leaving</label>
          <select id="reasonForLeaving" value={reasonForLeaving} onChange={(e) => setReasonForLeaving(e.target.value)} className={inputClass}>
            {reasonOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="outstandingDuesCleared"
            type="checkbox"
            checked={outstandingDuesCleared}
            onChange={(e) => setOutstandingDuesCleared(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="outstandingDuesCleared" className="text-sm font-medium text-gray-700">
            Outstanding Dues Cleared
          </label>
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

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Relieving Letter" />
      </div>
    </ToolShell>
  );
}
