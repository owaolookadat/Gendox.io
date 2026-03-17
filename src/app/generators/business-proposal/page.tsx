"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DocumentPreview from "@/components/DocumentPreview";
import { useDocumentFlow } from "@/hooks/useDocumentFlow";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import { generateBusinessProposal } from "@/lib/generators/business-proposal";
import { generateAIDocx } from "@/lib/generators/ai-docx";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BusinessProposalPage() {
  const seoData = getToolSeoContent("business-proposal");
  const relatedTools = getRelatedTools("business-proposal");
  const { isEditing, isPreviewing, showPreview, goBackToEdit } = useDocumentFlow();
  const { aiContent, isGenerating, error: aiError, generate, clearAI } = useAIGeneration();

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

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleGenerate = async () => {
    const result = await generate("business-proposal", {
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
    if (result) {
      showPreview();
    } else if (!aiError) {
      clearAI();
      showPreview();
    }
  };

  const handleTemplateFallback = () => {
    clearAI();
    showPreview();
  };

  const handleDownload = async () => {
    const todayISO = new Date().toISOString().split("T")[0];
    const filename = `business-proposal-${slugify(projectTitle)}-${todayISO}.docx`;

    if (aiContent) {
      const senderBlock: string[] = [];
      if (yourName.trim()) senderBlock.push(yourName.trim());
      if (yourTitle.trim()) senderBlock.push(yourTitle.trim());
      if (yourCompany.trim()) senderBlock.push(yourCompany.trim());

      const recipientBlock: string[] = [];
      if (clientName.trim()) recipientBlock.push(`Prepared for: ${clientName.trim()}${clientCompany.trim() ? ` at ${clientCompany.trim()}` : ""}`);
      recipientBlock.push(`Prepared by: ${yourName.trim()}${yourTitle.trim() ? `, ${yourTitle.trim()}` : ""}${yourCompany.trim() ? ` at ${yourCompany.trim()}` : ""}`);

      const blob = await generateAIDocx({
        title: projectTitle,
        content: aiContent,
        hasSections: true,
        senderBlock,
        recipientBlock,
        date: today,
      });
      saveAs(blob, filename);
    } else {
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
      saveAs(blob, filename);
    }
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Business Proposal Generator"
      description="Create a professional business proposal in minutes. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
      aiPowered
    >
      {isEditing && (
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

          <button
            onClick={handleGenerate}
            disabled={!canDownload || isGenerating}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              "Generate Business Proposal"
            )}
          </button>

          {aiError && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">{aiError}</p>
              <button
                onClick={handleTemplateFallback}
                disabled={!canDownload}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
              >
                Generate with Template
              </button>
            </div>
          )}
        </div>
      )}

      {isPreviewing && (
        <DocumentPreview
          documentTitle="Business Proposal Preview"
          onDownload={handleDownload}
          onEdit={goBackToEdit}
        >
          <div className="font-serif text-sm text-gray-800 leading-relaxed">
            {/* Project Title */}
            <h1 className="text-xl font-bold text-center mb-6">
              {projectTitle || "Business Proposal"}
            </h1>

            {/* Prepared for / by */}
            <div className="text-center mb-6 text-gray-600 text-xs">
              <p>
                Prepared for: {clientName}
                {clientCompany.trim() ? ` at ${clientCompany}` : ""}
              </p>
              <p>
                Prepared by: {yourName}
                {yourTitle.trim() ? `, ${yourTitle}` : ""}
                {yourCompany.trim() ? ` at ${yourCompany}` : ""}
              </p>
              <p>{today}</p>
            </div>

            {aiContent ? (
              /* AI-generated content with section headings rendered bold */
              <div>
                {aiContent.split(/\n\n+/).map((block, i) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;
                  const sectionMatch = trimmed.match(
                    /^([A-Z][A-Z &/'-]+):?\s*([\s\S]*)$/
                  );
                  if (sectionMatch) {
                    const heading = sectionMatch[1].replace(/:$/, "");
                    const body = sectionMatch[2].trim();
                    return (
                      <div key={i} className="mb-4">
                        <h2 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                          {heading}
                        </h2>
                        {body && (
                          <p className="whitespace-pre-line">{body}</p>
                        )}
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="mb-4 whitespace-pre-line">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            ) : (
              /* Template fallback — show form data organized by section */
              <div>
                {executiveSummary.trim() && (
                  <div className="mb-4">
                    <h2 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                      Executive Summary
                    </h2>
                    <p className="whitespace-pre-line">{executiveSummary}</p>
                  </div>
                )}
                {problemStatement.trim() && (
                  <div className="mb-4">
                    <h2 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                      Problem Statement
                    </h2>
                    <p className="whitespace-pre-line">{problemStatement}</p>
                  </div>
                )}
                {proposedSolution.trim() && (
                  <div className="mb-4">
                    <h2 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                      Proposed Solution
                    </h2>
                    <p className="whitespace-pre-line">{proposedSolution}</p>
                  </div>
                )}
                {deliverables.trim() && (
                  <div className="mb-4">
                    <h2 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                      Deliverables
                    </h2>
                    <p className="whitespace-pre-line">{deliverables}</p>
                  </div>
                )}
                {timeline.trim() && (
                  <div className="mb-4">
                    <h2 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                      Timeline
                    </h2>
                    <p className="whitespace-pre-line">{timeline}</p>
                  </div>
                )}
                {budgetPricing.trim() && (
                  <div className="mb-4">
                    <h2 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                      Budget / Pricing
                    </h2>
                    <p className="whitespace-pre-line">{budgetPricing}</p>
                  </div>
                )}
                {termsAndConditions.trim() && (
                  <div className="mb-4">
                    <h2 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-1 mb-2">
                      Terms & Conditions
                    </h2>
                    <p className="whitespace-pre-line">{termsAndConditions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DocumentPreview>
      )}
    </ToolShell>
  );
}
