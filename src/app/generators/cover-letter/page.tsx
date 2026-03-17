"use client";

import { useState, useRef, useEffect } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DocumentPreview from "@/components/DocumentPreview";
import { useDocumentFlow } from "@/hooks/useDocumentFlow";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import {
  generateCoverLetter,
  generateCoverLetterText,
  generateCoverLetterParagraphs,
  CoverLetterData,
  CoverLetterStyle,
} from "@/lib/generators/cover-letter";
import { generateAIDocx } from "@/lib/generators/ai-docx";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const STYLE_OPTIONS: {
  value: CoverLetterStyle;
  label: string;
  description: string;
}[] = [
  {
    value: "Professional",
    label: "Professional",
    description: "Formal corporate tone, ideal for traditional industries",
  },
  {
    value: "Enthusiastic",
    label: "Enthusiastic",
    description: "Energetic and passionate, great for startups and creative roles",
  },
  {
    value: "Concise",
    label: "Concise",
    description: "Short and direct, perfect for technical or senior positions",
  },
];

const inputClass =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

function RequiredLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children} <span className="text-red-500">*</span>
    </label>
  );
}

function OptionalLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
    </label>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 mt-2">
      {children}
    </h3>
  );
}

export default function CoverLetterPage() {
  const seoData = getToolSeoContent("cover-letter");
  const relatedTools = getRelatedTools("cover-letter");
  const { isEditing, isPreviewing, showPreview, goBackToEdit } = useDocumentFlow();
  const { aiContent, isGenerating, error: aiError, generate, clearAI } = useAIGeneration();

  const [formData, setFormData] = useState<CoverLetterData>({
    yourName: "",
    yourEmail: "",
    yourPhone: "",
    location: "",
    linkedin: "",
    recipientName: "",
    recipientTitle: "",
    companyName: "",
    companyAddress: "",
    jobTitle: "",
    yearsExperience: "",
    keySkills: "",
    whyInterested: "",
    closingStatement: "",
    style: "Professional",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValid =
    formData.yourName.trim() &&
    formData.companyName.trim() &&
    formData.jobTitle.trim() &&
    formData.yearsExperience.trim();

  // Track whether we attempted AI generation, so we can auto-fallback on 503
  const [aiAttempted, setAiAttempted] = useState(false);
  const wasGenerating = useRef(false);

  // When generation finishes (isGenerating transitions false) with no content and no error,
  // it means 503 / AI not configured — silently fall back to template preview.
  useEffect(() => {
    if (wasGenerating.current && !isGenerating && aiAttempted) {
      if (aiContent) {
        // AI succeeded — show preview (already handled in handleGenerate)
      } else if (!aiError) {
        // 503 / not configured — fall back to template
        clearAI();
        showPreview();
      }
      // If aiError is set, user stays on form and sees error + fallback button
      setAiAttempted(false);
    }
    wasGenerating.current = isGenerating;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating]);

  const handleGenerate = async () => {
    setAiAttempted(true);
    const result = await generate("cover-letter", formData as unknown as Record<string, unknown>);
    if (result) {
      // AI content returned — show preview with AI content
      showPreview();
    }
    // If null, the useEffect above handles fallback vs error display
  };

  const handleTemplateFallback = () => {
    clearAI();
    showPreview();
  };

  const handleDownload = async () => {
    const company = slugify(formData.companyName) || "company";
    const job = slugify(formData.jobTitle) || "position";

    if (aiContent) {
      const senderBlock: string[] = [formData.yourName];
      if (formData.yourEmail.trim()) senderBlock.push(formData.yourEmail.trim());
      if (formData.yourPhone.trim()) senderBlock.push(formData.yourPhone.trim());
      if (formData.location.trim()) senderBlock.push(formData.location.trim());

      const recipientBlock: string[] = [];
      if (formData.recipientName.trim()) recipientBlock.push(formData.recipientName.trim());
      if (formData.recipientTitle.trim()) recipientBlock.push(formData.recipientTitle.trim());
      if (formData.companyName.trim()) recipientBlock.push(formData.companyName.trim());
      if (formData.companyAddress.trim()) {
        formData.companyAddress.trim().split("\n").forEach((l) => recipientBlock.push(l));
      }

      const blob = await generateAIDocx({
        content: aiContent,
        senderBlock,
        recipientBlock,
        date: today,
        salutation: `Dear ${salutationName},`,
        signOff: previewText.signOff,
        signatureName: formData.yourName,
      });
      saveAs(blob, `cover-letter-${company}-${job}.docx`);
    } else {
      const blob = await generateCoverLetter(formData);
      saveAs(blob, `cover-letter-${company}-${job}.docx`);
    }
  };

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const contactParts: string[] = [];
  if (formData.yourEmail.trim()) contactParts.push(formData.yourEmail.trim());
  if (formData.yourPhone.trim()) contactParts.push(formData.yourPhone.trim());
  if (formData.location.trim()) contactParts.push(formData.location.trim());
  if (formData.linkedin.trim()) contactParts.push(formData.linkedin.trim());

  const salutationName = formData.recipientName.trim() || "Hiring Manager";
  const previewText = generateCoverLetterText(formData);

  return (
    <ToolShell
      title="Cover Letter Generator"
      description="Create a professional cover letter in seconds. Free online tool, download as Word document."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      {isEditing && (
        <div className="space-y-5">
          {/* -- Style Selector -- */}
          <SectionHeading>Letter Style</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, style: opt.value })
                }
                className={`text-left rounded-lg border-2 p-3 transition-all ${
                  formData.style === opt.value
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="block text-sm font-semibold text-gray-900">
                  {opt.label}
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  {opt.description}
                </span>
              </button>
            ))}
          </div>

          {/* -- Your Details -- */}
          <SectionHeading>Your Details</SectionHeading>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <RequiredLabel htmlFor="yourName">Your Full Name</RequiredLabel>
              <input
                type="text"
                id="yourName"
                name="yourName"
                value={formData.yourName}
                onChange={handleChange}
                placeholder="e.g., Jane Smith"
                className={inputClass}
              />
            </div>
            <div>
              <OptionalLabel htmlFor="yourEmail">Email</OptionalLabel>
              <input
                type="email"
                id="yourEmail"
                name="yourEmail"
                value={formData.yourEmail}
                onChange={handleChange}
                placeholder="e.g., jane.smith@email.com"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <OptionalLabel htmlFor="yourPhone">Phone</OptionalLabel>
              <input
                type="text"
                id="yourPhone"
                name="yourPhone"
                value={formData.yourPhone}
                onChange={handleChange}
                placeholder="e.g., +44 7700 900000"
                className={inputClass}
              />
            </div>
            <div>
              <OptionalLabel htmlFor="location">Location</OptionalLabel>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., London, UK"
                className={inputClass}
              />
            </div>
            <div>
              <OptionalLabel htmlFor="linkedin">LinkedIn</OptionalLabel>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="e.g., linkedin.com/in/janesmith"
                className={inputClass}
              />
            </div>
          </div>

          {/* -- Recipient Details -- */}
          <SectionHeading>Recipient Details</SectionHeading>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <OptionalLabel htmlFor="recipientName">
                Recipient&apos;s Name
              </OptionalLabel>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="e.g., John Williams (or leave blank for &quot;Hiring Manager&quot;)"
                className={inputClass}
              />
            </div>
            <div>
              <OptionalLabel htmlFor="recipientTitle">
                Recipient&apos;s Title
              </OptionalLabel>
              <input
                type="text"
                id="recipientTitle"
                name="recipientTitle"
                value={formData.recipientTitle}
                onChange={handleChange}
                placeholder="e.g., Head of Engineering"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <RequiredLabel htmlFor="companyName">Company Name</RequiredLabel>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Acme Corp"
                className={inputClass}
              />
            </div>
            <div>
              <OptionalLabel htmlFor="companyAddress">
                Company Address
              </OptionalLabel>
              <textarea
                id="companyAddress"
                name="companyAddress"
                rows={2}
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="e.g., 100 Main Street&#10;London EC1A 1BB"
                className={inputClass}
              />
            </div>
          </div>

          {/* -- Job Details -- */}
          <SectionHeading>Job Details</SectionHeading>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <RequiredLabel htmlFor="jobTitle">Job Title</RequiredLabel>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g., Senior Project Manager"
                className={inputClass}
              />
            </div>
            <div>
              <RequiredLabel htmlFor="yearsExperience">
                Years of Experience
              </RequiredLabel>
              <input
                type="text"
                id="yearsExperience"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleChange}
                placeholder="e.g., 5"
                className={inputClass}
              />
            </div>
          </div>

          {/* -- Letter Content -- */}
          <SectionHeading>Letter Content</SectionHeading>

          <div>
            <OptionalLabel htmlFor="keySkills">
              Key Skills &amp; Experience
            </OptionalLabel>
            <p className="text-xs text-gray-400 mb-1">
              List skills separated by commas for natural formatting, or write
              freeform text.
            </p>
            <textarea
              id="keySkills"
              name="keySkills"
              rows={4}
              value={formData.keySkills}
              onChange={handleChange}
              placeholder="e.g., project management, PMP certified, team leadership, enterprise SaaS migrations"
              className={inputClass}
            />
          </div>

          <div>
            <OptionalLabel htmlFor="whyInterested">
              Why You&apos;re Interested
            </OptionalLabel>
            <p className="text-xs text-gray-400 mb-1">
              What excites you about this company or role? We&apos;ll frame it
              naturally.
            </p>
            <textarea
              id="whyInterested"
              name="whyInterested"
              rows={4}
              value={formData.whyInterested}
              onChange={handleChange}
              placeholder="e.g., your innovative approach to sustainability, the chance to work on cutting-edge products, and the collaborative team culture..."
              className={inputClass}
            />
          </div>

          <div>
            <OptionalLabel htmlFor="closingStatement">
              Custom Closing Statement
            </OptionalLabel>
            <p className="text-xs text-gray-400 mb-1">
              Leave blank for an auto-generated closing that matches your chosen
              style.
            </p>
            <textarea
              id="closingStatement"
              name="closingStatement"
              rows={3}
              value={formData.closingStatement}
              onChange={handleChange}
              placeholder="Leave blank for a style-appropriate closing, or write your own..."
              className={inputClass}
            />
          </div>

          {/* -- Generate Button -- */}
          <button
            onClick={handleGenerate}
            disabled={!isValid || isGenerating}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
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
              "Generate Cover Letter"
            )}
          </button>

          {aiError && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">{aiError}</p>
              <button
                onClick={handleTemplateFallback}
                disabled={!isValid}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
              >
                Generate with Template
              </button>
            </div>
          )}
        </div>
      )}

      {isPreviewing && (
        <DocumentPreview
          documentTitle="Cover Letter Preview"
          onDownload={handleDownload}
          onEdit={goBackToEdit}
        >
          <div className="font-serif text-sm text-gray-800 leading-relaxed">
            {/* Sender block */}
            <div className="mb-1">
              <p className="text-lg font-bold mb-0.5">
                {formData.yourName || "Your Name"}
              </p>
              {contactParts.length > 0 && (
                <p className="text-xs text-gray-500 mb-4">
                  {contactParts.join("  |  ")}
                </p>
              )}
            </div>

            {/* Date */}
            <p className="mb-4">{today}</p>

            {/* Recipient block */}
            <div className="mb-6">
              {formData.recipientName.trim() && (
                <p>{formData.recipientName}</p>
              )}
              {formData.recipientTitle.trim() && (
                <p>{formData.recipientTitle}</p>
              )}
              {formData.companyName.trim() && (
                <p>{formData.companyName}</p>
              )}
              {formData.companyAddress.trim() && (
                <p className="whitespace-pre-line">
                  {formData.companyAddress}
                </p>
              )}
            </div>

            {/* Salutation */}
            <p className="mb-4">Dear {salutationName},</p>

            {/* Body paragraphs */}
            {aiContent
              ? aiContent
                  .split(/\n\n+/)
                  .filter(Boolean)
                  .map((p, i) => (
                    <p key={i} className="mb-4">
                      {p}
                    </p>
                  ))
              : generateCoverLetterParagraphs(formData).map((p, i) => (
                  <p key={i} className="mb-4">
                    {p}
                  </p>
                ))}

            {/* Sign-off */}
            <p className="mb-1">{previewText.signOff}</p>
            <p className="font-bold mt-6">{formData.yourName}</p>
          </div>
        </DocumentPreview>
      )}
    </ToolShell>
  );
}
