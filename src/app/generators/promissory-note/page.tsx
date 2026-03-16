"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generatePromissoryNote,
  PromissoryNoteData,
} from "@/lib/generators/promissory-note";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const currencyOptions = [
  { value: "GBP", symbol: "\u00a3", label: "GBP \u00a3" },
  { value: "USD", symbol: "$", label: "USD $" },
  { value: "EUR", symbol: "\u20ac", label: "EUR \u20ac" },
  { value: "MYR", symbol: "RM", label: "MYR RM" },
];

export default function PromissoryNotePage() {
  const [formData, setFormData] = useState<PromissoryNoteData>({
    borrowerName: "",
    borrowerAddress: "",
    lenderName: "",
    lenderAddress: "",
    principalAmount: 0,
    currency: "USD",
    currencySymbol: "$",
    interestRate: 0,
    dateOfNote: new Date().toISOString().split("T")[0],
    maturityDate: "",
    paymentTerms: "Lump Sum at Maturity",
    lateFee: "",
    governingLaw: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "currency") {
      const selected = currencyOptions.find((c) => c.value === value);
      setFormData({
        ...formData,
        currency: value,
        currencySymbol: selected?.symbol || "$",
      });
    } else if (name === "principalAmount" || name === "interestRate") {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const isValid =
    formData.borrowerName.trim() &&
    formData.lenderName.trim() &&
    formData.principalAmount > 0 &&
    formData.maturityDate &&
    formData.governingLaw.trim();

  const handleDownload = async () => {
    const blob = await generatePromissoryNote(formData);
    const borrower = slugify(formData.borrowerName) || "borrower";
    const date = formData.dateOfNote || "undated";
    saveAs(blob, `promissory-note-${borrower}-${date}.docx`);
  };

  return (
    <ToolShell
      title="Promissory Note Generator"
      description="Create a legally formatted promissory note in seconds. Free online tool, download as Word document."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="borrowerName" className="block text-sm font-medium text-gray-700 mb-1">
              Borrower Name
            </label>
            <input
              type="text"
              id="borrowerName"
              name="borrowerName"
              value={formData.borrowerName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="lenderName" className="block text-sm font-medium text-gray-700 mb-1">
              Lender Name
            </label>
            <input
              type="text"
              id="lenderName"
              name="lenderName"
              value={formData.lenderName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="borrowerAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Borrower Address
            </label>
            <textarea
              id="borrowerAddress"
              name="borrowerAddress"
              rows={3}
              value={formData.borrowerAddress}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="lenderAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Lender Address
            </label>
            <textarea
              id="lenderAddress"
              name="lenderAddress"
              rows={3}
              value={formData.lenderAddress}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="principalAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Principal Amount
            </label>
            <input
              type="number"
              id="principalAmount"
              name="principalAmount"
              value={formData.principalAmount || ""}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencyOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate %
            </label>
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              value={formData.interestRate || ""}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateOfNote" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Note
            </label>
            <input
              type="date"
              id="dateOfNote"
              name="dateOfNote"
              value={formData.dateOfNote}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="maturityDate" className="block text-sm font-medium text-gray-700 mb-1">
              Maturity Date
            </label>
            <input
              type="date"
              id="maturityDate"
              name="maturityDate"
              value={formData.maturityDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Terms
            </label>
            <select
              id="paymentTerms"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Lump Sum at Maturity">Lump Sum at Maturity</option>
              <option value="Monthly Installments">Monthly Installments</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>
          <div>
            <label htmlFor="lateFee" className="block text-sm font-medium text-gray-700 mb-1">
              Late Fee (optional)
            </label>
            <input
              type="text"
              id="lateFee"
              name="lateFee"
              value={formData.lateFee}
              onChange={handleChange}
              placeholder="e.g. 5% of overdue amount"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
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
