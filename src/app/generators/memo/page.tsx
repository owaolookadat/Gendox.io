"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import { generateMemo } from "@/lib/generators/memo";
import { saveAs } from "file-saver";

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const PRIORITIES = ["Normal", "High", "Urgent"];

export default function MemoPage() {
  const seoData = getToolSeoContent("memo");
  const relatedTools = getRelatedTools("memo");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [date, setDate] = useState(todayString);
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [body, setBody] = useState("");
  const [actionRequired, setActionRequired] = useState("");

  const canDownload =
    from.trim() !== "" &&
    to.trim() !== "" &&
    subject.trim() !== "" &&
    body.trim() !== "";

  const handleDownload = async () => {
    const blob = await generateMemo({
      from,
      to,
      cc,
      date,
      subject,
      priority,
      body,
      actionRequired,
    });
    const filename = `memo-${slugify(subject)}-${date}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Memo Generator"
      description="Create a professional internal memo in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Memo Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>From</label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="John Smith"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>To</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="All Staff / Jane Doe"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              CC{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="Bob Wilson"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Q1 Budget Review"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={inputClass}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Content</h2>

        <div>
          <label className={labelClass}>Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the main content of your memo..."
            rows={8}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Action Required{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={actionRequired}
            onChange={(e) => setActionRequired(e.target.value)}
            placeholder="Describe any actions required from the recipient..."
            rows={3}
            className={inputClass}
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!canDownload} />
      </div>
    </ToolShell>
  );
}
