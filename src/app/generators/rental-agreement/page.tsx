"use client";

import { useState, useEffect } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateRentalAgreement,
  RentalAgreementData,
} from "@/lib/generators/rental-agreement";
import { saveAs } from "file-saver";

const propertyTypes = [
  "Apartment",
  "House",
  "Flat",
  "Studio",
  "Room",
  "Townhouse",
  "Duplex",
  "Commercial",
];
const currencies = [
  { label: "GBP (\u00a3)", value: "GBP", symbol: "\u00a3" },
  { label: "USD ($)", value: "USD", symbol: "$" },
  { label: "EUR (\u20ac)", value: "EUR", symbol: "\u20ac" },
  { label: "MYR (RM)", value: "MYR", symbol: "RM" },
];
const paymentDueDays = ["1st", "5th", "10th", "15th", "20th", "25th", "Last day"];
const petPolicies = ["No Pets", "Pets Allowed", "With Deposit"];
const paymentMethods = [
  "Bank Transfer",
  "Standing Order",
  "Cash",
  "Check",
  "Other",
];
const renewalOptions = ["Month-to-Month", "Fixed", "None"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-200 pb-2 mb-4 mt-6 first:mt-0">
      <h3 className="text-base font-semibold text-gray-800">{children}</h3>
    </div>
  );
}

