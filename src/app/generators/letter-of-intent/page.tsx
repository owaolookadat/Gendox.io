"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateLetterOfIntent,
  LetterOfIntentData,
} from "@/lib/generators/letter-of-intent";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function LetterOfIntentPage() {
  const [formData, setFormData] = useState<LetterOfIntentData>({
    yourName: "",
    yourTitle: "",
    yourOrganization: "",
    recipientName: "",
    recipientTitle: "",
    recipientOrganization: "",
    purpose: "Business Partnership",
    subject: "",
    intentStatement: "",
    keyTerms: "",
    timeline: "",
    conditions: "",
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
    formData.recipientName.trim() &&
    formData.recipientOrganization.trim() &&
    formData.subject.trim() &&
    formData.intentStatement.trim() &&
    formData.keyTerms.trim();

  const handleDownload = async () => {
    const blob = await generateLetterOfIntent(formData);
    const recipient = slugify(formData.recipientOrganization) || "recipient";
    const today = new Date().toISOString().split("T")[0];
    saveAs(blob, `letter-of-intent-${recipient}-${today}.docx`);
  };

  return (
    <ToolShell
      title="Letter of Intent Generator"
      description="Create a professional letter of intent in seconds. Free online tool, download as Word document."
      category="Document Generator"
    >
      <div className="space-y-4">
        {/* Your Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="yourName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name
            </label>
            <input
              type="text"
              id="yourName"
              name="yourName"
              value={formData.yourName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="yourTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Title (optional)
            </label>
            <input
              type="text"
              id="yourTitle"
              name="yourTitle"
              value={formData.yourTitle}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="yourOrganization"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Organization (optional)
          </label>
          <input
            type="text"
            id="yourOrganization"
            name="yourOrganization"
            value={formData.yourOrganization}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Recipient Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="recipientName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipient Name
            </label>
            <input
              type="text"
              id="recipientName"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="recipientTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipient Title
            </label>
            <input
              type="text"
              id="recipientTitle"
              name="recipientTitle"
              value={formData.recipientTitle}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="recipientOrganization"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Recipient Organization
          </label>
          <input
            type="text"
            id="recipientOrganization"
            name="recipientOrganization"
            value={formData.recipientOrganization}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Purpose & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="purpose"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Purpose
            </label>
            <select
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Business Partnership">Business Partnership</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Graduate School">Graduate School</option>
              <option value="Employment">Employment</option>
              <option value="Investment">Investment</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject / Regarding
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content Fields */}
        <div>
          <label
            htmlFor="intentStatement"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Intent Statement
          </label>
          <textarea
            id="intentStatement"
            name="intentStatement"
            rows={4}
            value={formData.intentStatement}
            onChange={handleChange}
            placeholder="Describe your intent clearly..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="keyTerms"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Key Terms or Details
          </label>
          <textarea
            id="keyTerms"
            name="keyTerms"
            rows={4}
            value={formData.keyTerms}
            onChange={handleChange}
            placeholder="Outline the key terms of the proposed arrangement..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="timeline"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Timeline (optional)
          </label>
          <input
            type="text"
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            placeholder="e.g. Q2 2026, Within 30 days..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="conditions"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Conditions (optional)
          </label>
          <textarea
            id="conditions"
            name="conditions"
            rows={3}
            value={formData.conditions}
            onChange={handleChange}
            placeholder="Any conditions or prerequisites..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} />
      </div>
    </ToolShell>
  );
}
