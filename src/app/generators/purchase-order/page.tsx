"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generatePurchaseOrder,
  POLineItem,
} from "@/lib/generators/purchase-order";
import { saveAs } from "file-saver";

const CURRENCIES = [
  { label: "GBP \u00a3", value: "GBP", symbol: "\u00a3" },
  { label: "USD $", value: "USD", symbol: "$" },
  { label: "EUR \u20ac", value: "EUR", symbol: "\u20ac" },
  { label: "MYR RM", value: "MYR", symbol: "RM" },
];

const PAYMENT_TERMS = ["Net 30", "Net 60", "Net 90", "Due on Receipt"];

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

const emptyItem = (): POLineItem => ({
  description: "",
  quantity: 1,
  unitPrice: 0,
});

export default function PurchaseOrderPage() {
  const seoData = getToolSeoContent("purchase-order");
  const relatedTools = getRelatedTools("purchase-order");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [poNumber, setPoNumber] = useState("PO-001");
  const [orderDate, setOrderDate] = useState(todayString);
  const [deliveryDate, setDeliveryDate] = useState(plus30Days);
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [lineItems, setLineItems] = useState<POLineItem[]>([emptyItem()]);
  const [shippingCost, setShippingCost] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const currency = CURRENCIES[currencyIndex];

  const updateItem = (
    index: number,
    field: keyof POLineItem,
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
  const total = subtotal + taxAmount + shippingCost;

  const canDownload =
    companyName.trim() !== "" &&
    vendorName.trim() !== "" &&
    lineItems.some((item) => item.description.trim() !== "" && item.unitPrice > 0);

  const handleDownload = async () => {
    const blob = await generatePurchaseOrder({
      companyName,
      companyAddress,
      vendorName,
      vendorAddress,
      poNumber,
      orderDate,
      deliveryDate,
      currency: currency.value,
      currencySymbol: currency.symbol,
      lineItems: lineItems.filter(
        (item) => item.description.trim() !== "" && item.unitPrice > 0
      ),
      shippingCost,
      taxRate,
      paymentTerms,
      specialInstructions,
    });
    const filename = `purchase-order-${slugify(poNumber)}-${slugify(vendorName)}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Purchase Order Generator"
      description="Create a professional purchase order online for free. Add line items and download as Word document."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Company</h2>

        <div>
          <label className={labelClass}>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Ltd"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Company Address</label>
          <textarea
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            placeholder={"123 Business St\nLondon, UK"}
            rows={3}
            className={inputClass}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Vendor Details</h2>

        <div>
          <label className={labelClass}>Vendor Name</label>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="Supplier Inc"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Vendor Address</label>
          <textarea
            value={vendorAddress}
            onChange={(e) => setVendorAddress(e.target.value)}
            placeholder={"456 Vendor Ave\nManchester, UK"}
            rows={3}
            className={inputClass}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Order Details</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>PO Number</label>
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
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
            <label className={labelClass}>Order Date</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Delivery Date</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Payment Terms</label>
          <select
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            className={inputClass}
          >
            {PAYMENT_TERMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
            + Add Line Item
          </button>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className={labelClass}>Shipping Cost</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={shippingCost || ""}
              onChange={(e) => setShippingCost(Math.max(0, Number(e.target.value)))}
              placeholder="0.00"
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
          <div className="flex justify-between">
            <span className="text-gray-600">Tax ({taxRate}%)</span>
            <span className="font-medium text-gray-900">
              {currency.symbol}
              {taxAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-gray-900">
              {currency.symbol}
              {shippingCost.toFixed(2)}
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
          <label className={labelClass}>Special Instructions (optional)</label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Delivery instructions, packaging requirements..."
            rows={3}
            className={inputClass}
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!canDownload} />
      </div>
    </ToolShell>
  );
}
