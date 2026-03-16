"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import { generateBusinessProposal } from "@/lib/generators/business-proposal";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BusinessProposalPage() {
  const [yourName, setYourName] = useState("");
  const [yourTitle, setYourTitle] = useState("");
  const [yourCompany, setYourCompany] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budgetPricing, setBudgetPricing] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");

  const canDownload =
    yourName.trim() !== "" &&
    yourCompany.trim() !== "" &&
    clientName.trim() !== "" &&
    projectTitle.trim() !== "" &&
    executiveSummary.trim() !== "" &&
    proposedSolution.trim() !== "";

  const handleDownload = async () => {
    const blob = await generateBusinessProposal({
      yourName,
      yourTitle,
      yourCompany,
      clientName,
      clientCompany,
      projectTitle,
      executiveSummary,
      problemStatement,
      proposedSolution,
      deliverables,
      timeline,
      budgetPricing,
      termsAndConditions,
    });
    const today = new Date().toISOString().split("T")[0];
    const filename = `business-proposal-${slugify(projectTitle)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Business Proposal Generator"
      description="Create a professional business proposal in minutes. Download as Word document instantly."
      category="Document Generator"
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Your Name</label>
            <input
              type="text"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="John Smith"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Your Title</label>
            <input
              type="text"
              value={yourTitle}
              onChange={(e) => setYourTitle(e.target.value)}
              placeholder="Managing Director"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Your Company</label>
          <input
            type="text"
            value={yourCompany}
            onChange={(e) => setYourCompany(e.target.value)}
            placeholder="Acme Ltd"
            className={inputClass}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Client Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Jane Doe"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Client Company</label>
            <input
              type="text"
              value={clientCompany}
              onChange={(e) => setClientCompany(e.target.value)}
              placeholder="Client Corp"
              className={inputClass}
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-2">Proposal Content</h2>

        <div>
          <label className={labelClass}>Project Title</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Website Redesign Project"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Executive Summary</label>
          <textarea
            value={executiveSummary}
            onChange={(e) => setExecutiveSummary(e.target.value)}
            placeholder="Brief overview of the proposal and its key benefits..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Problem Statement</label>
          <textarea
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            placeholder="Describe the problem or challenge the client faces..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Proposed Solution</label>
          <textarea
            value={proposedSolution}
            onChange={(e) => setProposedSolution(e.target.value)}
            placeholder="Describe your proposed solution in detail..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Deliverables</label>
          <textarea
            value={deliverables}
            onChange={(e) => setDeliverables(e.target.value)}
            placeholder="List the key deliverables..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Timeline</label>
          <textarea
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="Project timeline and milestones..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Budget / Pricing</label>
          <textarea
            value={budgetPricing}
            onChange={(e) => setBudgetPricing(e.target.value)}
            placeholder="Pricing breakdown and payment schedule..."
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Terms & Conditions{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            placeholder="Any terms and conditions..."
            rows={3}
            className={inputClass}
          />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!canDownload} />
      </div>
    </ToolShell>
  );
}
