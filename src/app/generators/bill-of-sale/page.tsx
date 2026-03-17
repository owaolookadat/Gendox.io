"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import {
  generateBillOfSale,
  BillOfSaleData,
} from "@/lib/generators/bill-of-sale";
import { saveAs } from "file-saver";

const conditions = ["New", "Like New", "Good", "Fair", "As-Is"];
const currencies = [
  { label: "GBP (£)", value: "GBP", symbol: "£" },
  { label: "USD ($)", value: "USD", symbol: "$" },
  { label: "EUR (€)", value: "EUR", symbol: "€" },
  { label: "MYR (RM)", value: "MYR", symbol: "RM" },
];
const paymentMethods = ["Cash", "Card", "Bank Transfer", "Check"];
const warranties = ["None", "30 Days", "90 Days", "1 Year"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BillOfSalePage() {
  const seoData = getToolSeoContent("bill-of-sale");
  const relatedTools = getRelatedTools("bill-of-sale");
  const [sellerName, setSellerName] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [condition, setCondition] = useState("Good");
  const [salePrice, setSalePrice] = useState<number | "">("");
  const [currency, setCurrency] = useState("GBP");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [saleDate, setSaleDate] = useState("");
  const [warranty, setWarranty] = useState("None");
  const [additionalTerms, setAdditionalTerms] = useState("");

  const currencySymbol =
    currencies.find((c) => c.value === currency)?.symbol || "£";

  const isValid =
    sellerName &&
    sellerAddress &&
    buyerName &&
    buyerAddress &&
    itemDescription &&
    salePrice &&
    saleDate;

  const handleDownload = async () => {
    const data: BillOfSaleData = {
      sellerName,
      sellerAddress,
      buyerName,
      buyerAddress,
      itemDescription,
      serialNumber,
      condition,
      salePrice: Number(salePrice),
      currency,
      currencySymbol,
      paymentMethod,
      saleDate,
      warranty,
      additionalTerms,
    };
    const blob = await generateBillOfSale(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `bill-of-sale-${slugify(buyerName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Bill of Sale Generator"
      description="Generate a professional bill of sale in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sellerName" className={labelClass}>
              Seller Name
            </label>
            <input
              id="sellerName"
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              placeholder="Full name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="buyerName" className={labelClass}>
              Buyer Name
            </label>
            <input
              id="buyerName"
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Full name"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sellerAddress" className={labelClass}>
              Seller Address
            </label>
            <textarea
              id="sellerAddress"
              value={sellerAddress}
              onChange={(e) => setSellerAddress(e.target.value)}
              placeholder="Full address"
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="buyerAddress" className={labelClass}>
              Buyer Address
            </label>
            <textarea
              id="buyerAddress"
              value={buyerAddress}
              onChange={(e) => setBuyerAddress(e.target.value)}
              placeholder="Full address"
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="itemDescription" className={labelClass}>
            Item Description
          </label>
          <textarea
            id="itemDescription"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            placeholder="Describe the item being sold (make, model, year, etc.)..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="serialNumber" className={labelClass}>
              Serial Number{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="serialNumber"
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="e.g. VIN, serial number"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="condition" className={labelClass}>
              Condition
            </label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className={inputClass}
            >
              {conditions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="salePrice" className={labelClass}>
              Sale Price ({currencySymbol})
            </label>
            <input
              id="salePrice"
              type="number"
              value={salePrice}
              onChange={(e) =>
                setSalePrice(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="e.g. 5000"
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="saleDate" className={labelClass}>
              Sale Date
            </label>
            <input
              id="saleDate"
              type="date"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="warranty" className={labelClass}>
              Warranty
            </label>
            <select
              id="warranty"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              className={inputClass}
            >
              {warranties.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
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
            placeholder="Any additional terms or conditions..."
            rows={3}
            className={inputClass}
          />
        </div>

        <DownloadButton
          onClick={handleDownload}
          disabled={!isValid}
          label="Download Bill of Sale"
        />
      </div>
    </ToolShell>
  );
}
