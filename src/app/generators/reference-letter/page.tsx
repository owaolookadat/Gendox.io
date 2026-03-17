"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateReferenceLetter,
  ReferenceLetterData,
} from "@/lib/generators/reference-letter";
import { saveAs } from "file-saver";

const durations = ["6 months", "1 year", "2 years", "3+ years", "5+ years"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ReferenceLetterPage() {
  const seoData = getToolSeoContent("reference-letter");
  const relatedTools = getRelatedTools("reference-letter");
  const [referrerName, setReferrerName] = useState("");
  const [referrerTitle, setReferrerTitle] = useState("");
  const [referrerCompany, setReferrerCompany] = useState("");
  const [referrerEmail, setReferrerEmail] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateRole, setCandidateRole] = useState("");
  const [relationshipDuration, setRelationshipDuration] = useState("1 year");
  const [skills, setSkills] = useState("");
  const [achievements, setAchievements] = useState("");
  const [personalQualities, setPersonalQualities] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const isValid =
    referrerName &&
    referrerTitle &&
    referrerCompany &&
    referrerEmail &&
    candidateName &&
    candidateRole;

  const handleDownload = async () => {
    const data: ReferenceLetterData = {
      referrerName,
      referrerTitle,
      referrerCompany,
      referrerEmail,
      candidateName,
      candidateRole,
      relationshipDuration,
      skills,
      achievements,
      personalQualities,
      recommendation,
    };

    const blob = await generateReferenceLetter(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `reference-letter-${slugify(candidateName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Reference Letter Generator"
      description="Generate a professional reference letter in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        {/* Referrer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="referrerName" className={labelClass}>
              Referrer Name
            </label>
            <input
              id="referrerName"
              type="text"
              value={referrerName}
              onChange={(e) => setReferrerName(e.target.value)}
              placeholder="John Smith"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="referrerTitle" className={labelClass}>
              Referrer Title
            </label>
            <input
              id="referrerTitle"
              type="text"
              value={referrerTitle}
              onChange={(e) => setReferrerTitle(e.target.value)}
              placeholder="Senior Manager"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="referrerCompany" className={labelClass}>
              Referrer Company
            </label>
            <input
              id="referrerCompany"
              type="text"
              value={referrerCompany}
              onChange={(e) => setReferrerCompany(e.target.value)}
              placeholder="Acme Corp"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="referrerEmail" className={labelClass}>
              Referrer Email
            </label>
            <input
              id="referrerEmail"
              type="email"
              value={referrerEmail}
              onChange={(e) => setReferrerEmail(e.target.value)}
              placeholder="john@acme.com"
              className={inputClass}
            />
          </div>
        </div>

        {/* Candidate Info */}
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
              Candidate Role
            </label>
            <input
              id="candidateRole"
              type="text"
              value={candidateRole}
              onChange={(e) => setCandidateRole(e.target.value)}
              placeholder="Software Developer"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="relationshipDuration" className={labelClass}>
            Relationship Duration
          </label>
          <select
            id="relationshipDuration"
            value={relationshipDuration}
            onChange={(e) => setRelationshipDuration(e.target.value)}
            className={inputClass}
          >
            {durations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="skills" className={labelClass}>
            Key Skills
          </label>
          <textarea
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Describe the candidate's key skills..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="achievements" className={labelClass}>
            Achievements
          </label>
          <textarea
            id="achievements"
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
            placeholder="Describe notable achievements..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="personalQualities" className={labelClass}>
            Personal Qualities
          </label>
          <textarea
            id="personalQualities"
            value={personalQualities}
            onChange={(e) => setPersonalQualities(e.target.value)}
            placeholder="Describe personal qualities..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="recommendation" className={labelClass}>
            Recommendation Statement{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="recommendation"
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            placeholder="Custom recommendation statement..."
            rows={3}
            className={inputClass}
          />
        </div>

        <DownloadButton
          onClick={handleDownload}
          disabled={!isValid}
          label="Download Reference Letter"
        />
      </div>
    </ToolShell>
  );
}
