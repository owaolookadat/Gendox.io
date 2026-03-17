"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateWaiverForm,
  WaiverFormData,
} from "@/lib/generators/waiver-form";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function WaiverFormPage() {
  const seoData = getToolSeoContent("waiver-form");
  const relatedTools = getRelatedTools("waiver-form");
  const [formData, setFormData] = useState<WaiverFormData>({
    organizationName: "",
    activityName: "",
    activityDescription: "",
    dateOfActivity: new Date().toISOString().split("T")[0],
    location: "",
    participantName: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    risksAcknowledged: "",
    liabilityRelease:
      "In consideration of being permitted to participate in the above-described activity, I hereby release, waive, discharge, and covenant not to sue the organization, its officers, directors, employees, agents, and volunteers from any and all liability, claims, demands, actions, and causes of action whatsoever, arising out of or related to any loss, damage, or injury that may be sustained by me during or as a result of my participation in the activity.",
    medicalConditions: "",
    governingLaw: "",
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
    formData.activityName.trim() &&
    formData.activityDescription.trim() &&
    formData.participantName.trim() &&
    formData.emergencyContactName.trim() &&
    formData.emergencyContactPhone.trim() &&
    formData.risksAcknowledged.trim() &&
    formData.governingLaw.trim();

  const handleDownload = async () => {
    const blob = await generateWaiverForm(formData);
    const org = slugify(formData.organizationName) || "organization";
    const participant = slugify(formData.participantName) || "participant";
    saveAs(blob, `waiver-form-${org}-${participant}.docx`);
  };

  return (
    <ToolShell
      title="Waiver Form Generator"
      description="Create a liability waiver and release form in seconds. Free online tool, download as Word document."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
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
            <label htmlFor="activityName" className="block text-sm font-medium text-gray-700 mb-1">
              Activity / Event Name
            </label>
            <input
              type="text"
              id="activityName"
              name="activityName"
              value={formData.activityName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="activityDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Activity Description
          </label>
          <textarea
            id="activityDescription"
            name="activityDescription"
            rows={4}
            value={formData.activityDescription}
            onChange={handleChange}
            placeholder="Describe the activity or event..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateOfActivity" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Activity
            </label>
            <input
              type="date"
              id="dateOfActivity"
              name="dateOfActivity"
              value={formData.dateOfActivity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Name
            </label>
            <input
              type="text"
              id="emergencyContactName"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Phone
            </label>
            <input
              type="text"
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="risksAcknowledged" className="block text-sm font-medium text-gray-700 mb-1">
            Risks Acknowledged
          </label>
          <textarea
            id="risksAcknowledged"
            name="risksAcknowledged"
            rows={4}
            value={formData.risksAcknowledged}
            onChange={handleChange}
            placeholder="List the risks the participant acknowledges..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="liabilityRelease" className="block text-sm font-medium text-gray-700 mb-1">
            Liability Release Statement
          </label>
          <textarea
            id="liabilityRelease"
            name="liabilityRelease"
            rows={4}
            value={formData.liabilityRelease}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 mb-1">
            Medical Conditions (optional)
          </label>
          <textarea
            id="medicalConditions"
            name="medicalConditions"
            rows={3}
            value={formData.medicalConditions}
            onChange={handleChange}
            placeholder="Any medical conditions or allergies to disclose..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="governingLaw" className="block text-sm font-medium text-gray-700 mb-1">
            Governing Law
          </label>
          <input
            type="text"
            id="governingLaw"
            name="governingLaw"
            value={formData.governingLaw}
            onChange={handleChange}
            placeholder="e.g. State of California, England and Wales"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} />
      </div>
    </ToolShell>
  );
}
