"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DocumentPreview from "@/components/DocumentPreview";
import { useDocumentFlow } from "@/hooks/useDocumentFlow";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import {
  generateRecommendationLetter,
  RecommendationLetterData,
} from "@/lib/generators/recommendation-letter";
import { generateAIDocx } from "@/lib/generators/ai-docx";
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
  const { isEditing, isPreviewing, showPreview, goBackToEdit } = useDocumentFlow();
  const { aiContent, isGenerating, error: aiError, generate, clearAI } = useAIGeneration();

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

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formData: RecommendationLetterData = {
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

  const handleGenerate = async () => {
    await generate("recommendation-letter", {
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
    });
    showPreview();
  };

  const handleTemplateFallback = () => {
    clearAI();
    showPreview();
  };

  const handleEdit = () => {
    clearAI();
    goBackToEdit();
  };

  const handleDownload = async () => {
    const todayISO = new Date().toISOString().split("T")[0];
    const filename = `recommendation-letter-${slugify(candidateName)}-${todayISO}.docx`;

    if (aiContent) {
      const blob = await generateAIDocx({
        content: aiContent,
        date: today,
        senderBlock: [yourName, yourTitle, yourOrganization],
        salutation: "To Whom It May Concern,",
        signOff: "Sincerely,",
        signatureName: yourName,
        signatureTitle: yourTitle,
        signatureOrg: yourOrganization,
      });
      saveAs(blob, filename);
    } else {
      const blob = await generateRecommendationLetter(formData);
      saveAs(blob, filename);
    }
  };

  // Template-based preview paragraphs (fallback when AI is not available)
  const templateParagraphs = [
    `I am writing to recommend ${candidateName || "[Candidate Name]"} for ${candidateRole || "[Role]"}. I have known ${candidateName || "them"} for ${howLongKnown || "[duration]"} in a ${context.toLowerCase()} capacity.`,
    keyStrengths
      ? `${candidateName || "The candidate"} demonstrates exceptional strengths including: ${keyStrengths}.`
      : null,
    specificExamples
      ? `To illustrate, ${specificExamples}`
      : null,
    closingRecommendation || "I recommend them without reservation.",
  ].filter(Boolean) as string[];

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
      {isEditing && (
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

          {aiError && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">{aiError}</p>
              <button
                onClick={handleTemplateFallback}
                disabled={!isValid}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
              >
                Generate with Template
              </button>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!isValid || isGenerating}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              "Generate Recommendation Letter"
            )}
          </button>
        </div>
      )}

      {isPreviewing && (
        <DocumentPreview
          documentTitle="Recommendation Letter Preview"
          onEdit={handleEdit}
          onDownload={handleDownload}
        >
          <div className="font-serif text-sm text-gray-800 leading-relaxed">
            {/* Sender block */}
            <div className="mb-6">
              <p className="font-semibold">{yourName || "[Your Name]"}</p>
              {yourTitle && <p className="text-gray-500 text-xs">{yourTitle}</p>}
              {yourOrganization && (
                <p className="text-gray-500 text-xs">{yourOrganization}</p>
              )}
            </div>

            {/* Date */}
            <p className="mb-4">{today}</p>

            {/* Salutation */}
            <p className="mb-4">To Whom It May Concern,</p>

            {/* Body */}
            {aiContent
              ? aiContent
                  .split("\n\n")
                  .filter((p) => p.trim())
                  .map((paragraph, i) => (
                    <p key={i} className="mb-4">
                      {paragraph.trim()}
                    </p>
                  ))
              : templateParagraphs.map((paragraph, i) => (
                  <p key={i} className="mb-4">
                    {paragraph}
                  </p>
                ))}

            {/* Signature block */}
            <p className="mb-1 mt-8">Sincerely,</p>
            <p className="font-semibold mt-6">{yourName || "[Your Name]"}</p>
            {yourTitle && <p>{yourTitle}</p>}
            {yourOrganization && <p>{yourOrganization}</p>}
          </div>
        </DocumentPreview>
      )}
    </ToolShell>
  );
}
