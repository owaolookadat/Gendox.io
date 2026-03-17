"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateRecommendationLetter,
  RecommendationLetterData,
} from "@/lib/generators/recommendation-letter";
import { saveAs } from "file-saver";

const contexts = ["Academic", "Professional", "Personal", "Volunteer"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function RecommendationLetterPage() {
  const seoData = getToolSeoContent("recommendation-letter");
  const relatedTools = getRelatedTools("recommendation-letter");
  const [yourName, setYourName] = useState("");
  const [yourTitle, setYourTitle] = useState("");
  const [yourOrganization, setYourOrganization] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateRole, setCandidateRole] = useState("");
  const [howLongKnown, setHowLongKnown] = useState("");
  const [context, setContext] = useState("Professional");
  const [keyStrengths, setKeyStrengths] = useState("");
  const [specificExamples, setSpecificExamples] = useState("");
  const [closingRecommendation, setClosingRecommendation] = useState(
    "I recommend them without reservation."
  );

  const isValid =
    yourName &&
    yourTitle &&
    yourOrganization &&
    candidateName &&
    candidateRole &&
    howLongKnown;

  const handleDownload = async () => {
    const data: RecommendationLetterData = {
      yourName,
      yourTitle,
      yourOrganization,
      candidateName,
      candidateRole,
      howLongKnown,
      context,
      keyStrengths,
      specificExamples,
      closingRecommendation,
    };

    const blob = await generateRecommendationLetter(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `recommendation-letter-${slugify(candidateName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Recommendation Letter Generator"
      description="Generate a professional recommendation letter in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="yourName" className={labelClass}>
              Your Name
            </label>
            <input
              id="yourName"
              type="text"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="John Smith"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="yourTitle" className={labelClass}>
              Your Title
            </label>
            <input
              id="yourTitle"
              type="text"
              value={yourTitle}
              onChange={(e) => setYourTitle(e.target.value)}
              placeholder="Professor / Director"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="yourOrganization" className={labelClass}>
            Your Organization
          </label>
          <input
            id="yourOrganization"
            type="text"
            value={yourOrganization}
            onChange={(e) => setYourOrganization(e.target.value)}
            placeholder="University of Oxford"
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
            <label htmlFor="candidateRole" className={labelClass}>
              Candidate&apos;s Role
            </label>
            <input
              id="candidateRole"
              type="text"
              value={candidateRole}
              onChange={(e) => setCandidateRole(e.target.value)}
              placeholder="Research Assistant"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="howLongKnown" className={labelClass}>
              How Long Known
            </label>
            <input
              id="howLongKnown"
              type="text"
              value={howLongKnown}
              onChange={(e) => setHowLongKnown(e.target.value)}
              placeholder="3 years"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="context" className={labelClass}>
              Context
            </label>
            <select
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className={inputClass}
            >
              {contexts.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="keyStrengths" className={labelClass}>
            Key Strengths
          </label>
          <textarea
            id="keyStrengths"
            value={keyStrengths}
            onChange={(e) => setKeyStrengths(e.target.value)}
            placeholder="Describe the candidate's key strengths..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="specificExamples" className={labelClass}>
            Specific Examples
          </label>
          <textarea
            id="specificExamples"
            value={specificExamples}
            onChange={(e) => setSpecificExamples(e.target.value)}
            placeholder="Provide specific examples of their work or achievements..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="closingRecommendation" className={labelClass}>
            Closing Recommendation{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="closingRecommendation"
            value={closingRecommendation}
            onChange={(e) => setClosingRecommendation(e.target.value)}
            placeholder="I recommend them without reservation."
            rows={2}
            className={inputClass}
          />
        </div>

        <DownloadButton
          onClick={handleDownload}
          disabled={!isValid}
          label="Download Recommendation Letter"
        />
      </div>
    </ToolShell>
  );
}
