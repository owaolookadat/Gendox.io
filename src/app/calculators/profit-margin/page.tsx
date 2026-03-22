"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ShieldCheck, Zap, TrendingUp, TrendingDown, Minus, Copy, Check } from "lucide-react";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercent(value: number): string {
  if (!isFinite(value)) return "—";
  return value.toFixed(1) + "%";
}

type HealthColor = "green" | "amber" | "red" | "neutral";

function getMarginHealth(margin: number): HealthColor {
  if (!isFinite(margin)) return "neutral";
  if (margin >= 20) return "green";
  if (margin >= 10) return "amber";
  return "red";
}

const healthStyles: Record<HealthColor, string> = {
  green: "bg-green-50 border-green-200 text-green-800",
  amber: "bg-amber-50 border-amber-200 text-amber-800",
  red: "bg-red-50 border-red-200 text-red-800",
  neutral: "bg-gray-50 border-gray-200 text-gray-600",
};

const healthBadgeStyles: Record<HealthColor, string> = {
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  neutral: "bg-gray-100 text-gray-500",
};

function HealthIcon({ color }: { color: HealthColor }) {
  if (color === "green") return <TrendingUp className="w-5 h-5 text-green-600" />;
  if (color === "red") return <TrendingDown className="w-5 h-5 text-red-600" />;
  if (color === "amber") return <Minus className="w-5 h-5 text-amber-600" />;
  return null;
}

export default function ProfitMarginCalculator() {
  const [revenue, setRevenue] = useState("");
  const [cogs, setCogs] = useState("");
  const [opex, setOpex] = useState("");
  const [currency, setCurrency] = useState("£");

  const results = useMemo(() => {
    const rev = parseFloat(revenue) || 0;
    const cost = parseFloat(cogs) || 0;
    const expenses = parseFloat(opex) || 0;

    const grossProfit = rev - cost;
    const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
    const netProfit = rev - cost - expenses;
    const netMargin = rev > 0 ? (netProfit / rev) * 100 : 0;
    const markup = cost > 0 ? (grossProfit / cost) * 100 : 0;

    return {
      grossProfit,
      grossMargin,
      netProfit,
      netMargin,
      markup,
      hasInput: rev > 0 || cost > 0,
    };
  }, [revenue, cogs, opex]);

  const grossColor = getMarginHealth(results.grossMargin);
  const netColor = getMarginHealth(results.netMargin);
  const [copied, setCopied] = useState(false);

  const copyResults = useCallback(() => {
    if (!results.hasInput) return;
    const text = [
      `Gross Profit: ${currency}${formatCurrency(results.grossProfit)}`,
      `Gross Margin: ${formatPercent(results.grossMargin)}`,
      `Net Profit: ${currency}${formatCurrency(results.netProfit)}`,
      `Net Margin: ${formatPercent(results.netMargin)}`,
      `Markup: ${formatPercent(results.markup)}`,
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [results, currency]);

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-1">/</span>
        <span>Calculator</span>
        <span className="mx-1">/</span>
        <span className="text-gray-900">Profit Margin Calculator</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Profit Margin Calculator
      </h1>
      <p className="text-gray-600 mb-4">
        Calculate gross profit margin, net profit margin, and markup instantly.
        Free online calculator, no sign-up required.
      </p>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          100% Free
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Zap className="w-3.5 h-3.5" />
          Live Calculation
        </span>
      </div>

      {/* Input card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Enter Your Numbers</h2>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="£">GBP (£)</option>
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="RM">MYR (RM)</option>
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="revenue" className={labelClass}>
              Revenue / Selling Price ({currency})
            </label>
            <input
              id="revenue"
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="e.g. 10000"
              min="0"
              step="0.01"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="cogs" className={labelClass}>
              Cost of Goods Sold / Cost Price ({currency})
            </label>
            <input
              id="cogs"
              type="number"
              value={cogs}
              onChange={(e) => setCogs(e.target.value)}
              placeholder="e.g. 6000"
              min="0"
              step="0.01"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="opex" className={labelClass}>
              Operating Expenses ({currency}){" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="opex"
              type="number"
              value={opex}
              onChange={(e) => setOpex(e.target.value)}
              placeholder="e.g. 2000"
              min="0"
              step="0.01"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Gross Profit Section */}
        <div className={`rounded-xl border p-5 ${results.hasInput ? healthStyles[grossColor] : healthStyles.neutral}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide opacity-75">Gross Profit</h3>
            {results.hasInput && <HealthIcon color={grossColor} />}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs opacity-60 mb-1">Gross Profit</p>
              <p className="text-2xl font-bold">
                {currency}{formatCurrency(results.grossProfit)}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-1">Gross Margin</p>
              <p className="text-2xl font-bold">{formatPercent(results.grossMargin)}</p>
              {results.hasInput && (
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${healthBadgeStyles[grossColor]}`}>
                  {grossColor === "green" ? "Healthy" : grossColor === "amber" ? "Moderate" : "Low"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Net Profit Section */}
        <div className={`rounded-xl border p-5 ${results.hasInput ? healthStyles[netColor] : healthStyles.neutral}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide opacity-75">Net Profit</h3>
            {results.hasInput && <HealthIcon color={netColor} />}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs opacity-60 mb-1">Net Profit</p>
              <p className="text-2xl font-bold">
                {currency}{formatCurrency(results.netProfit)}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-1">Net Margin</p>
              <p className="text-2xl font-bold">{formatPercent(results.netMargin)}</p>
              {results.hasInput && (
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${healthBadgeStyles[netColor]}`}>
                  {netColor === "green" ? "Healthy" : netColor === "amber" ? "Moderate" : "Low"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Markup */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Markup Percentage</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercent(results.markup)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">
                Markup = (Gross Profit / Cost) &times; 100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copy results */}
      {results.hasInput && (
        <button
          onClick={copyResults}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied to clipboard!" : "Copy results"}
        </button>
      )}

      {/* Formulas reference */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">How It&apos;s Calculated</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">Gross Profit</span>
            <span>= Revenue &minus; Cost of Goods Sold</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">Gross Margin %</span>
            <span>= (Gross Profit / Revenue) &times; 100</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">Net Profit</span>
            <span>= Revenue &minus; COGS &minus; Operating Expenses</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">Net Margin %</span>
            <span>= (Net Profit / Revenue) &times; 100</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">Markup %</span>
            <span>= (Gross Profit / COGS) &times; 100</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            <strong>Tip:</strong> A gross margin above 20% is generally considered healthy.
            Between 10-20% is moderate, and below 10% may indicate pricing or cost issues.
          </p>
        </div>
      </div>
    </div>
  );
}
