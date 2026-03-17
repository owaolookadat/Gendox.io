"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateLeaveApplication,
  LeaveApplicationData,
} from "@/lib/generators/leave-application";
import { saveAs } from "file-saver";

const leaveTypes = [
  "Annual",
  "Sick",
  "Personal",
  "Maternity",
  "Paternity",
  "Bereavement",
  "Unpaid",
  "Other",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function LeaveApplicationPage() {
  const seoData = getToolSeoContent("leave-application");
  const relatedTools = getRelatedTools("leave-application");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [managerName, setManagerName] = useState("");
  const [leaveType, setLeaveType] = useState("Annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numberOfDays, setNumberOfDays] = useState<number>(1);
  const [reason, setReason] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [handoverTo, setHandoverTo] = useState("");
  const [dateOfApplication, setDateOfApplication] = useState(
    new Date().toISOString().split("T")[0]
  );

  const isValid =
    employeeName &&
    department &&
    managerName &&
    startDate &&
    endDate &&
    numberOfDays > 0 &&
    reason &&
    dateOfApplication;

  const handleDownload = async () => {
    const data: LeaveApplicationData = {
      employeeName, employeeId, department, managerName, leaveType,
      startDate, endDate, numberOfDays, reason, emergencyContact,
      handoverTo, dateOfApplication,
    };
    const blob = await generateLeaveApplication(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `leave-application-${slugify(employeeName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Leave Application Generator"
      description="Create a formal leave application letter in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employeeName" className={labelClass}>Employee Name</label>
            <input id="employeeName" type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
          </div>
          <div>
            <label htmlFor="employeeId" className={labelClass}>
              Employee ID <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input id="employeeId" type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="EMP-001" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="department" className={labelClass}>Department</label>
            <input id="department" type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering" className={inputClass} />
          </div>
          <div>
            <label htmlFor="managerName" className={labelClass}>Manager Name</label>
            <input id="managerName" type="text" value={managerName} onChange={(e) => setManagerName(e.target.value)} placeholder="John Smith" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="leaveType" className={labelClass}>Leave Type</label>
          <select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className={inputClass}>
            {leaveTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
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
            <label htmlFor="numberOfDays" className={labelClass}>Number of Days</label>
            <input id="numberOfDays" type="number" value={numberOfDays || ""} onChange={(e) => setNumberOfDays(Number(e.target.value))} min="1" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="reason" className={labelClass}>Reason</label>
          <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Please provide the reason for your leave request..." rows={4} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="emergencyContact" className={labelClass}>
              Emergency Contact <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input id="emergencyContact" type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="Phone number or email" className={inputClass} />
          </div>
          <div>
            <label htmlFor="handoverTo" className={labelClass}>
              Handover To <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input id="handoverTo" type="text" value={handoverTo} onChange={(e) => setHandoverTo(e.target.value)} placeholder="Colleague's name" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="dateOfApplication" className={labelClass}>Date of Application</label>
          <input id="dateOfApplication" type="date" value={dateOfApplication} onChange={(e) => setDateOfApplication(e.target.value)} className={inputClass} />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Leave Application" />
      </div>
    </ToolShell>
  );
}
