"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateCoverLetter,
  generateCoverLetterText,
  CoverLetterData,
  CoverLetterStyle,
} from "@/lib/generators/cover-letter";
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
  icon: string;
}[] = [
  {
    value: "Professional",
    label: "Professional",
    description: "Formal corporate tone, ideal for traditional industries",
    icon: "briefcase",
  },
  {
    value: "Enthusiastic",
    label: "Enthusiastic",
    description: "Energetic and passionate, great for startups and creative roles",
    icon: "rocket",
  },
  {
    value: "Concise",
    label: "Concise",
    description: "Short and direct, perfect for technical or senior positions",
    icon: "bolt",
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

  const handleDownload = async () => {
    const blob = await generateCoverLetter(formData);
    const company = slugify(formData.companyName) || "company";
    const job = slugify(formData.jobTitle) || "position";
    saveAs(blob, `cover-letter-${company}-${job}.docx`);
  };

  // Build preview text
  const previewText = generateCoverLetterText(formData);
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

  return (
    <ToolShell
      title="Cover Letter Generator"
      description="Create a professional cover letter in seconds. Free online tool, download as Word document."
      category="Document Generator"
    >
      <div className="space-y-5">
        {/* ── Style Selector ── */}
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

        {/* ── Your Details ── */}
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

        {/* ── Recipient Details ── */}
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

        {/* ── Job Details ── */}
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

        {/* ── Letter Content ── */}
        <SectionHeading>Letter Content</SectionHeading>

        <div>
          <OptionalLabel htmlFor="keySkills">
            Key Skills &amp; Experience
          </OptionalLabel>
          <p className="text-xs text-gray-400 mb-1">
            Describe your relevant qualifications. This will be woven into a
            natural-sounding paragraph.
          </p>
          <textarea
            id="keySkills"
            name="keySkills"
            rows={4}
            value={formData.keySkills}
            onChange={handleChange}
            placeholder="e.g., 5+ years of project management experience, PMP certified, led teams of 10-20, delivered 3 enterprise SaaS migrations on time and under budget..."
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

        {/* ── Download Button ── */}
        <DownloadButton onClick={handleDownload} disabled={!isValid} />

        {/* ── Live Preview ── */}
        {isValid && (
          <div className="mt-8">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Live Preview
            </h3>
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-8 sm:p-10 font-serif text-gray-800 text-sm leading-relaxed max-w-none">
              {/* Name */}
              <p className="text-lg font-bold mb-0.5">
                {formData.yourName || "Your Name"}
              </p>

              {/* Contact line */}
              {contactParts.length > 0 && (
                <p className="text-xs text-gray-500 mb-4">
                  {contactParts.join("  |  ")}
                </p>
              )}

              {/* Date */}
              <p className="mb-4">{today}</p>

              {/* Recipient block */}
              {formData.recipientName.trim() && (
                <p className="mb-0">{formData.recipientName}</p>
              )}
              {formData.recipientTitle.trim() && (
                <p className="mb-0">{formData.recipientTitle}</p>
              )}
              {formData.companyName.trim() && (
                <p className="mb-0">{formData.companyName}</p>
              )}
              {formData.companyAddress.trim() && (
                <p className="mb-4 whitespace-pre-line">
                  {formData.companyAddress}
                </p>
              )}
              {!formData.companyAddress.trim() && (
                <div className="mb-4" />
              )}

              {/* Salutation */}
              <p className="mb-4">Dear {salutationName},</p>

              {/* Body paragraphs */}
              <p className="mb-4">{previewText.opening}</p>

              {previewText.skills && (
                <p className="mb-4">{previewText.skills}</p>
              )}

              {previewText.interest && (
                <p className="mb-4">{previewText.interest}</p>
              )}

              <p className="mb-4">{previewText.closing}</p>

              {/* Sign-off */}
              <p className="mb-1">{previewText.signOff}</p>
              <p className="font-bold">{formData.yourName}</p>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
