"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import { generateReceipt, ReceiptLineItem } from "@/lib/generators/receipt";
import { saveAs } from "file-saver";

const CURRENCIES = [
  { label: "GBP \u00a3", value: "GBP", symbol: "\u00a3" },
  { label: "USD $", value: "USD", symbol: "$" },
  { label: "EUR \u20ac", value: "EUR", symbol: "\u20ac" },
  { label: "MYR RM", value: "MYR", symbol: "RM" },
];

const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "PayPal", "Other"];

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const emptyItem = (): ReceiptLineItem => ({
  description: "",
  quantity: 1,
  unitPrice: 0,
});

export default function ReceiptPage() {
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("RCT-001");
  const [date, setDate] = useState(todayString);
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [lineItems, setLineItems] = useState<ReceiptLineItem[]>([emptyItem()]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");

  const currency = CURRENCIES[currencyIndex];

  const updateItem = (
    index: number,
    field: keyof ReceiptLineItem,
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
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const canDownload =
    businessName.trim() !== "" &&
    customerName.trim() !== "" &&
    lineItems.some((item) => item.description.trim() !== "" && item.unitPrice > 0);

  const handleDownload = async () => {
    const blob = await generateReceipt({
      businessName,
      businessAddress,
      customerName,
      receiptNumber,
      date,
      currency: currency.value,
      currencySymbol: currency.symbol,
      paymentMethod,
      lineItems: lineItems.filter(
        (item) => item.description.trim() !== "" && item.unitPrice > 0
      ),
      taxRate,
      notes,
    });
    const filename = `receipt-${slugify(receiptNumber)}-${slugify(customerName)}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Receipt Generator"
      description="Create a professional receipt online for free. Add items and download as Word document."
      category="Document Generator"
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Business Details</h2>

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

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Customer Details</h2>

        <div>
          <label className={labelClass}>Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="John Smith"
            className={inputClass}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Receipt Details</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Receipt Number</label>
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className={labelClass}>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={inputClass}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Items</h2>

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
                placeholder="Item description"
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
            + Add Item
          </button>
        )}

        <div className="pt-2">
          <label className={labelClass}>Tax Rate (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={taxRate || ""}
            onChange={(e) => setTaxRate(Math.max(0, Number(e.target.value)))}
            placeholder="0"
            className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="bg-gray-50 rounded-md p-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              {currency.symbol}
              {subtotal.toFixed(2)}
            </span>
          </div>
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
          <label className={labelClass}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Thank you for your purchase..."
            rows={3}
            className={inputClass}
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!canDownload} />
      </div>
    </ToolShell>
  );
}
