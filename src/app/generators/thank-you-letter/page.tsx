"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateThankYouLetter,
  ThankYouLetterData,
} from "@/lib/generators/thank-you-letter";
import { saveAs } from "file-saver";

const purposes = [
  "Job Interview",
  "Business Meeting",
  "Gift",
  "Hospitality",
  "Mentorship",
  "General",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ThankYouLetterPage() {
  const seoData = getToolSeoContent("thank-you-letter");
  const relatedTools = getRelatedTools("thank-you-letter");
  const [yourName, setYourName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientTitle, setRecipientTitle] = useState("");
  const [companyOrganization, setCompanyOrganization] = useState("");
  const [purpose, setPurpose] = useState("Job Interview");
  const [specificDetails, setSpecificDetails] = useState("");
  const [additionalMessage, setAdditionalMessage] = useState("");

  const isValid = yourName && recipientName && specificDetails;

  const handleDownload = async () => {
    const data: ThankYouLetterData = {
      yourName,
      recipientName,
      recipientTitle,
      companyOrganization,
      purpose,
      specificDetails,
      additionalMessage,
    };

    const blob = await generateThankYouLetter(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `thank-you-letter-${slugify(recipientName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Thank You Letter Generator"
      description="Generate a professional thank you letter in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="recipientName" className={labelClass}>
              Recipient Name
            </label>
            <input
              id="recipientName"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Jane Doe"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="recipientTitle" className={labelClass}>
              Recipient Title{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="recipientTitle"
              type="text"
              value={recipientTitle}
              onChange={(e) => setRecipientTitle(e.target.value)}
              placeholder="Hiring Manager"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyOrganization" className={labelClass}>
              Company / Organization{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="companyOrganization"
              type="text"
              value={companyOrganization}
              onChange={(e) => setCompanyOrganization(e.target.value)}
              placeholder="Acme Corp"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="purpose" className={labelClass}>
              Purpose
            </label>
            <select
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className={inputClass}
            >
              {purposes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="specificDetails" className={labelClass}>
            Specific Details{" "}
            <span className="text-gray-400 font-normal">
              (what you are thankful for)
            </span>
          </label>
          <textarea
            id="specificDetails"
            value={specificDetails}
            onChange={(e) => setSpecificDetails(e.target.value)}
            placeholder="Describe what specifically you are grateful for..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="additionalMessage" className={labelClass}>
            Additional Message{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="additionalMessage"
            value={additionalMessage}
            onChange={(e) => setAdditionalMessage(e.target.value)}
            placeholder="Any additional thoughts or sentiments..."
            rows={3}
            className={inputClass}
          />
        </div>

        <DownloadButton
          onClick={handleDownload}
          disabled={!isValid}
          label="Download Thank You Letter"
        />
      </div>
    </ToolShell>
  );
}
