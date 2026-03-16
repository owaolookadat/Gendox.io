"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateSponsorshipLetter,
  SponsorshipLetterData,
} from "@/lib/generators/sponsorship-letter";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function SponsorshipLetterPage() {
  const [formData, setFormData] = useState<SponsorshipLetterData>({
    yourName: "",
    yourTitle: "",
    yourOrganization: "",
    recipientName: "",
    recipientOrganization: "",
    eventName: "",
    eventDate: "",
    eventDescription: "",
    sponsorshipAmount: "",
    benefitsToSponsor: "",
    responseDeadline: "",
    contactDetails: "",
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
    formData.yourOrganization.trim() &&
    formData.recipientName.trim() &&
    formData.recipientOrganization.trim() &&
    formData.eventName.trim() &&
    formData.eventDescription.trim() &&
    formData.sponsorshipAmount.trim() &&
    formData.benefitsToSponsor.trim() &&
    formData.contactDetails.trim();

  const handleDownload = async () => {
    const blob = await generateSponsorshipLetter(formData);
    const org = slugify(formData.recipientOrganization) || "sponsor";
    const today = new Date().toISOString().split("T")[0];
    saveAs(blob, `sponsorship-letter-${org}-${today}.docx`);
  };

  return (
    <ToolShell
      title="Sponsorship Letter Generator"
      description="Create a professional sponsorship request letter in seconds. Free online tool, download as Word document."
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
              Your Title
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
            Your Organization
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
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="eventName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event / Project Name
            </label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="eventDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Date (optional)
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="eventDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Event Description
          </label>
          <textarea
            id="eventDescription"
            name="eventDescription"
            rows={4}
            value={formData.eventDescription}
            onChange={handleChange}
            placeholder="Describe the event or project..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Sponsorship Details */}
        <div>
          <label
            htmlFor="sponsorshipAmount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sponsorship Amount or Type
          </label>
          <input
            type="text"
            id="sponsorshipAmount"
            name="sponsorshipAmount"
            value={formData.sponsorshipAmount}
            onChange={handleChange}
            placeholder="e.g. $5,000, Gold Tier, In-kind support"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="benefitsToSponsor"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Benefits to Sponsor
          </label>
          <textarea
            id="benefitsToSponsor"
            name="benefitsToSponsor"
            rows={4}
            value={formData.benefitsToSponsor}
            onChange={handleChange}
            placeholder="What will the sponsor receive in return..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="responseDeadline"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deadline for Response (optional)
          </label>
          <input
            type="date"
            id="responseDeadline"
            name="responseDeadline"
            value={formData.responseDeadline}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="contactDetails"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contact Details
          </label>
          <input
            type="text"
            id="contactDetails"
            name="contactDetails"
            value={formData.contactDetails}
            onChange={handleChange}
            placeholder="Phone, email, or other contact information"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} />
      </div>
    </ToolShell>
  );
}
