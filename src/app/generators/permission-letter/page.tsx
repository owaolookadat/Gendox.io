"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generatePermissionLetter,
  PermissionLetterData,
} from "@/lib/generators/permission-letter";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PermissionLetterPage() {
  const seoData = getToolSeoContent("permission-letter");
  const relatedTools = getRelatedTools("permission-letter");
  const [formData, setFormData] = useState<PermissionLetterData>({
    yourName: "",
    yourTitle: "",
    organization: "",
    recipientName: "",
    recipientTitle: "",
    permissionType: "Leave of Absence",
    details: "",
    dates: "",
    justification: "",
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
    formData.details.trim() &&
    formData.dates.trim();

  const handleDownload = async () => {
    const blob = await generatePermissionLetter(formData);
    const recipient = slugify(formData.recipientName) || "recipient";
    const today = new Date().toISOString().split("T")[0];
    saveAs(blob, `permission-letter-${recipient}-${today}.docx`);
  };

  return (
    <ToolShell
      title="Permission Letter Generator"
      description="Create a formal permission request letter in seconds. Free online tool, download as Word document."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
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
              Your Title / Role
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
            htmlFor="organization"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Organization
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
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

        {/* Permission Type */}
        <div>
          <label
            htmlFor="permissionType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Permission Type
          </label>
          <select
            id="permissionType"
            name="permissionType"
            value={formData.permissionType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Leave of Absence">Leave of Absence</option>
            <option value="Use of Facilities">Use of Facilities</option>
            <option value="Event">Event</option>
            <option value="Travel">Travel</option>
            <option value="Research">Research</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Content Fields */}
        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Details of Request
          </label>
          <textarea
            id="details"
            name="details"
            rows={4}
            value={formData.details}
            onChange={handleChange}
            placeholder="Describe what you are requesting permission for..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="dates"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Dates
          </label>
          <input
            type="text"
            id="dates"
            name="dates"
            value={formData.dates}
            onChange={handleChange}
            placeholder="e.g. 1st - 15th March 2026"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="justification"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Justification (optional)
          </label>
          <textarea
            id="justification"
            name="justification"
            rows={3}
            value={formData.justification}
            onChange={handleChange}
            placeholder="Provide reasons supporting your request..."
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
            placeholder="Any proposed conditions or commitments..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} />
      </div>
    </ToolShell>
  );
}
