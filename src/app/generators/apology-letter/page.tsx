"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateApologyLetter,
  ApologyLetterData,
} from "@/lib/generators/apology-letter";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ApologyLetterPage() {
  const seoData = getToolSeoContent("apology-letter");
  const relatedTools = getRelatedTools("apology-letter");
  const [formData, setFormData] = useState<ApologyLetterData>({
    yourName: "",
    recipientName: "",
    context: "Professional",
    dateOfIncident: "",
    whatHappened: "",
    acknowledgement: "",
    stepsToPrevent: "",
    closingMessage: "",
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
    formData.whatHappened.trim() &&
    formData.acknowledgement.trim() &&
    formData.stepsToPrevent.trim();

  const handleDownload = async () => {
    const blob = await generateApologyLetter(formData);
    const recipient = slugify(formData.recipientName) || "recipient";
    const today = new Date().toISOString().split("T")[0];
    saveAs(blob, `apology-letter-${recipient}-${today}.docx`);
  };

  return (
    <ToolShell
      title="Apology Letter Generator"
      description="Create a sincere apology letter in seconds. Free online tool, download as Word document."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="context"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Context
            </label>
            <select
              id="context"
              name="context"
              value={formData.context}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Professional">Professional</option>
              <option value="Personal">Personal</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="dateOfIncident"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Incident (optional)
            </label>
            <input
              type="date"
              id="dateOfIncident"
              name="dateOfIncident"
              value={formData.dateOfIncident}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="whatHappened"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            What Happened
          </label>
          <textarea
            id="whatHappened"
            name="whatHappened"
            rows={4}
            value={formData.whatHappened}
            onChange={handleChange}
            placeholder="Describe the incident or situation..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="acknowledgement"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Acknowledgement
          </label>
          <textarea
            id="acknowledgement"
            name="acknowledgement"
            rows={4}
            value={formData.acknowledgement}
            onChange={handleChange}
            placeholder="Acknowledge the impact of your actions..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="stepsToPrevent"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Steps to Prevent Recurrence
          </label>
          <textarea
            id="stepsToPrevent"
            name="stepsToPrevent"
            rows={4}
            value={formData.stepsToPrevent}
            onChange={handleChange}
            placeholder="What steps will you take to ensure this doesn't happen again..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="closingMessage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Closing Message (optional)
          </label>
          <textarea
            id="closingMessage"
            name="closingMessage"
            rows={3}
            value={formData.closingMessage}
            onChange={handleChange}
            placeholder="Any additional message..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} />
      </div>
    </ToolShell>
  );
}
