"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateAwardCertificate,
  AwardCertificateData,
} from "@/lib/generators/award-certificate";
import { saveAs } from "file-saver";

const categoryOptions = [
  "Employee of the Month",
  "Employee of the Year",
  "Excellence Award",
  "Leadership",
  "Innovation",
  "Service",
  "Achievement",
  "Custom",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AwardCertificatePage() {
  const [recipientName, setRecipientName] = useState("");
  const [awardTitle, setAwardTitle] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Excellence Award");
  const [description, setDescription] = useState("");
  const [presentedByName, setPresentedByName] = useState("");
  const [presentedByTitle, setPresentedByTitle] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");

  const isValid =
    recipientName &&
    awardTitle &&
    organizationName &&
    date &&
    description &&
    presentedByName &&
    presentedByTitle;

  const handleDownload = async () => {
    const data: AwardCertificateData = {
      recipientName, awardTitle, organizationName, date, category,
      description, presentedByName, presentedByTitle, certificateNumber,
    };
    const blob = await generateAwardCertificate(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `award-certificate-${slugify(recipientName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Award Certificate Generator"
      description="Create a professional award or recognition certificate in seconds. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="recipientName" className={labelClass}>Recipient Name</label>
          <input id="recipientName" type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
        </div>

        <div>
          <label htmlFor="awardTitle" className={labelClass}>Award Title</label>
          <input id="awardTitle" type="text" value={awardTitle} onChange={(e) => setAwardTitle(e.target.value)} placeholder="e.g. Outstanding Performance Award" className={inputClass} />
        </div>

        <div>
          <label htmlFor="organizationName" className={labelClass}>Organization Name</label>
          <input id="organizationName" type="text" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} placeholder="Acme Corp" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className={labelClass}>Date</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Description / Reason</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the reason for the award or recognition..." rows={4} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="presentedByName" className={labelClass}>Presented By Name</label>
            <input id="presentedByName" type="text" value={presentedByName} onChange={(e) => setPresentedByName(e.target.value)} placeholder="John Smith" className={inputClass} />
          </div>
          <div>
            <label htmlFor="presentedByTitle" className={labelClass}>Presented By Title</label>
            <input id="presentedByTitle" type="text" value={presentedByTitle} onChange={(e) => setPresentedByTitle(e.target.value)} placeholder="CEO" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="certificateNumber" className={labelClass}>
            Certificate Number <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input id="certificateNumber" type="text" value={certificateNumber} onChange={(e) => setCertificateNumber(e.target.value)} placeholder="e.g. AWD-2026-001" className={inputClass} />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Award Certificate" />
      </div>
    </ToolShell>
  );
}