function FieldHelper({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-gray-400 mt-1">{children}</p>;
}

function RequiredDot() {
  return <span className="text-red-500 ml-0.5">*</span>;
}

export default function RentalAgreementPage() {
  // Landlord
  const [landlordName, setLandlordName] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");

  // Tenant
  const [tenantName, setTenantName] = useState("");
  const [tenantAddress, setTenantAddress] = useState("");

  // Property
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");

  // Lease terms
  const [leaseStartDate, setLeaseStartDate] = useState("");
  const [leaseEndDate, setLeaseEndDate] = useState("");
  const [renewalTerms, setRenewalTerms] = useState("Month-to-Month");

  // Financial
  const [monthlyRent, setMonthlyRent] = useState<number | "">("");
  const [currency, setCurrency] = useState("GBP");
  const [securityDeposit, setSecurityDeposit] = useState<number | "">("");
  const [depositMatchesRent, setDepositMatchesRent] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [lateFee, setLateFee] = useState("");
  const [paymentDueDay, setPaymentDueDay] = useState("1st");

  // Property rules
  const [utilitiesIncluded, setUtilitiesIncluded] = useState("");
  const [petPolicy, setPetPolicy] = useState("No Pets");
  const [additionalTerms, setAdditionalTerms] = useState("");

  const currencySymbol =
    currencies.find((c) => c.value === currency)?.symbol || "\u00a3";

  // Smart default: security deposit matches monthly rent
  useEffect(() => {
    if (depositMatchesRent && monthlyRent !== "") {
      setSecurityDeposit(Number(monthlyRent));
    }
  }, [monthlyRent, depositMatchesRent]);

  const isValid =
    landlordName.trim() &&
    landlordAddress.trim() &&
    tenantName.trim() &&
    tenantAddress.trim() &&
    propertyAddress.trim() &&
    monthlyRent &&
    securityDeposit !== "" &&
    leaseStartDate &&
    leaseEndDate;

  const handleDownload = async () => {
    const data: RentalAgreementData = {
      landlordName: landlordName.trim(),
      landlordAddress: landlordAddress.trim(),
      tenantName: tenantName.trim(),
      tenantAddress: tenantAddress.trim(),
      propertyAddress: propertyAddress.trim(),
      propertyType,
      monthlyRent: Number(monthlyRent),
      currency,
      currencySymbol,
      securityDeposit: Number(securityDeposit),
      leaseStartDate,
      leaseEndDate,
      paymentDueDay,
      paymentMethod,
      lateFee: lateFee.trim(),
      renewalTerms,
      utilitiesIncluded: utilitiesIncluded.trim(),
      petPolicy,
      additionalTerms: additionalTerms.trim(),
    };
    const blob = await generateRentalAgreement(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `rental-agreement-${slugify(tenantName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Rental Agreement Generator"
      description="Generate a professional rental/lease agreement in seconds. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-2">
        {/* ── Landlord Details ── */}
        <SectionHeader>Landlord Details</SectionHeader>
        <div>
          <label htmlFor="landlordName" className={labelClass}>
            Landlord Full Name <RequiredDot />
          </label>
          <input
            id="landlordName"
            type="text"
            value={landlordName}
            onChange={(e) => setLandlordName(e.target.value)}
            placeholder="e.g. John Smith"
            className={inputClass}
          />
          <FieldHelper>The property owner or authorised agent.</FieldHelper>
        </div>
        <div>
          <label htmlFor="landlordAddress" className={labelClass}>
            Landlord Address <RequiredDot />
          </label>
          <textarea
            id="landlordAddress"
            value={landlordAddress}
            onChange={(e) => setLandlordAddress(e.target.value)}
            placeholder={"123 Main Street\nLondon\nSW1A 1AA"}
            rows={3}
            className={inputClass}
          />
        </div>

        {/* ── Tenant Details ── */}
        <SectionHeader>Tenant Details</SectionHeader>
        <div>
          <label htmlFor="tenantName" className={labelClass}>
            Tenant Full Name <RequiredDot />
          </label>
          <input
            id="tenantName"
            type="text"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            placeholder="e.g. Jane Doe"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="tenantAddress" className={labelClass}>
            Tenant Current Address <RequiredDot />
          </label>
          <textarea
            id="tenantAddress"
            value={tenantAddress}
            onChange={(e) => setTenantAddress(e.target.value)}
            placeholder="Current residential address"
            rows={3}
            className={inputClass}
          />
          <FieldHelper>
            The tenant&apos;s address before moving into the rental property.
          </FieldHelper>
        </div>

        {/* ── Property Details ── */}
        <SectionHeader>Property Details</SectionHeader>
        <div>
          <label htmlFor="propertyAddress" className={labelClass}>
            Rental Property Address <RequiredDot />
          </label>
          <textarea
            id="propertyAddress"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            placeholder="Full address of the property being rented"
            rows={2}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="propertyType" className={labelClass}>
            Property Type
          </label>
          <select
            id="propertyType"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={inputClass}
          >
            {propertyTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* ── Lease Terms ── */}
        <SectionHeader>Lease Terms</SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="leaseStartDate" className={labelClass}>
              Lease Start Date <RequiredDot />
            </label>
            <input
              id="leaseStartDate"
              type="date"
              value={leaseStartDate}
              onChange={(e) => setLeaseStartDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="leaseEndDate" className={labelClass}>
              Lease End Date <RequiredDot />
            </label>
            <input
              id="leaseEndDate"
              type="date"
              value={leaseEndDate}
              onChange={(e) => setLeaseEndDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="renewalTerms" className={labelClass}>
            Renewal Terms
          </label>
          <select
            id="renewalTerms"
            value={renewalTerms}
            onChange={(e) => setRenewalTerms(e.target.value)}
            className={inputClass}
          >
            {renewalOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <FieldHelper>
            Month-to-Month auto-renews. Fixed requires a new agreement. None
            means the tenant must vacate.
          </FieldHelper>
        </div>

        {/* ── Financial Terms ── */}
        <SectionHeader>Financial Terms</SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="currency" className={labelClass}>
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={inputClass}
            >
              {currencies.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="monthlyRent" className={labelClass}>
              Monthly Rent ({currencySymbol}) <RequiredDot />
            </label>
            <input
              id="monthlyRent"
              type="number"
              min="0"
              step="0.01"
              value={monthlyRent}
              onChange={(e) =>
                setMonthlyRent(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="e.g. 1500"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="securityDeposit" className={labelClass}>
              Security Deposit ({currencySymbol}) <RequiredDot />
            </label>
            <input
              id="securityDeposit"
              type="number"
              min="0"
              step="0.01"
              value={securityDeposit}
              onChange={(e) => {
                setDepositMatchesRent(false);
                setSecurityDeposit(
                  e.target.value ? Number(e.target.value) : ""
                );
              }}
              placeholder="e.g. 1500"
              className={inputClass}
            />
            {depositMatchesRent && monthlyRent !== "" && (
              <FieldHelper>
                Auto-set to 1 month&apos;s rent. Edit to override.
              </FieldHelper>
            )}
          </div>
          <div>
            <label htmlFor="paymentDueDay" className={labelClass}>
              Rent Due Day
            </label>
            <select
              id="paymentDueDay"
              value={paymentDueDay}
              onChange={(e) => setPaymentDueDay(e.target.value)}
              className={inputClass}
            >
              {paymentDueDays.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <FieldHelper>
              Day of the month when rent is due.
            </FieldHelper>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="paymentMethod" className={labelClass}>
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={inputClass}
            >
              {paymentMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="lateFee" className={labelClass}>
              Late Fee ({currencySymbol}){" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="lateFee"
              type="text"
              value={lateFee}
              onChange={(e) => setLateFee(e.target.value)}
              placeholder="e.g. 50"
              className={inputClass}
            />
            <FieldHelper>
              Fee charged if rent is more than 5 days late.
            </FieldHelper>
          </div>
        </div>

        {/* ── Property Rules ── */}
        <SectionHeader>Property Rules</SectionHeader>
        <div>
          <label htmlFor="utilitiesIncluded" className={labelClass}>
            Utilities Included in Rent{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="utilitiesIncluded"
            value={utilitiesIncluded}
            onChange={(e) => setUtilitiesIncluded(e.target.value)}
            placeholder="e.g. Water, electricity, internet"
            rows={2}
            className={inputClass}
          />
          <FieldHelper>
            Leave blank if the tenant pays for all utilities separately.
          </FieldHelper>
        </div>
        <div>
          <label htmlFor="petPolicy" className={labelClass}>
            Pet Policy
          </label>
          <select
            id="petPolicy"
            value={petPolicy}
            onChange={(e) => setPetPolicy(e.target.value)}
            className={inputClass}
          >
            {petPolicies.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="additionalTerms" className={labelClass}>
            Additional Terms{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="additionalTerms"
            value={additionalTerms}
            onChange={(e) => setAdditionalTerms(e.target.value)}
            placeholder="Any additional clauses, conditions, or house rules..."
            rows={3}
            className={inputClass}
          />
          <FieldHelper>
            For example: no smoking, quiet hours, parking rules, garden
            maintenance responsibilities.
          </FieldHelper>
        </div>

        {/* ── Download ── */}
        <div className="pt-4">
          <DownloadButton
            onClick={handleDownload}
            disabled={!isValid}
            label="Download Rental Agreement"
          />
        </div>

        {/* ── Legal Disclaimer ── */}
        <div className="mt-6 rounded-md bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-xs text-amber-800">
            <strong>Disclaimer:</strong> This template is for informational
            purposes only and does not constitute legal advice. Laws governing
            rental agreements vary by jurisdiction. Consult a qualified legal
            professional for your specific situation before signing any
            agreement.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
