"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateServiceAgreement,
  ServiceAgreementData,
} from "@/lib/generators/service-agreement";
import { saveAs } from "file-saver";

const paymentSchedules = [
  "On Completion",
  "Monthly",
  "Milestone-based",
  "Upfront",
];
const terminationPeriods = ["7 Days", "14 Days", "30 Days", "60 Days"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ServiceAgreementPage() {
  const [providerName, setProviderName] = useState("");
  const [providerAddress, setProviderAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentSchedule, setPaymentSchedule] = useState("On Completion");
  const [termDuration, setTermDuration] = useState("");
  const [terminationNoticePeriod, setTerminationNoticePeriod] =
    useState("30 Days");
  const [liabilityLimitation, setLiabilityLimitation] = useState("");
  const [governingLaw, setGoverningLaw] = useState("");

  const isValid =
    providerName &&
    providerAddress &&
    clientName &&
    clientAddress &&
    effectiveDate &&
    serviceDescription &&
    deliverables &&
    paymentAmount &&
    termDuration &&
    governingLaw;

  const handleDownload = async () => {
    const data: ServiceAgreementData = {
      providerName,
      providerAddress,
      clientName,
      clientAddress,
      effectiveDate,
      serviceDescription,
      deliverables,
      paymentAmount,
      paymentSchedule,
      termDuration,
      terminationNoticePeriod,
      liabilityLimitation,
      governingLaw,
    };
    const blob = await generateServiceAgreement(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `service-agreement-${slugify(providerName)}-${slugify(clientName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Service Agreement Generator"
      description="Generate a professional service agreement in seconds. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="providerName" className={labelClass}>
              Service Provider Name
            </label>
            <input
              id="providerName"
              type="text"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="Provider name or company"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="clientName" className={labelClass}>
              Client Name
            </label>
            <input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client name or company"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="providerAddress" className={labelClass}>
              Provider Address
            </label>
            <textarea
              id="providerAddress"
              value={providerAddress}
              onChange={(e) => setProviderAddress(e.target.value)}
              placeholder="Full address"
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="clientAddress" className={labelClass}>
              Client Address
            </label>
            <textarea
              id="clientAddress"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Full address"
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

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
          <label htmlFor="serviceDescription" className={labelClass}>
            Service Description
          </label>
          <textarea
            id="serviceDescription"
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            placeholder="Describe the services to be provided..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="deliverables" className={labelClass}>
            Deliverables
          </label>
          <textarea
            id="deliverables"
            value={deliverables}
            onChange={(e) => setDeliverables(e.target.value)}
            placeholder="List the deliverables..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="paymentAmount" className={labelClass}>
              Payment Amount
            </label>
            <input
              id="paymentAmount"
              type="text"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="e.g. $5,000 or $150/hour"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="paymentSchedule" className={labelClass}>
              Payment Schedule
            </label>
            <select
              id="paymentSchedule"
              value={paymentSchedule}
              onChange={(e) => setPaymentSchedule(e.target.value)}
              className={inputClass}
            >
              {paymentSchedules.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="termDuration" className={labelClass}>
              Term / Duration
            </label>
            <input
              id="termDuration"
              type="text"
              value={termDuration}
              onChange={(e) => setTermDuration(e.target.value)}
              placeholder="e.g. 6 months"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="terminationNoticePeriod" className={labelClass}>
              Termination Notice Period
            </label>
            <select
              id="terminationNoticePeriod"
              value={terminationNoticePeriod}
              onChange={(e) => setTerminationNoticePeriod(e.target.value)}
              className={inputClass}
            >
              {terminationPeriods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="liabilityLimitation" className={labelClass}>
            Liability Limitation{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="liabilityLimitation"
            value={liabilityLimitation}
            onChange={(e) => setLiabilityLimitation(e.target.value)}
            placeholder="Custom liability limitation clause (a standard clause will be used if left blank)..."
            rows={3}
            className={inputClass}
          />
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

        <DownloadButton
          onClick={handleDownload}
          disabled={!isValid}
          label="Download Service Agreement"
        />
      </div>
    </ToolShell>
  );
}
