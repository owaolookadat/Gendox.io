"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateConsentForm,
  ConsentFormData,
} from "@/lib/generators/consent-form";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ConsentFormPage() {
  const [formData, setFormData] = useState<ConsentFormData>({
    organizationName: "",
    purpose: "Medical Procedure",
    description: "",
    participantName: "",
    date: new Date().toISOString().split("T")[0],
    risks: "",
    benefits: "",
    voluntaryStatement:
      "Your participation in this activity is entirely voluntary. You are free to decline to participate or to withdraw at any time without penalty or loss of benefits to which you are otherwise entitled.",
    withdrawalPolicy:
      "You have the right to withdraw your consent and discontinue participation at any time. To withdraw, please notify the contact person listed below. Your withdrawal will not affect any services or benefits you are otherwise entitled to receive.",
    contactPerson: "",
    contactEmail: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValid =
    formData.organizationName.trim() &&
    formData.description.trim() &&
    formData.participantName.trim() &&
    formData.contactPerson.trim() &&
    formData.contactEmail.trim();

  const handleDownload = async () => {
    const blob = await generateConsentForm(formData);
    const org = slugify(formData.organizationName) || "organization";
    const participant = slugify(formData.participantName) || "participant";
    saveAs(blob, `consent-form-${org}-${participant}.docx`);
  };

  return (
    <ToolShell
      title="Consent Form Generator"
      description="Create a professional consent form in seconds. Free online tool, download as Word document."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
              Purpose
            </label>
            <select
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Medical Procedure">Medical Procedure</option>
              <option value="Research Participation">Research Participation</option>
              <option value="Photography">Photography</option>
              <option value="Data Collection">Data Collection</option>
              <option value="Event">Event</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description of Activity
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the activity or procedure the participant is consenting to..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="participantName" className="block text-sm font-medium text-gray-700 mb-1">
              Participant Name
            </label>
            <input
              type="text"
              id="participantName"
              name="participantName"
              value={formData.participantName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
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
        </div>

        <div>
          <label htmlFor="risks" className="block text-sm font-medium text-gray-700 mb-1">
            Risks (optional)
          </label>
          <textarea
            id="risks"
            name="risks"
            rows={3}
            value={formData.risks}
            onChange={handleChange}
            placeholder="Describe any potential risks associated with this activity..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
            Benefits (optional)
          </label>
          <textarea
            id="benefits"
            name="benefits"
            rows={3}
            value={formData.benefits}
            onChange={handleChange}
            placeholder="Describe any potential benefits..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="voluntaryStatement" className="block text-sm font-medium text-gray-700 mb-1">
            Voluntary Participation Statement
          </label>
          <textarea
            id="voluntaryStatement"
            name="voluntaryStatement"
            rows={3}
            value={formData.voluntaryStatement}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="withdrawalPolicy" className="block text-sm font-medium text-gray-700 mb-1">
            Withdrawal Policy
          </label>
          <textarea
            id="withdrawalPolicy"
            name="withdrawalPolicy"
            rows={3}
            value={formData.withdrawalPolicy}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} />
      </div>
    </ToolShell>
  );
}
