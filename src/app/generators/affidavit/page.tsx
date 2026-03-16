"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateAffidavit,
  AffidavitData,
} from "@/lib/generators/affidavit";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AffidavitPage() {
  const [formData, setFormData] = useState<AffidavitData>({
    affiantName: "",
    affiantAddress: "",
    affiantTitle: "",
    purpose: "",
    statementOfFacts: "",
    additionalFacts: "",
    date: new Date().toISOString().split("T")[0],
    jurisdiction: "",
    includeNotary: true,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const isValid =
    formData.affiantName.trim() &&
    formData.purpose.trim() &&
    formData.statementOfFacts.trim() &&
    formData.jurisdiction.trim();

  const handleDownload = async () => {
    const blob = await generateAffidavit(formData);
    const name = slugify(formData.affiantName) || "affiant";
    const date = formData.date || "undated";
    saveAs(blob, `affidavit-${name}-${date}.docx`);
  };

  return (
    <ToolShell
      title="Affidavit Generator"
      description="Create a formal affidavit with sworn statement in seconds. Free online tool, download as Word document."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="affiantName" className="block text-sm font-medium text-gray-700 mb-1">
              Affiant Name (Person Making Statement)
            </label>
            <input
              type="text"
              id="affiantName"
              name="affiantName"
              value={formData.affiantName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="affiantTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Title / Occupation (optional)
            </label>
            <input
              type="text"
              id="affiantTitle"
              name="affiantTitle"
              value={formData.affiantTitle}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="affiantAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Affiant Address
          </label>
          <textarea
            id="affiantAddress"
            name="affiantAddress"
            rows={3}
            value={formData.affiantAddress}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
              Purpose / Subject
            </label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g. Identity Verification, Property Ownership"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700 mb-1">
              Jurisdiction / State
            </label>
            <input
              type="text"
              id="jurisdiction"
              name="jurisdiction"
              value={formData.jurisdiction}
              onChange={handleChange}
              placeholder="e.g. State of New York, England and Wales"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="statementOfFacts" className="block text-sm font-medium text-gray-700 mb-1">
            Statement of Facts
          </label>
          <textarea
            id="statementOfFacts"
            name="statementOfFacts"
            rows={6}
            value={formData.statementOfFacts}
            onChange={handleChange}
            placeholder="Enter your sworn statement of facts here..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="additionalFacts" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Facts (optional)
          </label>
          <textarea
            id="additionalFacts"
            name="additionalFacts"
            rows={4}
            value={formData.additionalFacts}
            onChange={handleChange}
            placeholder="Any additional facts to include..."
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="includeNotary"
            name="includeNotary"
            checked={formData.includeNotary}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="includeNotary" className="text-sm font-medium text-gray-700">
            Include notary acknowledgment block
          </label>
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} />
      </div>
    </ToolShell>
  );
}
