"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateEvictionNotice,
  EvictionNoticeData,
} from "@/lib/generators/eviction-notice";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EvictionNoticePage() {
  const [formData, setFormData] = useState<EvictionNoticeData>({
    landlordName: "",
    landlordAddress: "",
    tenantName: "",
    propertyAddress: "",
    noticeType: "Pay or Quit",
    noticePeriod: "30 Days",
    reasonForEviction: "",
    amountOwed: 0,
    dueDate: "",
    dateOfNotice: new Date().toISOString().split("T")[0],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "amountOwed") {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const isValid =
    formData.landlordName.trim() &&
    formData.tenantName.trim() &&
    formData.propertyAddress.trim() &&
    formData.reasonForEviction.trim() &&
    formData.dueDate;

  const handleDownload = async () => {
    const blob = await generateEvictionNotice(formData);
    const tenant = slugify(formData.tenantName) || "tenant";
    const date = formData.dateOfNotice || "undated";
    saveAs(blob, `eviction-notice-${tenant}-${date}.docx`);
  };

  return (
    <ToolShell
      title="Eviction Notice Generator"
      description="Create a formal eviction notice in seconds. Free online tool, download as Word document."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="landlordName" className="block text-sm font-medium text-gray-700 mb-1">
              Landlord Name
            </label>
            <input
              type="text"
              id="landlordName"
              name="landlordName"
              value={formData.landlordName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700 mb-1">
              Tenant Name
            </label>
            <input
              type="text"
              id="tenantName"
              name="tenantName"
              value={formData.tenantName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="landlordAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Landlord Address
          </label>
          <textarea
            id="landlordAddress"
            name="landlordAddress"
            rows={3}
            value={formData.landlordAddress}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Property Address
          </label>
          <textarea
            id="propertyAddress"
            name="propertyAddress"
            rows={3}
            value={formData.propertyAddress}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="noticeType" className="block text-sm font-medium text-gray-700 mb-1">
              Notice Type
            </label>
            <select
              id="noticeType"
              name="noticeType"
              value={formData.noticeType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Pay or Quit">Pay or Quit</option>
              <option value="Cure or Quit">Cure or Quit</option>
              <option value="Unconditional Quit">Unconditional Quit</option>
            </select>
          </div>
          <div>
            <label htmlFor="noticePeriod" className="block text-sm font-medium text-gray-700 mb-1">
              Notice Period
            </label>
            <select
              id="noticePeriod"
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="3 Days">3 Days</option>
              <option value="7 Days">7 Days</option>
              <option value="14 Days">14 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="60 Days">60 Days</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="reasonForEviction" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Eviction
          </label>
          <textarea
            id="reasonForEviction"
            name="reasonForEviction"
            rows={4}
            value={formData.reasonForEviction}
            onChange={handleChange}
            placeholder="Describe the reason for this eviction notice..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="amountOwed" className="block text-sm font-medium text-gray-700 mb-1">
              Amount Owed (optional)
            </label>
            <input
              type="number"
              id="amountOwed"
              name="amountOwed"
              value={formData.amountOwed || ""}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date to Comply
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="dateOfNotice" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Notice
            </label>
            <input
              type="date"
              id="dateOfNotice"
              name="dateOfNotice"
              value={formData.dateOfNotice}
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
