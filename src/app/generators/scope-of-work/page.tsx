"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import { generateScopeOfWork, ScopeOfWorkData } from "@/lib/generators/scope-of-work";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ScopeOfWorkPage() {
  const seoData = getToolSeoContent("scope-of-work");
  const relatedTools = getRelatedTools("scope-of-work");
  const [projectTitle, setProjectTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerCompany, setProviderCompany] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budgetPaymentTerms, setBudgetPaymentTerms] = useState("");
  const [assumptions, setAssumptions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [includeSignatures, setIncludeSignatures] = useState(false);

  const isValid =
    projectTitle && clientName && clientCompany && providerName && providerCompany &&
    projectDescription && objectives && deliverables && timeline && budgetPaymentTerms &&
    acceptanceCriteria;

  const handleDownload = async () => {
    const data: ScopeOfWorkData = {
      projectTitle, clientName, clientCompany, providerName, providerCompany,
      projectDescription, objectives, deliverables, timeline, budgetPaymentTerms,
      assumptions, exclusions, acceptanceCriteria, includeSignatures,
    };
    const blob = await generateScopeOfWork(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `scope-of-work-${slugify(projectTitle)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Scope of Work Generator"
      description="Create a professional scope of work document in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="projectTitle" className={labelClass}>Project Title</label>
          <input id="projectTitle" type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Website Redesign Project" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="clientName" className={labelClass}>Client Name</label>
            <input id="clientName" type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Jane Smith" className={inputClass} />
          </div>
          <div>
            <label htmlFor="clientCompany" className={labelClass}>Client Company</label>
            <input id="clientCompany" type="text" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} placeholder="Acme Corp" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="providerName" className={labelClass}>Provider Name</label>
            <input id="providerName" type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="John Doe" className={inputClass} />
          </div>
          <div>
            <label htmlFor="providerCompany" className={labelClass}>Provider Company</label>
            <input id="providerCompany" type="text" value={providerCompany} onChange={(e) => setProviderCompany(e.target.value)} placeholder="Web Solutions Ltd" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="projectDescription" className={labelClass}>Project Description</label>
          <textarea id="projectDescription" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Describe the project scope and purpose..." rows={4} className={inputClass} />
        </div>

        <div>
          <label htmlFor="objectives" className={labelClass}>Objectives</label>
          <textarea id="objectives" value={objectives} onChange={(e) => setObjectives(e.target.value)} placeholder="What the project aims to achieve..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="deliverables" className={labelClass}>Deliverables <span className="text-gray-400 font-normal">(one per line)</span></label>
          <textarea id="deliverables" value={deliverables} onChange={(e) => setDeliverables(e.target.value)} placeholder="Homepage redesign&#10;Mobile responsive layout&#10;Content management system setup" rows={5} className={inputClass} />
        </div>

        <div>
          <label htmlFor="timeline" className={labelClass}>Timeline / Milestones</label>
          <textarea id="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="Phase 1: Discovery (2 weeks)&#10;Phase 2: Design (3 weeks)&#10;Phase 3: Development (4 weeks)" rows={4} className={inputClass} />
        </div>

        <div>
          <label htmlFor="budgetPaymentTerms" className={labelClass}>Budget / Payment Terms</label>
          <textarea id="budgetPaymentTerms" value={budgetPaymentTerms} onChange={(e) => setBudgetPaymentTerms(e.target.value)} placeholder="Total budget, payment schedule, and terms..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="assumptions" className={labelClass}>Assumptions <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea id="assumptions" value={assumptions} onChange={(e) => setAssumptions(e.target.value)} placeholder="Key assumptions the project is based on..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="exclusions" className={labelClass}>Exclusions — What&apos;s NOT Included <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea id="exclusions" value={exclusions} onChange={(e) => setExclusions(e.target.value)} placeholder="Items explicitly not part of this scope..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="acceptanceCriteria" className={labelClass}>Acceptance Criteria</label>
          <textarea id="acceptanceCriteria" value={acceptanceCriteria} onChange={(e) => setAcceptanceCriteria(e.target.value)} placeholder="How deliverables will be reviewed and accepted..." rows={3} className={inputClass} />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="includeSignatures"
            type="checkbox"
            checked={includeSignatures}
            onChange={(e) => setIncludeSignatures(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="includeSignatures" className="text-sm font-medium text-gray-700">Include signature lines</label>
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Scope of Work" />
      </div>
    </ToolShell>
  );
}
