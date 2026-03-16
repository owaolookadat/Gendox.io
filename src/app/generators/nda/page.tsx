"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import { generateNDA, NDAData } from "@/lib/generators/nda";
import { saveAs } from "file-saver";

const durations = ["1 Year", "2 Years", "3 Years", "5 Years", "Indefinite"];

const defaultConfidentialInfo =
  "any and all non-public information, whether in oral, written, electronic, or other form, disclosed by one party to the other, including but not limited to: trade secrets, business plans, financial information, customer lists, technical data, product designs, marketing strategies, proprietary software, inventions, know-how, processes, and any other information designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="relative group inline-flex ml-1 cursor-help">
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs font-medium leading-none">
        ?
      </span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        {text}
      </span>
    </span>
  );
}

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-gray-200 pb-2 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
          {number}
        </span>
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1 ml-9">{subtitle}</p>
      )}
    </div>
  );
}

function RequiredIndicator() {
  return <span className="text-red-500 ml-0.5">*</span>;
}

export default function NDAPage() {
  const [agreementType, setAgreementType] = useState<"Mutual" | "One-Way">(
    "Mutual"
  );
  const [disclosingPartyName, setDisclosingPartyName] = useState("");
  const [disclosingPartyTitle, setDisclosingPartyTitle] = useState("");
  const [disclosingPartyAddress, setDisclosingPartyAddress] = useState("");
  const [receivingPartyName, setReceivingPartyName] = useState("");
  const [receivingPartyTitle, setReceivingPartyTitle] = useState("");
  const [receivingPartyAddress, setReceivingPartyAddress] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [purpose, setPurpose] = useState("");
  const [confidentialInfoDefinition, setConfidentialInfoDefinition] =
    useState(defaultConfidentialInfo);
  const [duration, setDuration] = useState("2 Years");
  const [governingLaw, setGoverningLaw] = useState("");
  const [additionalClauses, setAdditionalClauses] = useState("");

  const isValid =
    disclosingPartyName &&
    disclosingPartyAddress &&
    receivingPartyName &&
    receivingPartyAddress &&
    effectiveDate &&
    purpose &&
    confidentialInfoDefinition &&
    governingLaw;

  const handleDownload = async () => {
    const data: NDAData = {
      agreementType,
      disclosingPartyName,
      disclosingPartyTitle,
      disclosingPartyAddress,
      receivingPartyName,
      receivingPartyTitle,
      receivingPartyAddress,
      effectiveDate,
      purpose,
      confidentialInfoDefinition,
      duration,
      governingLaw,
      additionalClauses,
    };
    const blob = await generateNDA(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `nda-${slugify(disclosingPartyName)}-${slugify(receivingPartyName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const isMutual = agreementType === "Mutual";

  return (
    <ToolShell
      title="Non-Disclosure Agreement (NDA) Generator"
      description="Generate a professional, legally-structured NDA in seconds. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-8">
        {/* ── Section 1: Agreement Type ── */}
        <div>
          <SectionHeader
            number="1"
            title="Agreement Type"
            subtitle="Choose whether both parties share information, or only one party discloses."
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAgreementType("Mutual")}
              className={`relative rounded-lg border-2 p-4 text-center transition-all ${
                isMutual
                  ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {isMutual && (
                <span className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs">
                  &#10003;
                </span>
              )}
              <div className="text-2xl mb-1">&#8644;</div>
              <div className="font-semibold text-gray-900 text-sm">
                Mutual NDA
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Both parties share confidential info
              </div>
            </button>
            <button
              type="button"
              onClick={() => setAgreementType("One-Way")}
              className={`relative rounded-lg border-2 p-4 text-center transition-all ${
                !isMutual
                  ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {!isMutual && (
                <span className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs">
                  &#10003;
                </span>
              )}
              <div className="text-2xl mb-1">&#8594;</div>
              <div className="font-semibold text-gray-900 text-sm">
                One-Way NDA
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Only one party discloses information
              </div>
            </button>
          </div>
        </div>

        {/* ── Section 2: Parties ── */}
        <div>
          <SectionHeader
            number="2"
            title="Parties"
            subtitle="Enter the details of both parties entering this agreement."
          />

          {/* Party A / Disclosing Party */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              {isMutual ? "Party A" : "Disclosing Party"}
              <InfoTooltip
                text={
                  isMutual
                    ? "The first party in the mutual agreement. Both parties will share confidential information."
                    : "The party who will be sharing confidential information."
                }
              />
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="disclosingPartyName" className={labelClass}>
                    Full Name / Company Name
                    <RequiredIndicator />
                  </label>
                  <input
                    id="disclosingPartyName"
                    type="text"
                    value={disclosingPartyName}
                    onChange={(e) => setDisclosingPartyName(e.target.value)}
                    placeholder="e.g. Acme Corporation Ltd"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="disclosingPartyTitle" className={labelClass}>
                    Title / Role
                    <span className="text-gray-400 font-normal ml-1">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="disclosingPartyTitle"
                    type="text"
                    value={disclosingPartyTitle}
                    onChange={(e) => setDisclosingPartyTitle(e.target.value)}
                    placeholder="e.g. a company incorporated in England"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="disclosingPartyAddress"
                  className={labelClass}
                >
                  Address
                  <RequiredIndicator />
                </label>
                <textarea
                  id="disclosingPartyAddress"
                  value={disclosingPartyAddress}
                  onChange={(e) => setDisclosingPartyAddress(e.target.value)}
                  placeholder={"123 Business Street\nLondon, EC1A 1BB\nUnited Kingdom"}
                  rows={3}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Party B / Receiving Party */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              {isMutual ? "Party B" : "Receiving Party"}
              <InfoTooltip
                text={
                  isMutual
                    ? "The second party in the mutual agreement. Both parties will share confidential information."
                    : "The party who will be receiving and protecting the confidential information."
                }
              />
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="receivingPartyName" className={labelClass}>
                    Full Name / Company Name
                    <RequiredIndicator />
                  </label>
                  <input
                    id="receivingPartyName"
                    type="text"
                    value={receivingPartyName}
                    onChange={(e) => setReceivingPartyName(e.target.value)}
                    placeholder="e.g. Beta Ventures Inc"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="receivingPartyTitle" className={labelClass}>
                    Title / Role
                    <span className="text-gray-400 font-normal ml-1">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="receivingPartyTitle"
                    type="text"
                    value={receivingPartyTitle}
                    onChange={(e) => setReceivingPartyTitle(e.target.value)}
                    placeholder="e.g. a Delaware corporation"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="receivingPartyAddress"
                  className={labelClass}
                >
                  Address
                  <RequiredIndicator />
                </label>
                <textarea
                  id="receivingPartyAddress"
                  value={receivingPartyAddress}
                  onChange={(e) => setReceivingPartyAddress(e.target.value)}
                  placeholder={"456 Enterprise Avenue\nNew York, NY 10001\nUnited States"}
                  rows={3}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3: Agreement Terms ── */}
        <div>
          <SectionHeader
            number="3"
            title="Agreement Terms"
            subtitle="Define the scope, purpose, and duration of this agreement."
          />
          <div className="space-y-4">
            <div>
              <label htmlFor="purpose" className={labelClass}>
                Purpose of Disclosure
                <RequiredIndicator />
                <InfoTooltip text="Describe why confidential information will be shared. This limits how the receiving party can use the information." />
              </label>
              <textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="exploring a potential business relationship between the parties, including the evaluation of a possible strategic partnership, investment, or collaboration"
                rows={3}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="confidentialInfoDefinition"
                className={labelClass}
              >
                Definition of Confidential Information
                <RequiredIndicator />
                <InfoTooltip text="This defines exactly what information is protected by the NDA. The default covers most common scenarios, but you can customise it." />
              </label>
              <textarea
                id="confidentialInfoDefinition"
                value={confidentialInfoDefinition}
                onChange={(e) =>
                  setConfidentialInfoDefinition(e.target.value)
                }
                rows={5}
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">
                A comprehensive default definition is provided. Edit to match
                your specific needs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="effectiveDate" className={labelClass}>
                  Effective Date
                  <RequiredIndicator />
                  <InfoTooltip text="The date from which this NDA takes effect. Defaults to today." />
                </label>
                <input
                  id="effectiveDate"
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="duration" className={labelClass}>
                  Duration
                  <InfoTooltip text="How long the confidentiality obligations last. Choose 'Indefinite' for trade secrets or highly sensitive information." />
                </label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={inputClass}
                >
                  {durations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="governingLaw" className={labelClass}>
                  Governing Law
                  <RequiredIndicator />
                  <InfoTooltip text="The legal jurisdiction whose laws will govern this agreement. Use the country or state/province." />
                </label>
                <input
                  id="governingLaw"
                  type="text"
                  value={governingLaw}
                  onChange={(e) => setGoverningLaw(e.target.value)}
                  placeholder="e.g. England and Wales"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 4: Additional Terms ── */}
        <div>
          <SectionHeader
            number="4"
            title="Additional Terms"
            subtitle="Optional. Add any custom clauses specific to your agreement."
          />
          <div>
            <label htmlFor="additionalClauses" className={labelClass}>
              Custom Clauses
              <span className="text-gray-400 font-normal ml-1">
                (optional)
              </span>
              <InfoTooltip text="Add any special terms not covered above. Separate multiple clauses with blank lines. These will appear as a numbered section in the document." />
            </label>
            <textarea
              id="additionalClauses"
              value={additionalClauses}
              onChange={(e) => setAdditionalClauses(e.target.value)}
              placeholder={"e.g. Non-solicitation of employees for 12 months after termination.\n\nNon-compete restrictions within the same industry for the duration of the agreement."}
              rows={4}
              className={inputClass}
            />
          </div>
        </div>

        {/* ── Download ── */}
        <div className="space-y-4">
          <DownloadButton
            onClick={handleDownload}
            disabled={!isValid}
            label="Download NDA"
          />
          {!isValid && (
            <p className="text-sm text-amber-600 text-center">
              Please fill in all required fields (marked with{" "}
              <span className="text-red-500">*</span>) to generate your NDA.
            </p>
          )}
        </div>

        {/* ── Legal Disclaimer ── */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 text-amber-500 text-lg">&#9888;</div>
            <div>
              <h4 className="text-sm font-semibold text-amber-800">
                Legal Disclaimer
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                This document is a template and is provided for informational
                purposes only. It does not constitute legal advice. This NDA
                should be reviewed by a qualified legal professional before use
                to ensure it meets your specific requirements and complies with
                applicable laws in your jurisdiction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
