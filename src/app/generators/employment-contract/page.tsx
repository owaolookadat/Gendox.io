"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateEmploymentContract,
  EmploymentContractData,
} from "@/lib/generators/employment-contract";
import { saveAs } from "file-saver";

const employmentTypes = ["Full-time", "Part-time", "Fixed-term"];
const payFrequencies = ["Monthly", "Bi-weekly", "Weekly"];
const probationPeriods = ["None", "1 Month", "3 Months", "6 Months"];
const noticePeriods = ["1 Week", "2 Weeks", "1 Month", "3 Months"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EmploymentContractPage() {
  const [employerName, setEmployerName] = useState("");
  const [employerAddress, setEmployerAddress] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [salary, setSalary] = useState<number | "">("");
  const [payFrequency, setPayFrequency] = useState("Monthly");
  const [workingHours, setWorkingHours] = useState("");
  const [probationPeriod, setProbationPeriod] = useState("3 Months");
  const [noticePeriod, setNoticePeriod] = useState("1 Month");
  const [benefits, setBenefits] = useState("");
  const [confidentialityClause, setConfidentialityClause] = useState(true);
  const [nonCompeteClause, setNonCompeteClause] = useState(false);
  const [governingLaw, setGoverningLaw] = useState("");

  const isValid =
    employerName &&
    employerAddress &&
    employeeName &&
    employeeAddress &&
    jobTitle &&
    startDate &&
    salary &&
    workingHours &&
    governingLaw;

  const handleDownload = async () => {
    const data: EmploymentContractData = {
      employerName,
      employerAddress,
      employeeName,
      employeeAddress,
      jobTitle,
      department,
      startDate,
      employmentType,
      salary: Number(salary),
      payFrequency,
      workingHours,
      probationPeriod,
      noticePeriod,
      benefits,
      confidentialityClause,
      nonCompeteClause,
      governingLaw,
    };
    const blob = await generateEmploymentContract(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `employment-contract-${slugify(employeeName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Employment Contract Generator"
      description="Generate a professional employment contract in seconds. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employerName" className={labelClass}>
              Employer Name
            </label>
            <input
              id="employerName"
              type="text"
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
              placeholder="Company name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="employeeName" className={labelClass}>
              Employee Name
            </label>
            <input
              id="employeeName"
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Full name"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employerAddress" className={labelClass}>
              Employer Address
            </label>
            <textarea
              id="employerAddress"
              value={employerAddress}
              onChange={(e) => setEmployerAddress(e.target.value)}
              placeholder="Full address"
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="employeeAddress" className={labelClass}>
              Employee Address
            </label>
            <textarea
              id="employeeAddress"
              value={employeeAddress}
              onChange={(e) => setEmployeeAddress(e.target.value)}
              placeholder="Full address"
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="jobTitle" className={labelClass}>
              Job Title
            </label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="department" className={labelClass}>
              Department{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="department"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Engineering"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              {employmentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="salary" className={labelClass}>
              Salary
            </label>
            <input
              id="salary"
              type="number"
              value={salary}
              onChange={(e) =>
                setSalary(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="e.g. 50000"
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
              {payFrequencies.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="workingHours" className={labelClass}>
            Working Hours
          </label>
          <input
            id="workingHours"
            type="text"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
            placeholder="e.g. 40 hours per week"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="probationPeriod" className={labelClass}>
              Probation Period
            </label>
            <select
              id="probationPeriod"
              value={probationPeriod}
              onChange={(e) => setProbationPeriod(e.target.value)}
              className={inputClass}
            >
              {probationPeriods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="noticePeriod" className={labelClass}>
              Notice Period
            </label>
            <select
              id="noticePeriod"
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              className={inputClass}
            >
              {noticePeriods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="benefits" className={labelClass}>
            Benefits{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="benefits"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="e.g. Health insurance, 25 days annual leave, pension..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={confidentialityClause}
              onChange={(e) => setConfidentialityClause(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Confidentiality Clause
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={nonCompeteClause}
              onChange={(e) => setNonCompeteClause(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Non-Compete Clause
          </label>
        </div>

        <div>
          <label htmlFor="governingLaw" className={labelClass}>
            Governing Law
          </label>
          <input
            id="governingLaw"
            type="text"
            value={governingLaw}
            onChange={(e) => setGoverningLaw(e.target.value)}
            placeholder="e.g. England and Wales"
            className={inputClass}
          />
        </div>

        <DownloadButton
          onClick={handleDownload}
          disabled={!isValid}
          label="Download Employment Contract"
        />
      </div>
    </ToolShell>
  );
}
