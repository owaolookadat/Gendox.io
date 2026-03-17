"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateAuthorizationLetter,
  AuthorizationLetterData,
} from "@/lib/generators/authorization-letter";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AuthorizationLetterPage() {
  const seoData = getToolSeoContent("authorization-letter");
  const relatedTools = getRelatedTools("authorization-letter");
  const [formData, setFormData] = useState<AuthorizationLetterData>({
    yourName: "",
    yourId: "",
    authorizedPersonName: "",
    authorizedPersonId: "",
    purpose: "Collect Documents",
    authorizationDetails: "",
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: "",
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
    formData.authorizedPersonName.trim() &&
    formData.authorizationDetails.trim() &&
    formData.validFrom &&
    formData.validUntil;

  const handleDownload = async () => {
    const blob = await generateAuthorizationLetter(formData);
    const person = slugify(formData.authorizedPersonName) || "person";
    const today = new Date().toISOString().split("T")[0];
    saveAs(blob, `authorization-letter-${person}-${today}.docx`);
  };

  return (
    <ToolShell
      title="Authorization Letter Generator"
      description="Create a formal authorization letter in seconds. Free online tool, download as Word document."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        {/* Authorizer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="yourName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name (Authorizer)
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
              htmlFor="yourId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your ID / Reference (optional)
            </label>
            <input
              type="text"
              id="yourId"
              name="yourId"
              value={formData.yourId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Authorized Person */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="authorizedPersonName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Authorized Person Name
            </label>
            <input
              type="text"
              id="authorizedPersonName"
              name="authorizedPersonName"
              value={formData.authorizedPersonName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="authorizedPersonId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Authorized Person ID (optional)
            </label>
            <input
              type="text"
              id="authorizedPersonId"
              name="authorizedPersonId"
              value={formData.authorizedPersonId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Purpose */}
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
            <option value="Collect Documents">Collect Documents</option>
            <option value="Bank Transaction">Bank Transaction</option>
            <option value="Legal Representation">Legal Representation</option>
            <option value="Sign Documents">Sign Documents</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Authorization Details */}
        <div>
          <label
            htmlFor="authorizationDetails"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Specific Authorization Details
          </label>
          <textarea
            id="authorizationDetails"
            name="authorizationDetails"
            rows={4}
            value={formData.authorizationDetails}
            onChange={handleChange}
            placeholder="Describe exactly what the authorized person is permitted to do..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Validity Period */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="validFrom"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Valid From
            </label>
            <input
              type="date"
              id="validFrom"
              name="validFrom"
              value={formData.validFrom}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="validUntil"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Valid Until
            </label>
            <input
              type="date"
              id="validUntil"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Conditions */}
        <div>
          <label
            htmlFor="conditions"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Conditions / Limitations (optional)
          </label>
          <textarea
            id="conditions"
            name="conditions"
            rows={3}
            value={formData.conditions}
            onChange={handleChange}
            placeholder="Any restrictions or limitations on this authorization..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} />
      </div>
    </ToolShell>
  );
}
