"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateQuotation,
  QuotationLineItem,
} from "@/lib/generators/quotation";
import { saveAs } from "file-saver";

const CURRENCIES = [
  { label: "GBP \u00a3", value: "GBP", symbol: "\u00a3" },
  { label: "USD $", value: "USD", symbol: "$" },
  { label: "EUR \u20ac", value: "EUR", symbol: "\u20ac" },
  { label: "MYR RM", value: "MYR", symbol: "RM" },
];

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

function plus30Days(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const emptyItem = (): QuotationLineItem => ({
  description: "",
  quantity: 1,
  unitPrice: 0,
});

export default function QuotationPage() {
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("QT-001");
  const [quoteDate, setQuoteDate] = useState(todayString);
  const [validUntil, setValidUntil] = useState(plus30Days);
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [lineItems, setLineItems] = useState<QuotationLineItem[]>([emptyItem()]);
  const [discountRate, setDiscountRate] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [notes, setNotes] = useState("");

  const currency = CURRENCIES[currencyIndex];

  const updateItem = (
    index: number,
    field: keyof QuotationLineItem,
    value: string | number
  ) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    if (lineItems.length < 10) {
      setLineItems((prev) => [...prev, emptyItem()]);
    }
  };

  const removeItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const discountAmount = subtotal * (discountRate / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (taxRate / 100);
  const total = afterDiscount + taxAmount;

  const canDownload =
    businessName.trim() !== "" &&
    clientName.trim() !== "" &&
    lineItems.some((item) => item.description.trim() !== "" && item.unitPrice > 0);

  const handleDownload = async () => {
    const blob = await generateQuotation({
      businessName,
      businessAddress,
      businessEmail,
      clientName,
      clientAddress,
      quoteNumber,
      quoteDate,
      validUntil,
      currency: currency.value,
      currencySymbol: currency.symbol,
      lineItems: lineItems.filter(
        (item) => item.description.trim() !== "" && item.unitPrice > 0
      ),
      discountRate,
      taxRate,
      termsAndConditions,
      notes,
    });
    const filename = `quotation-${slugify(quoteNumber)}-${slugify(clientName)}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Quotation Generator"
      description="Create a professional quotation online for free. Add line items and download as Word document."
      category="Document Generator"
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Business</h2>

        <div>
          <label className={labelClass}>Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Acme Ltd"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Business Address</label>
          <textarea
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            placeholder={"123 Business St\nLondon, UK"}
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Business Email</label>
          <input
            type="email"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Client Details</h2>

        <div>
          <label className={labelClass}>Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Client Company"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Client Address</label>
          <textarea
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            placeholder={"456 Client Ave\nManchester, UK"}
            rows={3}
            className={inputClass}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Quote Details</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Quote Number</label>
            <input
              type="text"
              value={quoteNumber}
              onChange={(e) => setQuoteNumber(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <select
              value={currencyIndex}
              onChange={(e) => setCurrencyIndex(Number(e.target.value))}
              className={inputClass}
            >
              {CURRENCIES.map((c, i) => (
                <option key={c.value} value={i}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Quote Date</label>
            <input
              type="date"
              value={quoteDate}
              onChange={(e) => setQuoteDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Valid Until</label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Line Items</h2>

        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase">
          <div className="col-span-5">Description</div>
          <div className="col-span-2">Qty</div>
          <div className="col-span-2">Unit Price</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-1"></div>
        </div>

        {lineItems.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-5">
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                placeholder="Service or product"
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, "quantity", Math.max(1, Number(e.target.value)))
                }
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                min={0}
                step="0.01"
                value={item.unitPrice || ""}
                onChange={(e) =>
                  updateItem(index, "unitPrice", Math.max(0, Number(e.target.value)))
                }
                placeholder="0.00"
                className={inputClass}
              />
            </div>
            <div className="col-span-2 text-sm text-gray-700 font-medium px-1">
              {currency.symbol}
              {(item.quantity * item.unitPrice).toFixed(2)}
            </div>
            <div className="col-span-1">
              {lineItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                  aria-label="Remove item"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        ))}

        {lineItems.length < 10 && (
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add Line Item
          </button>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className={labelClass}>Discount (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              step="0.1"
              value={discountRate || ""}
              onChange={(e) => setDiscountRate(Math.max(0, Number(e.target.value)))}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tax Rate (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              step="0.1"
              value={taxRate || ""}
              onChange={(e) => setTaxRate(Math.max(0, Number(e.target.value)))}
              placeholder="0"
              className={inputClass}
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-md p-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              {currency.symbol}
              {subtotal.toFixed(2)}
            </span>
          </div>
          {discountRate > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Discount ({discountRate}%)</span>
              <span className="font-medium text-red-600">
                -{currency.symbol}
                {discountAmount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Tax ({taxRate}%)</span>
            <span className="font-medium text-gray-900">
              {currency.symbol}
              {taxAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-1">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-bold text-gray-900 text-base">
              {currency.symbol}
              {total.toFixed(2)}
            </span>
          </div>
        </div>

        <div>
          <label className={labelClass}>Terms & Conditions (optional)</label>
          <textarea
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            placeholder="Payment terms, delivery conditions..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
            rows={3}
            className={inputClass}
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!canDownload} />
      </div>
    </ToolShell>
  );
}
