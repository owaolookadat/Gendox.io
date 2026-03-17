"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateDemandLetter,
  DemandLetterData,
} from "@/lib/generators/demand-letter";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function DemandLetterPage() {
  const seoData = getToolSeoContent("demand-letter");
  const relatedTools = getRelatedTools("demand-letter");
  const [formData, setFormData] = useState<DemandLetterData>({
    yourName: "",
    yourAddress: "",
    recipientName: "",
    recipientAddress: "",
    subject: "",
    amountOwed: "",
    descriptionOfClaim: "",
    supportingFacts: "",
    demand: "",
    deadline: "",
    consequences: "",
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
    formData.recipientAddress.trim() &&
    formData.subject.trim() &&
    formData.descriptionOfClaim.trim() &&
    formData.supportingFacts.trim() &&
    formData.demand.trim() &&
    formData.deadline &&
    formData.consequences.trim();

  const handleDownload = async () => {
    const blob = await generateDemandLetter(formData);
    const recipient = slugify(formData.recipientName) || "recipient";
    const today = new Date().toISOString().split("T")[0];
    saveAs(blob, `demand-letter-${recipient}-${today}.docx`);
  };

  return (
    <ToolShell
      title="Demand Letter Generator"
      description="Create a formal demand letter in seconds. Free online tool, download as Word document."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        {/* Your Details */}
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
            placeholder="Your full address..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Recipient Details */}
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
            placeholder="Recipient's full address..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Subject & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div>
            <label
              htmlFor="amountOwed"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount Owed (optional)
            </label>
            <input
              type="text"
              id="amountOwed"
              name="amountOwed"
              value={formData.amountOwed}
              onChange={handleChange}
              placeholder="e.g. $5,000"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content Fields */}
        <div>
          <label
            htmlFor="descriptionOfClaim"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description of Claim
          </label>
          <textarea
            id="descriptionOfClaim"
            name="descriptionOfClaim"
            rows={4}
            value={formData.descriptionOfClaim}
            onChange={handleChange}
            placeholder="Describe the nature of your claim..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="supportingFacts"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Supporting Facts
          </label>
          <textarea
            id="supportingFacts"
            name="supportingFacts"
            rows={4}
            value={formData.supportingFacts}
            onChange={handleChange}
            placeholder="List facts, dates, and evidence supporting your claim..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="demand"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Demand (What You Want)
          </label>
          <textarea
            id="demand"
            name="demand"
            rows={4}
            value={formData.demand}
            onChange={handleChange}
            placeholder="State clearly what you are demanding..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deadline for Compliance
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="consequences"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Consequences of Non-Compliance
          </label>
          <textarea
            id="consequences"
            name="consequences"
            rows={4}
            value={formData.consequences}
            onChange={handleChange}
            placeholder="Describe the actions you will take if the demand is not met..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} />
      </div>
    </ToolShell>
  );
}
