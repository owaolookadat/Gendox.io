"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generatePartnershipAgreement,
  PartnershipAgreementData,
} from "@/lib/generators/partnership-agreement";
import { saveAs } from "file-saver";

const durations = ["Indefinite", "1 Year", "2 Years", "5 Years"];
const disputeResolutions = ["Mediation", "Arbitration", "Litigation"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PartnershipAgreementPage() {
  const [partnershipName, setPartnershipName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [partner1Name, setPartner1Name] = useState("");
  const [partner1Address, setPartner1Address] = useState("");
  const [partner1Contribution, setPartner1Contribution] = useState("");
  const [partner1Ownership, setPartner1Ownership] = useState<number | "">("");
  const [partner2Name, setPartner2Name] = useState("");
  const [partner2Address, setPartner2Address] = useState("");
  const [partner2Contribution, setPartner2Contribution] = useState("");
  const [partner2Ownership, setPartner2Ownership] = useState<number | "">("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [purposeOfPartnership, setPurposeOfPartnership] = useState("");
  const [duration, setDuration] = useState("Indefinite");
  const [profitDistribution, setProfitDistribution] = useState("");
  const [decisionMaking, setDecisionMaking] = useState("");
  const [disputeResolution, setDisputeResolution] = useState("Mediation");
  const [governingLaw, setGoverningLaw] = useState("");

  const isValid =
    partnershipName &&
    businessType &&
    partner1Name &&
    partner1Address &&
    partner1Contribution &&
    partner1Ownership !== "" &&
    partner2Name &&
    partner2Address &&
    partner2Contribution &&
    partner2Ownership !== "" &&
    effectiveDate &&
    purposeOfPartnership &&
    profitDistribution &&
    governingLaw;

  const handleDownload = async () => {
    const data: PartnershipAgreementData = {
      partnershipName,
      businessType,
      partner1Name,
      partner1Address,
      partner1Contribution,
      partner1Ownership: Number(partner1Ownership),
      partner2Name,
      partner2Address,
      partner2Contribution,
      partner2Ownership: Number(partner2Ownership),
      effectiveDate,
      purposeOfPartnership,
      duration,
      profitDistribution,
      decisionMaking,
      disputeResolution,
      governingLaw,
    };
    const blob = await generatePartnershipAgreement(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `partnership-agreement-${slugify(partnershipName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Partnership Agreement Generator"
      description="Generate a professional partnership agreement in seconds. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="partnershipName" className={labelClass}>
              Partnership Name
            </label>
            <input
              id="partnershipName"
              type="text"
              value={partnershipName}
              onChange={(e) => setPartnershipName(e.target.value)}
              placeholder="e.g. Smith & Jones Partnership"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="businessType" className={labelClass}>
              Business Type
            </label>
            <input
              id="businessType"
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="e.g. Consulting, Retail, Technology"
              className={inputClass}
            />
          </div>
        </div>

        {/* Partner 1 */}
        <h3 className="text-sm font-semibold text-gray-800 pt-2">Partner 1</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="partner1Name" className={labelClass}>
              Name
            </label>
            <input
              id="partner1Name"
              type="text"
              value={partner1Name}
              onChange={(e) => setPartner1Name(e.target.value)}
              placeholder="Full name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="partner1Ownership" className={labelClass}>
              Ownership (%)
            </label>
            <input
              id="partner1Ownership"
              type="number"
              value={partner1Ownership}
              onChange={(e) =>
                setPartner1Ownership(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="e.g. 50"
              min={0}
              max={100}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="partner1Address" className={labelClass}>
            Address
          </label>
          <textarea
            id="partner1Address"
            value={partner1Address}
            onChange={(e) => setPartner1Address(e.target.value)}
            placeholder="Full address"
            rows={2}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="partner1Contribution" className={labelClass}>
            Contribution
          </label>
          <input
            id="partner1Contribution"
            type="text"
            value={partner1Contribution}
            onChange={(e) => setPartner1Contribution(e.target.value)}
            placeholder="e.g. £50,000 capital investment"
            className={inputClass}
          />
        </div>

        {/* Partner 2 */}
        <h3 className="text-sm font-semibold text-gray-800 pt-2">Partner 2</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="partner2Name" className={labelClass}>
              Name
            </label>
            <input
              id="partner2Name"
              type="text"
              value={partner2Name}
              onChange={(e) => setPartner2Name(e.target.value)}
              placeholder="Full name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="partner2Ownership" className={labelClass}>
              Ownership (%)
            </label>
            <input
              id="partner2Ownership"
              type="number"
              value={partner2Ownership}
              onChange={(e) =>
                setPartner2Ownership(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              placeholder="e.g. 50"
              min={0}
              max={100}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="partner2Address" className={labelClass}>
            Address
          </label>
          <textarea
            id="partner2Address"
            value={partner2Address}
            onChange={(e) => setPartner2Address(e.target.value)}
            placeholder="Full address"
            rows={2}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="partner2Contribution" className={labelClass}>
            Contribution
          </label>
          <input
            id="partner2Contribution"
            type="text"
            value={partner2Contribution}
            onChange={(e) => setPartner2Contribution(e.target.value)}
            placeholder="e.g. £50,000 capital investment"
            className={inputClass}
          />
        </div>

        {/* Partnership Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="effectiveDate" className={labelClass}>
              Effective Date
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
        </div>

        <div>
          <label htmlFor="purposeOfPartnership" className={labelClass}>
            Purpose of Partnership
          </label>
          <textarea
            id="purposeOfPartnership"
            value={purposeOfPartnership}
            onChange={(e) => setPurposeOfPartnership(e.target.value)}
            placeholder="Describe the purpose and goals of the partnership..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="profitDistribution" className={labelClass}>
            Profit Distribution
          </label>
          <textarea
            id="profitDistribution"
            value={profitDistribution}
            onChange={(e) => setProfitDistribution(e.target.value)}
            placeholder="Describe how profits and losses will be distributed..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="decisionMaking" className={labelClass}>
            Decision Making{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="decisionMaking"
            value={decisionMaking}
            onChange={(e) => setDecisionMaking(e.target.value)}
            placeholder="Describe decision making process (a standard clause will be used if left blank)..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="disputeResolution" className={labelClass}>
              Dispute Resolution
            </label>
            <select
              id="disputeResolution"
              value={disputeResolution}
              onChange={(e) => setDisputeResolution(e.target.value)}
              className={inputClass}
            >
              {disputeResolutions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="governingLaw" className={labelClass}>
              Governing Law
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

        <DownloadButton
          onClick={handleDownload}
          disabled={!isValid}
          label="Download Partnership Agreement"
        />
      </div>
    </ToolShell>
  );
}
