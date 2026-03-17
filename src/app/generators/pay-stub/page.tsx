"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generatePayStub,
  calculatePayStub,
  PayStubData,
} from "@/lib/generators/pay-stub";
import { saveAs } from "file-saver";

const currencies = [
  { value: "GBP", label: "GBP \u00a3" },
  { value: "USD", label: "USD $" },
  { value: "EUR", label: "EUR \u20ac" },
  { value: "MYR", label: "MYR RM" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getCurrencySymbol(currency: string): string {
  switch (currency) {
    case "GBP": return "\u00a3";
    case "USD": return "$";
    case "EUR": return "\u20ac";
    case "MYR": return "RM ";
    default: return "\u00a3";
  }
}

export default function PayStubPage() {
  const seoData = getToolSeoContent("pay-stub");
  const relatedTools = getRelatedTools("pay-stub");
  const [companyName, setCompanyName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [payPeriodStart, setPayPeriodStart] = useState("");
  const [payPeriodEnd, setPayPeriodEnd] = useState("");
  const [payDate, setPayDate] = useState("");
  const [currency, setCurrency] = useState("GBP");
  const [basicSalary, setBasicSalary] = useState<number>(0);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [overtimeRate, setOvertimeRate] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);
  const [deductionTax, setDeductionTax] = useState<number>(0);
  const [deductionInsurance, setDeductionInsurance] = useState<number>(0);
  const [deductionPension, setDeductionPension] = useState<number>(0);
  const [deductionOther, setDeductionOther] = useState<number>(0);
  const [otherDeductionDescription, setOtherDeductionDescription] = useState("");
  const [ytdGross, setYtdGross] = useState<number>(0);
  const [ytdNet, setYtdNet] = useState<number>(0);

  const isValid =
    companyName && employeeName && employeeId && payPeriodStart && payPeriodEnd && payDate && basicSalary > 0;

  const stubData: PayStubData = {
    companyName, employeeName, employeeId, payPeriodStart, payPeriodEnd, payDate,
    currency, basicSalary, overtimeHours, overtimeRate, bonus,
    deductionTax, deductionInsurance, deductionPension, deductionOther,
    otherDeductionDescription, ytdGross, ytdNet,
  };

  const calc = calculatePayStub(stubData);
  const sym = getCurrencySymbol(currency);

  const handleDownload = async () => {
    const blob = await generatePayStub(stubData);
    const today = new Date().toISOString().split("T")[0];
    const filename = `pay-stub-${slugify(employeeName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Pay Stub Generator"
      description="Create a professional pay stub / payslip in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="companyName" className={labelClass}>Company Name</label>
          <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employeeName" className={labelClass}>Employee Name</label>
            <input id="employeeName" type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
          </div>
          <div>
            <label htmlFor="employeeId" className={labelClass}>Employee ID</label>
            <input id="employeeId" type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="EMP-001" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="payPeriodStart" className={labelClass}>Pay Period Start</label>
            <input id="payPeriodStart" type="date" value={payPeriodStart} onChange={(e) => setPayPeriodStart(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="payPeriodEnd" className={labelClass}>Pay Period End</label>
            <input id="payPeriodEnd" type="date" value={payPeriodEnd} onChange={(e) => setPayPeriodEnd(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="payDate" className={labelClass}>Pay Date</label>
            <input id="payDate" type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="currency" className={labelClass}>Currency</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
              {currencies.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="basicSalary" className={labelClass}>Basic Salary</label>
            <input id="basicSalary" type="number" value={basicSalary || ""} onChange={(e) => setBasicSalary(Number(e.target.value))} placeholder="3000" min="0" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="overtimeHours" className={labelClass}>Overtime Hours</label>
            <input id="overtimeHours" type="number" value={overtimeHours || ""} onChange={(e) => setOvertimeHours(Number(e.target.value))} placeholder="0" min="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="overtimeRate" className={labelClass}>Overtime Rate ({sym}/hr)</label>
            <input id="overtimeRate" type="number" value={overtimeRate || ""} onChange={(e) => setOvertimeRate(Number(e.target.value))} placeholder="0" min="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="bonus" className={labelClass}>Bonus</label>
            <input id="bonus" type="number" value={bonus || ""} onChange={(e) => setBonus(Number(e.target.value))} placeholder="0" min="0" className={inputClass} />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 pt-2">Deductions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="deductionTax" className={labelClass}>Tax</label>
            <input id="deductionTax" type="number" value={deductionTax || ""} onChange={(e) => setDeductionTax(Number(e.target.value))} placeholder="0" min="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="deductionInsurance" className={labelClass}>Insurance</label>
            <input id="deductionInsurance" type="number" value={deductionInsurance || ""} onChange={(e) => setDeductionInsurance(Number(e.target.value))} placeholder="0" min="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="deductionPension" className={labelClass}>Pension</label>
            <input id="deductionPension" type="number" value={deductionPension || ""} onChange={(e) => setDeductionPension(Number(e.target.value))} placeholder="0" min="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="deductionOther" className={labelClass}>Other Deduction</label>
            <input id="deductionOther" type="number" value={deductionOther || ""} onChange={(e) => setDeductionOther(Number(e.target.value))} placeholder="0" min="0" className={inputClass} />
          </div>
        </div>

        {deductionOther > 0 && (
          <div>
            <label htmlFor="otherDeductionDescription" className={labelClass}>
              Other Deduction Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input id="otherDeductionDescription" type="text" value={otherDeductionDescription} onChange={(e) => setOtherDeductionDescription(e.target.value)} placeholder="e.g. Union dues" className={inputClass} />
          </div>
        )}

        <h3 className="text-sm font-semibold text-gray-900 pt-2">Year-to-Date <span className="text-gray-400 font-normal">(optional)</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ytdGross" className={labelClass}>YTD Gross</label>
            <input id="ytdGross" type="number" value={ytdGross || ""} onChange={(e) => setYtdGross(Number(e.target.value))} placeholder="0" min="0" className={inputClass} />
          </div>
          <div>
            <label htmlFor="ytdNet" className={labelClass}>YTD Net</label>
            <input id="ytdNet" type="number" value={ytdNet || ""} onChange={(e) => setYtdNet(Number(e.target.value))} placeholder="0" min="0" className={inputClass} />
          </div>
        </div>

        {basicSalary > 0 && (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Gross Pay</p>
                <p className="font-semibold text-gray-900">{sym}{calc.grossPay.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Deductions</p>
                <p className="font-semibold text-red-600">-{sym}{calc.totalDeductions.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Net Pay</p>
                <p className="font-semibold text-green-600">{sym}{calc.netPay.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Pay Stub" />
      </div>
    </ToolShell>
  );
}
