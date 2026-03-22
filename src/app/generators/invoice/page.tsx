"use client";

import { useState, useRef, useEffect } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DocumentPreview from "@/components/DocumentPreview";
import { useDocumentFlow } from "@/hooks/useDocumentFlow";
import {
  generateInvoice,
  LineItem,
  PaymentDetails,
} from "@/lib/generators/invoice";
import { saveAs } from "file-saver";

const CURRENCIES = [
  { label: "GBP", value: "GBP", symbol: "\u00a3" },
  { label: "USD", value: "USD", symbol: "$" },
  { label: "EUR", value: "EUR", symbol: "\u20ac" },
  { label: "MYR", value: "MYR", symbol: "RM" },
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

const emptyItem = (): LineItem => ({
  description: "",
  quantity: 1,
  unitPrice: 0,
});

function RequiredMark() {
  return <span className="text-red-500 ml-0.5" aria-label="required">*</span>;
}

export default function InvoicePage() {
  const seoData = getToolSeoContent("invoice");
  const relatedTools = getRelatedTools("invoice");
  const { isEditing, isPreviewing, showPreview, goBackToEdit } = useDocumentFlow();

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(todayString);
  const [dueDate, setDueDate] = useState(plus30Days);
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [lineItems, setLineItems] = useState<LineItem[]>([emptyItem()]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    bankName: "",
    accountNumber: "",
    sortCode: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const newRowRef = useRef<HTMLInputElement>(null);
  const shouldFocusNew = useRef(false);

  const currency = CURRENCIES[currencyIndex];

  useEffect(() => {
    if (shouldFocusNew.current && newRowRef.current) {
      newRowRef.current.focus();
      shouldFocusNew.current = false;
    }
  });

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const updateItem = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    if (lineItems.length < 10) {
      shouldFocusNew.current = true;
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
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const hasValidItems = lineItems.some(
    (item) => item.description.trim() !== "" && item.unitPrice > 0
  );

  const canDownload =
    businessName.trim() !== "" &&
    clientName.trim() !== "" &&
    hasValidItems;

  const handleDownload = async () => {
    const blob = await generateInvoice({
      businessName,
      email,
      address,
      clientName,
      clientAddress,
      invoiceNumber,
      invoiceDate,
      dueDate,
      currency: currency.value,
      currencySymbol: currency.symbol,
      lineItems: lineItems.filter(
        (item) => item.description.trim() !== "" && item.unitPrice > 0
      ),
      taxRate,
      notes,
      paymentDetails,
    });
    const filename = `invoice-${slugify(invoiceNumber)}-${slugify(clientName)}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const errorInputClass =
    "w-full border border-red-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500";

  const totalColor =
    total > 0 ? "text-blue-600" : "text-gray-400";

  const currencySymbol = currency.symbol;
  const bankName = paymentDetails.bankName;
  const accountNumber = paymentDetails.accountNumber;
  const sortCode = paymentDetails.sortCode;
  const items = lineItems;
  const businessEmail = email;
  const businessAddress = address;

  return (
    <ToolShell
      title="Invoice Generator"
      description="Create a professional invoice online for free. Add line items and download as Word document."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      {isEditing && (
      <div className="space-y-6">
        {/* Live Preview Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Invoice Total</p>
              <p className="text-xs text-blue-500 mt-0.5">
                {invoiceNumber}
                {clientName ? ` \u2014 ${clientName}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${totalColor} tracking-tight`}>
                {currency.symbol}
                {total.toFixed(2)}
              </p>
              {taxAmount > 0 && (
                <p className="text-xs text-blue-500 mt-0.5">
                  incl. {currency.symbol}
                  {taxAmount.toFixed(2)} tax
                </p>
              )}
            </div>
          </div>
          {lineItems.filter((i) => i.description.trim() && i.unitPrice > 0)
            .length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-500">
                {
                  lineItems.filter(
                    (i) => i.description.trim() && i.unitPrice > 0
                  ).length
                }{" "}
                line item
                {lineItems.filter(
                  (i) => i.description.trim() && i.unitPrice > 0
                ).length !== 1
                  ? "s"
                  : ""}{" "}
                &middot; Due {dueDate}
              </p>
            </div>
          )}
        </div>

        {/* Your Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Details
            </h2>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Logo placeholder */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-md border border-dashed border-gray-300 p-3">
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Your Logo
              </p>
              <p className="text-xs text-gray-400">Coming soon</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Your Name / Business Name
              <RequiredMark />
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              onBlur={() => markTouched("businessName")}
              placeholder="Acme Ltd"
              className={
                touched.businessName && !businessName.trim()
                  ? errorInputClass
                  : inputClass
              }
            />
            {touched.businessName && !businessName.trim() && (
              <p className="text-xs text-red-500 mt-1">
                Business name is required
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Your Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={"123 Business St\nLondon, UK"}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        {/* Client Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Client Details
            </h2>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <div>
            <label className={labelClass}>
              Client Name
              <RequiredMark />
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              onBlur={() => markTouched("clientName")}
              placeholder="Client Company"
              className={
                touched.clientName && !clientName.trim()
                  ? errorInputClass
                  : inputClass
              }
            />
            {touched.clientName && !clientName.trim() && (
              <p className="text-xs text-red-500 mt-1">
                Client name is required
              </p>
            )}
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
        </div>

        {/* Invoice Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Invoice Details
            </h2>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
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
                    {c.label} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Invoice Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Line Items
              <RequiredMark />
            </h2>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide px-1">
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">
              Price ({currency.symbol})
            </div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1" />
          </div>

          {lineItems.map((item, index) => {
            const lineTotal = item.quantity * item.unitPrice;
            const isLast = index === lineItems.length - 1;
            return (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 items-center bg-white rounded-md"
              >
                <div className="col-span-12 sm:col-span-5">
                  <input
                    ref={isLast ? newRowRef : undefined}
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    placeholder="Service or product"
                    className={inputClass}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        Math.max(1, Number(e.target.value))
                      )
                    }
                    className={`${inputClass} text-center`}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitPrice || ""}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unitPrice",
                          Math.max(0, Number(e.target.value))
                        )
                      }
                      placeholder="0.00"
                      className={`${inputClass} ${currency.symbol.length > 1 ? "pl-9" : "pl-7"} text-right`}
                    />
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-2 text-right text-sm font-semibold text-gray-800 px-2">
                  {currency.symbol}
                  {lineTotal.toFixed(2)}
                </div>
                <div className="col-span-1 text-center">
                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-7 h-7 inline-flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {lineItems.length < 10 && (
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium py-1.5 px-3 rounded-md hover:bg-blue-50 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Line Item
            </button>
          )}

          {!hasValidItems && touched.lineItems && (
            <p className="text-xs text-red-500">
              Add at least one item with a description and price
            </p>
          )}
        </div>

        {/* Tax */}
        <div>
          <label className={labelClass}>Tax Rate (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={taxRate || ""}
            onChange={(e) =>
              setTaxRate(Math.max(0, Number(e.target.value)))
            }
            placeholder="0"
            className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Totals Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium text-gray-900">
              {currency.symbol}
              {subtotal.toFixed(2)}
            </span>
          </div>
          {taxRate > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Tax ({taxRate}%)</span>
              <span className="font-medium text-gray-900">
                {currency.symbol}
                {taxAmount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-300 pt-2">
            <span className="font-bold text-gray-900 text-base">Total</span>
            <span className="font-bold text-blue-600 text-lg">
              {currency.symbol}
              {total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Details
            </h2>
            <span className="text-xs text-gray-400 font-normal">
              Optional
            </span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          <p className="text-xs text-gray-500 -mt-2">
            Include bank details on your invoice so clients know where to pay.
          </p>

          <div>
            <label className={labelClass}>Bank Name</label>
            <input
              type="text"
              value={paymentDetails.bankName}
              onChange={(e) =>
                setPaymentDetails((prev) => ({
                  ...prev,
                  bankName: e.target.value,
                }))
              }
              placeholder="e.g. HSBC, Chase"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Account Number</label>
              <input
                type="text"
                value={paymentDetails.accountNumber}
                onChange={(e) =>
                  setPaymentDetails((prev) => ({
                    ...prev,
                    accountNumber: e.target.value,
                  }))
                }
                placeholder="12345678"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Sort Code / Routing #</label>
              <input
                type="text"
                value={paymentDetails.sortCode}
                onChange={(e) =>
                  setPaymentDetails((prev) => ({
                    ...prev,
                    sortCode: e.target.value,
                  }))
                }
                placeholder="12-34-56"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment terms, late fees, or other notes..."
            rows={3}
            className={inputClass}
          />
        </div>

        {/* Validation summary */}
        {!canDownload && Object.keys(touched).length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            <p className="font-medium">Before you can download:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
              {!businessName.trim() && (
                <li>Enter your business name</li>
              )}
              {!clientName.trim() && <li>Enter the client name</li>}
              {!hasValidItems && (
                <li>
                  Add at least one line item with a description and price
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Generate Invoice Button */}
        <button
          onClick={showPreview}
          disabled={!canDownload}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          Generate Invoice
        </button>
      </div>
      )}

      {isPreviewing && (
        <DocumentPreview documentTitle="Invoice Preview" onDownload={handleDownload} onEdit={goBackToEdit}>
          <div className="font-sans text-sm text-gray-800">
            {/* Header: business info left, INVOICE right */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="font-bold text-base">{businessName}</p>
                {businessEmail && <p className="text-xs text-gray-500">{businessEmail}</p>}
                {businessAddress && <p className="text-xs text-gray-500 whitespace-pre-line">{businessAddress}</p>}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">INVOICE</p>
                <p className="text-xs text-gray-500">#{invoiceNumber}</p>
                <p className="text-xs text-gray-500">Date: {invoiceDate}</p>
                <p className="text-xs text-gray-500">Due: {dueDate}</p>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-6">
              <p className="text-xs font-bold text-blue-600 uppercase mb-1">Bill To</p>
              <p className="font-semibold">{clientName}</p>
              {clientAddress && <p className="text-xs text-gray-500 whitespace-pre-line">{clientAddress}</p>}
            </div>

            {/* Line Items Table */}
            <table className="w-full mb-6 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-2 px-3 font-semibold">Description</th>
                  <th className="text-right py-2 px-3 font-semibold w-16">Qty</th>
                  <th className="text-right py-2 px-3 font-semibold w-24">Unit Price</th>
                  <th className="text-right py-2 px-3 font-semibold w-24">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(item => item.description).map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 px-3">{item.description}</td>
                    <td className="text-right py-2 px-3">{item.quantity}</td>
                    <td className="text-right py-2 px-3">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                    <td className="text-right py-2 px-3">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-48">
                <div className="flex justify-between py-1 text-xs">
                  <span>Subtotal</span>
                  <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between py-1 text-xs">
                    <span>Tax ({taxRate}%)</span>
                    <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-800 font-bold text-blue-600">
                  <span>Total</span>
                  <span>{currencySymbol}{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {(bankName || accountNumber || sortCode) && (
              <div className="mb-4">
                <p className="text-xs font-bold text-blue-600 uppercase mb-1">Payment Details</p>
                {bankName && <p className="text-xs">Bank: {bankName}</p>}
                {accountNumber && <p className="text-xs">Account: {accountNumber}</p>}
                {sortCode && <p className="text-xs">Sort Code: {sortCode}</p>}
              </div>
            )}

            {/* Notes */}
            {notes && (
              <div className="mt-4">
                <p className="text-xs font-bold text-blue-600 uppercase mb-1">Notes</p>
                <p className="text-xs text-gray-500 italic">{notes}</p>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-8">Thank you for your business!</p>
          </div>
        </DocumentPreview>
      )}
    </ToolShell>
  );
}
