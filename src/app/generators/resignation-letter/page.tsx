"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DocumentPreview from "@/components/DocumentPreview";
import { useDocumentFlow } from "@/hooks/useDocumentFlow";
import {
  generateResignationLetter,
  generateLetterParagraphs,
  ResignationLetterData,
  Tone,
} from "@/lib/generators/resignation-letter";
import { saveAs } from "file-saver";

const reasons = [
  "",
  "New Opportunity",
  "Personal Reasons",
  "Career Change",
  "Relocation",
  "Other",
];

const noticePeriods = ["Immediate", "1 Week", "2 Weeks", "1 Month", "Other"];

const toneOptions: { value: Tone; label: string; description: string }[] = [
  {
    value: "professional",
    label: "Professional",
    description: "Formal and business-appropriate. Suitable for most workplaces.",
  },
  {
    value: "grateful",
    label: "Grateful",
    description:
      "Warm and appreciative. Emphasises gratitude and positive experiences.",
  },
  {
    value: "brief",
    label: "Brief",
    description: "Short and to the point. Just the essentials, no extras.",
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDateDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ResignationLetterPage() {
  const seoData = getToolSeoContent("resignation-letter");
  const relatedTools = getRelatedTools("resignation-letter");
  const { isEditing, isPreviewing, showPreview, goBackToEdit } = useDocumentFlow();

  const [yourName, setYourName] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const [yourPhone, setYourPhone] = useState("");
  const [yourAddress, setYourAddress] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerTitle, setManagerTitle] = useState("");
  const [lastWorkingDay, setLastWorkingDay] = useState("");
  const [reason, setReason] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("2 Weeks");
  const [personalMessage, setPersonalMessage] = useState("");
  const [tone, setTone] = useState<Tone>("professional");

  const isValid =
    yourName && jobTitle && companyName && managerName && lastWorkingDay;

  const formData: ResignationLetterData = {
    yourName,
    yourEmail,
    yourPhone,
    yourAddress,
    jobTitle,
    companyName,
    companyAddress,
    managerName,
    managerTitle,
    lastWorkingDay,
    reason,
    noticePeriod,
    personalMessage,
    tone,
  };

  const todayFormatted = formatDateDisplay(new Date().toISOString());

  const handleDownload = async () => {
    const blob = await generateResignationLetter(formData);
    const today = new Date().toISOString().split("T")[0];
    const filename = `resignation-letter-${slugify(companyName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const sectionHeadingClass =
    "text-base font-semibold text-gray-900 pb-2 border-b border-gray-200 mb-4";

  const RequiredMark = () => (
    <span className="text-red-500 ml-0.5" aria-label="required">
      *
    </span>
  );

  return (
    <ToolShell
      title="Resignation Letter Generator"
      description="Generate a professional resignation letter in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      {isEditing && (
        <div className="space-y-6">
          {/* Section: Your Details */}
          <div>
            <h3 className={sectionHeadingClass}>Your Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="yourName" className={labelClass}>
                    Full Name
                    <RequiredMark />
                  </label>
                  <input
                    id="yourName"
                    type="text"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    placeholder="e.g. Sarah Johnson"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="jobTitle" className={labelClass}>
                    Job Title
                    <RequiredMark />
                  </label>
                  <input
                    id="jobTitle"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Marketing Manager"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="yourEmail" className={labelClass}>
                    Email Address
                  </label>
                  <input
                    id="yourEmail"
                    type="email"
                    value={yourEmail}
                    onChange={(e) => setYourEmail(e.target.value)}
                    placeholder="e.g. sarah.johnson@email.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="yourPhone" className={labelClass}>
                    Phone Number
                  </label>
                  <input
                    id="yourPhone"
                    type="tel"
                    value={yourPhone}
                    onChange={(e) => setYourPhone(e.target.value)}
                    placeholder="e.g. +44 7700 900123"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="yourAddress" className={labelClass}>
                  Your Address
                </label>
                <textarea
                  id="yourAddress"
                  value={yourAddress}
                  onChange={(e) => setYourAddress(e.target.value)}
                  placeholder="e.g. 42 High Street, London, EC1A 1BB"
                  rows={2}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section: Recipient Details */}
          <div>
            <h3 className={sectionHeadingClass}>Recipient Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="managerName" className={labelClass}>
                    Manager&apos;s Name
                    <RequiredMark />
                  </label>
                  <input
                    id="managerName"
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="e.g. David Thompson"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="managerTitle" className={labelClass}>
                    Manager&apos;s Title
                  </label>
                  <input
                    id="managerTitle"
                    type="text"
                    value={managerTitle}
                    onChange={(e) => setManagerTitle(e.target.value)}
                    placeholder="e.g. Head of Marketing"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyName" className={labelClass}>
                    Company Name
                    <RequiredMark />
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Bright Solutions Ltd"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="companyAddress" className={labelClass}>
                    Company Address
                  </label>
                  <input
                    id="companyAddress"
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="e.g. 100 King Street, Manchester, M2 4WQ"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Resignation Details */}
          <div>
            <h3 className={sectionHeadingClass}>Resignation Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lastWorkingDay" className={labelClass}>
                    Last Working Day
                    <RequiredMark />
                  </label>
                  <input
                    id="lastWorkingDay"
                    type="date"
                    value={lastWorkingDay}
                    onChange={(e) => setLastWorkingDay(e.target.value)}
                    className={inputClass}
                  />
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
                    {noticePeriods.map((np) => (
                      <option key={np} value={np}>
                        {np}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="reason" className={labelClass}>
                  Reason for Leaving
                </label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={inputClass}
                >
                  <option value="">-- Select (optional) --</option>
                  {reasons
                    .filter((r) => r !== "")
                    .map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                </select>
              </div>

              {/* Tone selector */}
              <div>
                <label className={labelClass}>Letter Tone</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {toneOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTone(opt.value)}
                      className={`text-left border rounded-lg p-3 transition-all ${
                        tone === opt.value
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    >
                      <span className="block text-sm font-medium text-gray-900">
                        {opt.label}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {opt.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Message */}
              <div>
                <label htmlFor="personalMessage" className={labelClass}>
                  Personal Message{" "}
                  <span className="text-gray-400 font-normal">
                    (optional, max 200 chars)
                  </span>
                </label>
                <textarea
                  id="personalMessage"
                  value={personalMessage}
                  onChange={(e) =>
                    setPersonalMessage(e.target.value.slice(0, 200))
                  }
                  placeholder="e.g. I have truly enjoyed working with the team and will miss our collaboration."
                  rows={3}
                  maxLength={200}
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {personalMessage.length}/200 characters
                </p>
              </div>
            </div>
          </div>

          {/* Generate Document Button */}
          <button
            onClick={showPreview}
            disabled={!isValid}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            Generate Document
          </button>
        </div>
      )}

      {isPreviewing && (
        <DocumentPreview
          documentTitle="Resignation Letter Preview"
          onDownload={handleDownload}
          onEdit={goBackToEdit}
        >
          <div className="font-serif text-sm text-gray-800 leading-relaxed">
            {/* Sender block */}
            <div className="mb-6">
              <p className="font-semibold">{yourName || "[Your Name]"}</p>
              {yourAddress && (
                <p className="text-gray-500 text-xs">{yourAddress}</p>
              )}
              {yourEmail && (
                <p className="text-gray-500 text-xs">{yourEmail}</p>
              )}
              {yourPhone && (
                <p className="text-gray-500 text-xs">{yourPhone}</p>
              )}
            </div>

            <p className="mb-4">{todayFormatted}</p>

            {/* Recipient block */}
            <div className="mb-6">
              <p>{managerName || "[Manager Name]"}</p>
              {managerTitle && <p>{managerTitle}</p>}
              <p>{companyName || "[Company Name]"}</p>
              {companyAddress && <p>{companyAddress}</p>}
            </div>

            <p className="mb-4">
              Dear {managerName || "[Manager Name]"},
            </p>

            {/* Body paragraphs */}
            {generateLetterParagraphs(formData).map((p, i) => (
              <p key={i} className="mb-4">
                {p}
              </p>
            ))}

            <p className="mb-4">Yours sincerely,</p>
            <p className="mt-8 font-semibold">
              {yourName || "[Your Name]"}
            </p>
          </div>
        </DocumentPreview>
      )}
    </ToolShell>
  );
}
