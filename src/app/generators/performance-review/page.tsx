"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DocumentPreview from "@/components/DocumentPreview";
import { useDocumentFlow } from "@/hooks/useDocumentFlow";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import {
  generatePerformanceReview,
  PerformanceReviewData,
} from "@/lib/generators/performance-review";
import { generateAIDocx } from "@/lib/generators/ai-docx";
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

function formatDateDisplay(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PerformanceReviewPage() {
  const seoData = getToolSeoContent("performance-review");
  const relatedTools = getRelatedTools("performance-review");
  const { isEditing, isPreviewing, showPreview, goBackToEdit } = useDocumentFlow();
  const { aiContent, isGenerating, error: aiError, generate, clearAI } = useAIGeneration();

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

  const handleGenerate = async () => {
    const result = await generate("performance-review", {
      employeeName,
      employeeTitle,
      department,
      reviewerName,
      reviewPeriodStart,
      reviewPeriodEnd,
      overallRating,
      keyAchievements,
      areasForImprovement,
      goalsForNextPeriod,
      skillsAssessment,
      trainingNeeds,
      managerComments,
      employeeComments,
    });
    if (result) {
      showPreview();
    } else if (!aiError) {
      clearAI();
      showPreview();
    }
  };

  const handleTemplateFallback = () => {
    clearAI();
    showPreview();
  };

  const handleDownload = async () => {
    const today = new Date().toISOString().split("T")[0];
    const filename = `performance-review-${slugify(employeeName)}-${today}.docx`;

    if (aiContent) {
      const senderBlock: string[] = [
        `Employee: ${employeeName}`,
        `Title: ${employeeTitle}`,
        `Department: ${department}`,
        `Reviewer: ${reviewerName}`,
        `Review Period: ${formatDateDisplay(reviewPeriodStart)} — ${formatDateDisplay(reviewPeriodEnd)}`,
        `Overall Rating: ${overallRating}`,
      ];

      const blob = await generateAIDocx({
        title: "PERFORMANCE REVIEW",
        content: aiContent,
        hasSections: true,
        senderBlock,
      });
      saveAs(blob, filename);
    } else {
      const data: PerformanceReviewData = {
        employeeName,
        employeeTitle,
        department,
        reviewerName,
        reviewPeriodStart,
        reviewPeriodEnd,
        overallRating,
        keyAchievements,
        areasForImprovement,
        goalsForNextPeriod,
        skillsAssessment,
        trainingNeeds,
        managerComments,
        employeeComments,
      };
      const blob = await generatePerformanceReview(data);
      saveAs(blob, filename);
    }
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Performance Review Generator"
      description="Create a professional performance review document in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
      aiPowered
    >
      {isEditing && (
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

          {/* Error display */}
          {aiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 mb-2">
                AI generation failed: {aiError}
              </p>
              <button
                onClick={handleTemplateFallback}
                disabled={!isValid}
                className="text-sm text-red-600 underline hover:text-red-800"
              >
                Use template version instead
              </button>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!isValid || isGenerating}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              "Generate Performance Review"
            )}
          </button>
        </div>
      )}

      {isPreviewing && (
        <DocumentPreview
          documentTitle="Performance Review Preview"
          onDownload={handleDownload}
          onEdit={goBackToEdit}
        >
          <div className="font-serif text-sm text-gray-800 leading-relaxed">
            {/* Header block with employee details */}
            <div className="mb-6 pb-4 border-b border-gray-300">
              <h3 className="text-lg font-bold text-center mb-4 tracking-wide">PERFORMANCE REVIEW</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <p><span className="font-semibold text-gray-600">Employee:</span> {employeeName}</p>
                <p><span className="font-semibold text-gray-600">Title:</span> {employeeTitle}</p>
                <p><span className="font-semibold text-gray-600">Department:</span> {department}</p>
                <p><span className="font-semibold text-gray-600">Reviewer:</span> {reviewerName}</p>
                <p>
                  <span className="font-semibold text-gray-600">Period:</span>{" "}
                  {formatDateDisplay(reviewPeriodStart)} — {formatDateDisplay(reviewPeriodEnd)}
                </p>
                <p><span className="font-semibold text-gray-600">Rating:</span> {overallRating}</p>
              </div>
            </div>

            {aiContent ? (
              /* AI-generated content with section heading detection */
              <div>
                {aiContent.split(/\n\n+/).map((block, i) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;

                  // Detect section headings: ALL CAPS followed by optional colon
                  const sectionMatch = trimmed.match(/^([A-Z][A-Z &/'-]+):?\s*([\s\S]*)$/);
                  if (sectionMatch) {
                    const heading = sectionMatch[1].trim().replace(/:$/, "");
                    const body = sectionMatch[2].trim();
                    return (
                      <div key={i} className="mb-4">
                        <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2 mt-4">
                          {heading}
                        </h4>
                        {body && <p className="mb-2">{body}</p>}
                      </div>
                    );
                  }

                  return (
                    <p key={i} className="mb-3">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            ) : (
              /* Template fallback: show raw form data in sections */
              <div>
                <div className="mb-4">
                  <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                    KEY ACHIEVEMENTS
                  </h4>
                  <p className="whitespace-pre-line">{keyAchievements}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                    AREAS FOR IMPROVEMENT
                  </h4>
                  <p className="whitespace-pre-line">{areasForImprovement}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                    GOALS FOR NEXT PERIOD
                  </h4>
                  <p className="whitespace-pre-line">{goalsForNextPeriod}</p>
                </div>

                {skillsAssessment && (
                  <div className="mb-4">
                    <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                      SKILLS ASSESSMENT
                    </h4>
                    <p className="whitespace-pre-line">{skillsAssessment}</p>
                  </div>
                )}

                {trainingNeeds && (
                  <div className="mb-4">
                    <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                      TRAINING NEEDS
                    </h4>
                    <p className="whitespace-pre-line">{trainingNeeds}</p>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                    MANAGER COMMENTS
                  </h4>
                  <p className="whitespace-pre-line">{managerComments}</p>
                </div>

                {employeeComments && (
                  <div className="mb-4">
                    <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                      EMPLOYEE COMMENTS
                    </h4>
                    <p className="whitespace-pre-line">{employeeComments}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DocumentPreview>
      )}
    </ToolShell>
  );
}
