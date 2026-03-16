"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import { generateJobDescription, JobDescriptionData } from "@/lib/generators/job-description";
import { saveAs } from "file-saver";

const employmentTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function JobDescriptionPage() {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobSummary, setJobSummary] = useState("");
  const [keyResponsibilities, setKeyResponsibilities] = useState("");
  const [requiredQualifications, setRequiredQualifications] = useState("");
  const [preferredQualifications, setPreferredQualifications] = useState("");
  const [benefits, setBenefits] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [howToApply, setHowToApply] = useState("");

  const isValid =
    companyName && jobTitle && department && location && jobSummary &&
    keyResponsibilities && requiredQualifications && howToApply;

  const handleDownload = async () => {
    const data: JobDescriptionData = {
      companyName, jobTitle, department, location, employmentType, salaryRange,
      jobSummary, keyResponsibilities, requiredQualifications,
      preferredQualifications, benefits, applicationDeadline, howToApply,
    };
    const blob = await generateJobDescription(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `job-description-${slugify(jobTitle)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Job Description Generator"
      description="Create a professional job description in seconds. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyName" className={labelClass}>Company Name</label>
            <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" className={inputClass} />
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
            <label htmlFor="location" className={labelClass}>Location</label>
            <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="London, UK (Remote)" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employmentType" className={labelClass}>Employment Type</label>
            <select id="employmentType" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className={inputClass}>
              {employmentTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="salaryRange" className={labelClass}>Salary Range <span className="text-gray-400 font-normal">(optional)</span></label>
            <input id="salaryRange" type="text" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} placeholder="$80,000 - $120,000" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="jobSummary" className={labelClass}>Job Summary</label>
          <textarea id="jobSummary" value={jobSummary} onChange={(e) => setJobSummary(e.target.value)} placeholder="Brief overview of the role and its purpose..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="keyResponsibilities" className={labelClass}>Key Responsibilities <span className="text-gray-400 font-normal">(one per line)</span></label>
          <textarea id="keyResponsibilities" value={keyResponsibilities} onChange={(e) => setKeyResponsibilities(e.target.value)} placeholder="Design and develop software solutions&#10;Collaborate with cross-functional teams&#10;Write clean, maintainable code" rows={5} className={inputClass} />
        </div>

        <div>
          <label htmlFor="requiredQualifications" className={labelClass}>Required Qualifications <span className="text-gray-400 font-normal">(one per line)</span></label>
          <textarea id="requiredQualifications" value={requiredQualifications} onChange={(e) => setRequiredQualifications(e.target.value)} placeholder="Bachelor's degree in Computer Science&#10;3+ years of experience&#10;Proficiency in TypeScript" rows={5} className={inputClass} />
        </div>

        <div>
          <label htmlFor="preferredQualifications" className={labelClass}>Preferred Qualifications <span className="text-gray-400 font-normal">(one per line, optional)</span></label>
          <textarea id="preferredQualifications" value={preferredQualifications} onChange={(e) => setPreferredQualifications(e.target.value)} placeholder="Experience with cloud platforms&#10;Knowledge of CI/CD pipelines" rows={4} className={inputClass} />
        </div>

        <div>
          <label htmlFor="benefits" className={labelClass}>Benefits <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea id="benefits" value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="Health insurance, 401k matching, flexible hours..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="applicationDeadline" className={labelClass}>Application Deadline <span className="text-gray-400 font-normal">(optional)</span></label>
          <input id="applicationDeadline" type="date" value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="howToApply" className={labelClass}>How to Apply</label>
          <textarea id="howToApply" value={howToApply} onChange={(e) => setHowToApply(e.target.value)} placeholder="Send your CV and cover letter to careers@acme.com..." rows={3} className={inputClass} />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Job Description" />
      </div>
    </ToolShell>
  );
}
