"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generatePowerOfAttorney,
  PowerOfAttorneyData,
} from "@/lib/generators/power-of-attorney";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PowerOfAttorneyPage() {
  const [formData, setFormData] = useState<PowerOfAttorneyData>({
    principalName: "",
    principalAddress: "",
    agentName: "",
    agentAddress: "",
    poaType: "General",
    effectiveDate: new Date().toISOString().split("T")[0],
    expirationDate: "",
    specificPowers: "",
    limitations: "",
    governingLaw: "",
    witnessRequired: true,
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
    formData.principalName.trim() &&
    formData.agentName.trim() &&
    formData.specificPowers.trim() &&
    formData.governingLaw.trim() &&
    formData.effectiveDate;

  const handleDownload = async () => {
    const blob = await generatePowerOfAttorney(formData);
    const principal = slugify(formData.principalName) || "principal";
    const type = slugify(formData.poaType) || "general";
    saveAs(blob, `power-of-attorney-${type}-${principal}.docx`);
  };

  return (
    <ToolShell
      title="Power of Attorney Generator"
      description="Create a power of attorney document in seconds. Free online tool, download as Word document."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="principalName" className="block text-sm font-medium text-gray-700 mb-1">
              Principal Name (Person Granting)
            </label>
            <input
              type="text"
              id="principalName"
              name="principalName"
              value={formData.principalName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="agentName" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Name (Person Receiving)
            </label>
            <input
              type="text"
              id="agentName"
              name="agentName"
              value={formData.agentName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="principalAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Principal Address
            </label>
            <textarea
              id="principalAddress"
              name="principalAddress"
              rows={3}
              value={formData.principalAddress}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="agentAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Address
            </label>
            <textarea
              id="agentAddress"
              name="agentAddress"
              rows={3}
              value={formData.agentAddress}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="poaType" className="block text-sm font-medium text-gray-700 mb-1">
              POA Type
            </label>
            <select
              id="poaType"
              name="poaType"
              value={formData.poaType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="General">General</option>
              <option value="Limited">Limited</option>
              <option value="Durable">Durable</option>
              <option value="Springing">Springing</option>
            </select>
          </div>
          <div>
            <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
              Effective Date
            </label>
            <input
              type="date"
              id="effectiveDate"
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date (optional)
            </label>
            <input
              type="date"
              id="expirationDate"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="specificPowers" className="block text-sm font-medium text-gray-700 mb-1">
            Specific Powers Granted
          </label>
          <textarea
            id="specificPowers"
            name="specificPowers"
            rows={4}
            value={formData.specificPowers}
            onChange={handleChange}
            placeholder="Describe the specific powers being granted to the agent..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="limitations" className="block text-sm font-medium text-gray-700 mb-1">
            Limitations (optional)
          </label>
          <textarea
            id="limitations"
            name="limitations"
            rows={3}
            value={formData.limitations}
            onChange={handleChange}
            placeholder="Any limitations on the powers granted..."
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="witnessRequired"
            name="witnessRequired"
            checked={formData.witnessRequired}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="witnessRequired" className="text-sm font-medium text-gray-700">
            Include witness signature section
          </label>
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} />
      </div>
    </ToolShell>
  );
}
