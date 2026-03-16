"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateComplaintLetter,
  ComplaintLetterData,
} from "@/lib/generators/complaint-letter";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ComplaintLetterPage() {
  const [yourName, setYourName] = useState("");
  const [yourAddress, setYourAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientTitle, setRecipientTitle] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [dateOfIssue, setDateOfIssue] = useState("");
  const [subject, setSubject] = useState("");
  const [descriptionOfComplaint, setDescriptionOfComplaint] = useState("");
  const [previousAttempts, setPreviousAttempts] = useState("");
  const [desiredResolution, setDesiredResolution] = useState("");
  const [deadlineForResponse, setDeadlineForResponse] = useState("");

  const isValid =
    yourName &&
    yourAddress &&
    recipientName &&
    organizationName &&
    organizationAddress &&
    dateOfIssue &&
    subject &&
    descriptionOfComplaint &&
    desiredResolution;

  const handleDownload = async () => {
    const data: ComplaintLetterData = {
      yourName,
      yourAddress,
      recipientName,
      recipientTitle,
      organizationName,
      organizationAddress,
      dateOfIssue,
      subject,
      descriptionOfComplaint,
      previousAttempts,
      desiredResolution,
      deadlineForResponse,
    };

    const blob = await generateComplaintLetter(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `complaint-letter-${slugify(organizationName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Complaint Letter Generator"
      description="Generate a formal complaint letter in seconds. Download as Word document instantly."
      category="Document Generator"
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

        <div>
          <label htmlFor="yourAddress" className={labelClass}>
            Your Address
          </label>
          <textarea
            id="yourAddress"
            value={yourAddress}
            onChange={(e) => setYourAddress(e.target.value)}
            placeholder="123 Your Street&#10;City, Postcode"
            rows={2}
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
              placeholder="Customer Services Manager"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="organizationName" className={labelClass}>
            Organization Name
          </label>
          <input
            id="organizationName"
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Acme Corp"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="organizationAddress" className={labelClass}>
            Organization Address
          </label>
          <textarea
            id="organizationAddress"
            value={organizationAddress}
            onChange={(e) => setOrganizationAddress(e.target.value)}
            placeholder="456 Business Road&#10;City, Postcode"
            rows={2}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateOfIssue" className={labelClass}>
              Date of Issue
            </label>
            <input
              id="dateOfIssue"
              type="date"
              value={dateOfIssue}
              onChange={(e) => setDateOfIssue(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="subject" className={labelClass}>
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Faulty Product / Poor Service"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="descriptionOfComplaint" className={labelClass}>
            Description of Complaint
          </label>
          <textarea
            id="descriptionOfComplaint"
            value={descriptionOfComplaint}
            onChange={(e) => setDescriptionOfComplaint(e.target.value)}
            placeholder="Describe your complaint in detail..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="previousAttempts" className={labelClass}>
            Previous Attempts to Resolve{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="previousAttempts"
            value={previousAttempts}
            onChange={(e) => setPreviousAttempts(e.target.value)}
            placeholder="Describe any previous attempts to resolve the issue..."
            rows={2}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="desiredResolution" className={labelClass}>
            Desired Resolution
          </label>
          <textarea
            id="desiredResolution"
            value={desiredResolution}
            onChange={(e) => setDesiredResolution(e.target.value)}
            placeholder="What outcome would you like?"
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="deadlineForResponse" className={labelClass}>
            Deadline for Response{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="deadlineForResponse"
            type="date"
            value={deadlineForResponse}
            onChange={(e) => setDeadlineForResponse(e.target.value)}
            className={inputClass}
          />
        </div>

        <DownloadButton
          onClick={handleDownload}
          disabled={!isValid}
          label="Download Complaint Letter"
        />
      </div>
    </ToolShell>
  );
}
