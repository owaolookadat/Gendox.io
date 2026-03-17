"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DocumentPreview from "@/components/DocumentPreview";
import { useDocumentFlow } from "@/hooks/useDocumentFlow";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import {
  generateReferenceLetter,
  ReferenceLetterData,
} from "@/lib/generators/reference-letter";
import { generateAIDocx } from "@/lib/generators/ai-docx";
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
  const { isEditing, isPreviewing, showPreview, goBackToEdit } = useDocumentFlow();
  const { aiContent, isGenerating, error: aiError, generate, clearAI } = useAIGeneration();

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

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleGenerate = async () => {
    await generate("reference-letter", {
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
    });
    showPreview();
  };

  const handleTemplateGenerate = () => {
    clearAI();
    showPreview();
  };

  const handleDownload = async () => {
    const todayISO = new Date().toISOString().split("T")[0];
    const filename = `reference-letter-${slugify(candidateName)}-${todayISO}.docx`;

    if (aiContent) {
      const blob = await generateAIDocx({
        senderBlock: [referrerName, referrerTitle, referrerCompany, referrerEmail],
        date: today,
        salutation: "To Whom It May Concern,",
        content: aiContent,
        signOff: "Sincerely,",
        signatureName: referrerName,
        signatureTitle: referrerTitle,
        signatureOrg: referrerCompany,
        signatureEmail: referrerEmail,
      });
      saveAs(blob, filename);
    } else {
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
      saveAs(blob, filename);
    }
  };

  // Template fallback paragraphs when AI returns null
  const templateParagraphs = [
    `I am writing to recommend ${candidateName || "[Candidate Name]"} for ${candidateRole ? `the position of ${candidateRole}` : "any suitable position"}. I have had the pleasure of working with ${candidateName || "[Candidate Name]"} for ${relationshipDuration} at ${referrerCompany || "[Company]"}.`,
    skills
      ? `During this time, ${candidateName || "[Candidate Name]"} has demonstrated exceptional skills in ${skills}.`
      : `During this time, ${candidateName || "[Candidate Name]"} has consistently demonstrated strong professional capabilities.`,
    achievements
      ? `Among ${candidateName || "[Candidate Name]"}'s notable achievements: ${achievements}.`
      : null,
    personalQualities
      ? `On a personal level, ${candidateName || "[Candidate Name]"} is ${personalQualities}.`
      : null,
    recommendation
      ? recommendation
      : `I wholeheartedly recommend ${candidateName || "[Candidate Name]"} and am confident they will be an excellent addition to any team. Please do not hesitate to contact me if you require any further information.`,
  ].filter(Boolean) as string[];

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
      {isEditing && (
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
              "Generate Reference Letter"
            )}
          </button>

          {/* AI Error */}
          {aiError && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">{aiError}</p>
              <button
                onClick={handleTemplateGenerate}
                disabled={!isValid}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Generate with Template
              </button>
            </div>
          )}
        </div>
      )}

      {isPreviewing && (
        <DocumentPreview
          documentTitle="Reference Letter Preview"
          onDownload={handleDownload}
          onEdit={() => {
            goBackToEdit();
            clearAI();
          }}
        >
          <div className="font-serif text-sm text-gray-800 leading-relaxed">
            {/* Sender block */}
            <div className="mb-6">
              <p className="font-semibold">{referrerName || "[Referrer Name]"}</p>
              <p className="text-gray-500 text-xs">{referrerTitle || "[Title]"}</p>
              <p className="text-gray-500 text-xs">{referrerCompany || "[Company]"}</p>
              <p className="text-gray-500 text-xs">{referrerEmail || "[Email]"}</p>
            </div>

            {/* Date */}
            <p className="mb-4">{today}</p>

            {/* Salutation */}
            <p className="mb-4">To Whom It May Concern,</p>

            {/* Body */}
            {aiContent ? (
              aiContent
                .split(/\n\n+/)
                .filter((p) => p.trim())
                .map((p, i) => (
                  <p key={i} className="mb-4">
                    {p.trim()}
                  </p>
                ))
            ) : (
              templateParagraphs.map((p, i) => (
                <p key={i} className="mb-4">
                  {p}
                </p>
              ))
            )}

            {/* Sign-off and signature */}
            <p className="mb-1">Sincerely,</p>
            <div className="mt-8">
              <p className="font-semibold">{referrerName || "[Referrer Name]"}</p>
              <p className="text-gray-600 text-xs">{referrerTitle || "[Title]"}</p>
              <p className="text-gray-600 text-xs">{referrerCompany || "[Company]"}</p>
              <p className="text-blue-600 text-xs">{referrerEmail || "[Email]"}</p>
            </div>
          </div>
        </DocumentPreview>
      )}
    </ToolShell>
  );
}
