"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateBusinessLetter,
  BusinessLetterData,
} from "@/lib/generators/business-letter";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BusinessLetterPage() {
  const seoData = getToolSeoContent("business-letter");
  const relatedTools = getRelatedTools("business-letter");
  const [formData, setFormData] = useState<BusinessLetterData>({
    yourName: "",
    yourTitle: "",
    yourCompany: "",
    yourAddress: "",
    recipientName: "",
    recipientTitle: "",
    recipientCompany: "",
    recipientAddress: "",
    date: new Date().toISOString().split("T")[0],
    subject: "",
    salutation: "Dear Mr.",
    body: "",
    closing: "Yours sincerely",
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
    formData.yourAddress.trim() &&
    formData.recipientName.trim() &&
    formData.recipientCompany.trim() &&
    formData.recipientAddress.trim() &&
    formData.subject.trim() &&
    formData.body.trim();

  const handleDownload = async () => {
    const blob = await generateBusinessLetter(formData);
    const recipient = slugify(formData.recipientCompany) || "recipient";
    const today = new Date().toISOString().split("T")[0];
    saveAs(blob, `business-letter-${recipient}-${today}.docx`);
  };

  return (
    <ToolShell
      title="Business Letter Generator"
      description="Create a professional business letter in seconds. Free online tool, download as Word document."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        {/* Sender Details */}
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Your Details
        </h3>

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
            htmlFor="yourCompany"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Company (optional)
          </label>
          <input
            type="text"
            id="yourCompany"
            name="yourCompany"
            value={formData.yourCompany}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="yourAddress"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Address
          </label>
          <textarea
            id="yourAddress"
            name="yourAddress"
            rows={3}
            value={formData.yourAddress}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Recipient Details */}
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide pt-2">
          Recipient Details
        </h3>

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
              Recipient Title (optional)
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
            htmlFor="recipientCompany"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Recipient Company
          </label>
          <input
            type="text"
            id="recipientCompany"
            name="recipientCompany"
            value={formData.recipientCompany}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="recipientAddress"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Recipient Address
          </label>
          <textarea
            id="recipientAddress"
            name="recipientAddress"
            rows={3}
            value={formData.recipientAddress}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Letter Details */}
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide pt-2">
          Letter Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="salutation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Salutation
            </label>
            <select
              id="salutation"
              name="salutation"
              value={formData.salutation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Dear Mr.">Dear Mr.</option>
              <option value="Dear Ms.">Dear Ms.</option>
              <option value="Dear Dr.">Dear Dr.</option>
              <option value="To Whom It May Concern">
                To Whom It May Concern
              </option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject
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

        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Body
          </label>
          <textarea
            id="body"
            name="body"
            rows={8}
            value={formData.body}
            onChange={handleChange}
            placeholder="Write the body of your letter here..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="closing"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Closing
          </label>
          <select
            id="closing"
            name="closing"
            value={formData.closing}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Yours sincerely">Yours sincerely</option>
            <option value="Yours faithfully">Yours faithfully</option>
            <option value="Best regards">Best regards</option>
            <option value="Kind regards">Kind regards</option>
          </select>
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} />
      </div>
    </ToolShell>
  );
}
