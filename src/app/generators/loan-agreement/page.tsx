"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateLoanAgreement,
  LoanAgreementData,
} from "@/lib/generators/loan-agreement";
import { saveAs } from "file-saver";

const currencies = [
  { label: "GBP (£)", value: "GBP", symbol: "£" },
  { label: "USD ($)", value: "USD", symbol: "$" },
  { label: "EUR (€)", value: "EUR", symbol: "€" },
  { label: "MYR (RM)", value: "MYR", symbol: "RM" },
];
const repaymentSchedules = ["Lump Sum", "Monthly", "Quarterly", "Annual"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function LoanAgreementPage() {
  const seoData = getToolSeoContent("loan-agreement");
  const relatedTools = getRelatedTools("loan-agreement");
  const [lenderName, setLenderName] = useState("");
  const [lenderAddress, setLenderAddress] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowerAddress, setBorrowerAddress] = useState("");
  const [loanAmount, setLoanAmount] = useState<number | "">("");
  const [currency, setCurrency] = useState("GBP");
  const [interestRate, setInterestRate] = useState<number | "">("");
  const [loanDate, setLoanDate] = useState("");
  const [repaymentDate, setRepaymentDate] = useState("");
  const [repaymentSchedule, setRepaymentSchedule] = useState("Monthly");
  const [purposeOfLoan, setPurposeOfLoan] = useState("");
  const [collateral, setCollateral] = useState("");
  const [latePaymentFee, setLatePaymentFee] = useState("");
  const [governingLaw, setGoverningLaw] = useState("");

  const currencySymbol =
    currencies.find((c) => c.value === currency)?.symbol || "£";

  const isValid =
    lenderName &&
    lenderAddress &&
    borrowerName &&
    borrowerAddress &&
    loanAmount &&
    interestRate !== "" &&
    loanDate &&
    repaymentDate &&
    governingLaw;

  const handleDownload = async () => {
    const data: LoanAgreementData = {
      lenderName,
      lenderAddress,
      borrowerName,
      borrowerAddress,
      loanAmount: Number(loanAmount),
      currency,
      currencySymbol,
      interestRate: Number(interestRate),
      loanDate,
      repaymentDate,
      repaymentSchedule,
      purposeOfLoan,
      collateral,
      latePaymentFee,
      governingLaw,
    };
    const blob = await generateLoanAgreement(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `loan-agreement-${slugify(borrowerName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Loan Agreement Generator"
      description="Generate a professional loan agreement in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lenderName" className={labelClass}>
              Lender Name
            </label>
            <input
              id="lenderName"
              type="text"
              value={lenderName}
              onChange={(e) => setLenderName(e.target.value)}
              placeholder="Full name or company"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="borrowerName" className={labelClass}>
              Borrower Name
            </label>
            <input
              id="borrowerName"
              type="text"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              placeholder="Full name or company"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lenderAddress" className={labelClass}>
              Lender Address
            </label>
            <textarea
              id="lenderAddress"
              value={lenderAddress}
              onChange={(e) => setLenderAddress(e.target.value)}
              placeholder="Full address"
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="borrowerAddress" className={labelClass}>
              Borrower Address
            </label>
            <textarea
              id="borrowerAddress"
              value={borrowerAddress}
              onChange={(e) => setBorrowerAddress(e.target.value)}
              placeholder="Full address"
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="loanAmount" className={labelClass}>
              Loan Amount
            </label>
            <input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) =>
                setLoanAmount(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="e.g. 10000"
              className={inputClass}
            />
          </div>
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
            <label htmlFor="interestRate" className={labelClass}>
              Interest Rate (%)
            </label>
            <input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) =>
                setInterestRate(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="e.g. 5"
              step="0.1"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="loanDate" className={labelClass}>
              Loan Date
            </label>
            <input
              id="loanDate"
              type="date"
              value={loanDate}
              onChange={(e) => setLoanDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="repaymentDate" className={labelClass}>
              Repayment Date
            </label>
            <input
              id="repaymentDate"
              type="date"
              value={repaymentDate}
              onChange={(e) => setRepaymentDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="repaymentSchedule" className={labelClass}>
              Repayment Schedule
            </label>
            <select
              id="repaymentSchedule"
              value={repaymentSchedule}
              onChange={(e) => setRepaymentSchedule(e.target.value)}
              className={inputClass}
            >
              {repaymentSchedules.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="purposeOfLoan" className={labelClass}>
            Purpose of Loan{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="purposeOfLoan"
            value={purposeOfLoan}
            onChange={(e) => setPurposeOfLoan(e.target.value)}
            placeholder="Describe the purpose of the loan..."
            rows={2}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="collateral" className={labelClass}>
            Collateral{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="collateral"
            value={collateral}
            onChange={(e) => setCollateral(e.target.value)}
            placeholder="Describe any collateral securing the loan..."
            rows={2}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="latePaymentFee" className={labelClass}>
            Late Payment Fee{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="latePaymentFee"
            type="text"
            value={latePaymentFee}
            onChange={(e) => setLatePaymentFee(e.target.value)}
            placeholder="e.g. £50 or 5% of overdue amount"
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
          label="Download Loan Agreement"
        />
      </div>
    </ToolShell>
  );
}
