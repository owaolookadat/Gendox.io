"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generatePerformanceReview,
  PerformanceReviewData,
} from "@/lib/generators/performance-review";
import { saveAs } from "file-saver";

const ratingOptions = [
  "1 - Needs Improvement",
  "2 - Below Expectations",
  "3 - Meets Expectations",
  "4 - Exceeds Expectations",
  "5 - Outstanding",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PerformanceReviewPage() {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeTitle, setEmployeeTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewPeriodStart, setReviewPeriodStart] = useState("");
  const [reviewPeriodEnd, setReviewPeriodEnd] = useState("");
  const [overallRating, setOverallRating] = useState("3 - Meets Expectations");
  const [keyAchievements, setKeyAchievements] = useState("");
  const [areasForImprovement, setAreasForImprovement] = useState("");
  const [goalsForNextPeriod, setGoalsForNextPeriod] = useState("");
  const [skillsAssessment, setSkillsAssessment] = useState("");
  const [trainingNeeds, setTrainingNeeds] = useState("");
  const [managerComments, setManagerComments] = useState("");
  const [employeeComments, setEmployeeComments] = useState("");

  const isValid =
    employeeName &&
    employeeTitle &&
    department &&
    reviewerName &&
    reviewPeriodStart &&
    reviewPeriodEnd &&
    keyAchievements &&
    areasForImprovement &&
    goalsForNextPeriod &&
    managerComments;

  const handleDownload = async () => {
    const data: PerformanceReviewData = {
      employeeName, employeeTitle, department, reviewerName,
      reviewPeriodStart, reviewPeriodEnd, overallRating, keyAchievements,
      areasForImprovement, goalsForNextPeriod, skillsAssessment,
      trainingNeeds, managerComments, employeeComments,
    };
    const blob = await generatePerformanceReview(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `performance-review-${slugify(employeeName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Performance Review Generator"
      description="Create a professional performance review document in seconds. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employeeName" className={labelClass}>Employee Name</label>
            <input id="employeeName" type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
          </div>
          <div>
            <label htmlFor="employeeTitle" className={labelClass}>Employee Title</label>
            <input id="employeeTitle" type="text" value={employeeTitle} onChange={(e) => setEmployeeTitle(e.target.value)} placeholder="Software Engineer" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="department" className={labelClass}>Department</label>
            <input id="department" type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering" className={inputClass} />
          </div>
          <div>
            <label htmlFor="reviewerName" className={labelClass}>Manager / Reviewer Name</label>
            <input id="reviewerName" type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} placeholder="John Smith" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reviewPeriodStart" className={labelClass}>Review Period Start</label>
            <input id="reviewPeriodStart" type="date" value={reviewPeriodStart} onChange={(e) => setReviewPeriodStart(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="reviewPeriodEnd" className={labelClass}>Review Period End</label>
            <input id="reviewPeriodEnd" type="date" value={reviewPeriodEnd} onChange={(e) => setReviewPeriodEnd(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="overallRating" className={labelClass}>Overall Rating</label>
          <select id="overallRating" value={overallRating} onChange={(e) => setOverallRating(e.target.value)} className={inputClass}>
            {ratingOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="keyAchievements" className={labelClass}>Key Achievements</label>
          <textarea id="keyAchievements" value={keyAchievements} onChange={(e) => setKeyAchievements(e.target.value)} placeholder="List key achievements during the review period..." rows={4} className={inputClass} />
        </div>

        <div>
          <label htmlFor="areasForImprovement" className={labelClass}>Areas for Improvement</label>
          <textarea id="areasForImprovement" value={areasForImprovement} onChange={(e) => setAreasForImprovement(e.target.value)} placeholder="Areas where improvement is needed..." rows={4} className={inputClass} />
        </div>

        <div>
          <label htmlFor="goalsForNextPeriod" className={labelClass}>Goals for Next Period</label>
          <textarea id="goalsForNextPeriod" value={goalsForNextPeriod} onChange={(e) => setGoalsForNextPeriod(e.target.value)} placeholder="Goals and objectives for the next review period..." rows={4} className={inputClass} />
        </div>

        <div>
          <label htmlFor="skillsAssessment" className={labelClass}>
            Skills Assessment <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea id="skillsAssessment" value={skillsAssessment} onChange={(e) => setSkillsAssessment(e.target.value)} placeholder="Assessment of technical and soft skills..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="trainingNeeds" className={labelClass}>
            Training Needs <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea id="trainingNeeds" value={trainingNeeds} onChange={(e) => setTrainingNeeds(e.target.value)} placeholder="Recommended training or development..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="managerComments" className={labelClass}>Manager Comments</label>
          <textarea id="managerComments" value={managerComments} onChange={(e) => setManagerComments(e.target.value)} placeholder="Manager's overall comments..." rows={4} className={inputClass} />
        </div>

        <div>
          <label htmlFor="employeeComments" className={labelClass}>
            Employee Comments <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea id="employeeComments" value={employeeComments} onChange={(e) => setEmployeeComments(e.target.value)} placeholder="Employee's response or comments..." rows={3} className={inputClass} />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Performance Review" />
      </div>
    </ToolShell>
  );
}
