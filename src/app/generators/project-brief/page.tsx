"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import { generateProjectBrief, ProjectBriefData } from "@/lib/generators/project-brief";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProjectBriefPage() {
  const seoData = getToolSeoContent("project-brief");
  const relatedTools = getRelatedTools("project-brief");
  const [projectName, setProjectName] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [date, setDate] = useState("");
  const [backgroundContext, setBackgroundContext] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [projectObjectives, setProjectObjectives] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [scope, setScope] = useState("");
  const [keyDeliverables, setKeyDeliverables] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [successMetrics, setSuccessMetrics] = useState("");
  const [stakeholders, setStakeholders] = useState("");
  const [risksConstraints, setRisksConstraints] = useState("");

  const isValid =
    projectName && projectOwner && date && backgroundContext && problemStatement &&
    projectObjectives && scope && keyDeliverables && timeline && successMetrics;

  const handleDownload = async () => {
    const data: ProjectBriefData = {
      projectName, projectOwner, date, backgroundContext, problemStatement,
      projectObjectives, targetAudience, scope, keyDeliverables, timeline,
      budget, successMetrics, stakeholders, risksConstraints,
    };
    const blob = await generateProjectBrief(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `project-brief-${slugify(projectName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Project Brief Generator"
      description="Create a professional project brief document in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="projectName" className={labelClass}>Project Name</label>
            <input id="projectName" type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Website Redesign" className={inputClass} />
          </div>
          <div>
            <label htmlFor="projectOwner" className={labelClass}>Project Owner</label>
            <input id="projectOwner" type="text" value={projectOwner} onChange={(e) => setProjectOwner(e.target.value)} placeholder="Jane Smith" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="date" className={labelClass}>Date</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="backgroundContext" className={labelClass}>Background / Context</label>
          <textarea id="backgroundContext" value={backgroundContext} onChange={(e) => setBackgroundContext(e.target.value)} placeholder="Provide background information and context for the project..." rows={4} className={inputClass} />
        </div>

        <div>
          <label htmlFor="problemStatement" className={labelClass}>Problem Statement</label>
          <textarea id="problemStatement" value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} placeholder="What problem does this project aim to solve?" rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="projectObjectives" className={labelClass}>Project Objectives</label>
          <textarea id="projectObjectives" value={projectObjectives} onChange={(e) => setProjectObjectives(e.target.value)} placeholder="What are the specific goals of this project?" rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="targetAudience" className={labelClass}>Target Audience <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea id="targetAudience" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="Who is the intended audience or end user?" rows={2} className={inputClass} />
        </div>

        <div>
          <label htmlFor="scope" className={labelClass}>Scope</label>
          <textarea id="scope" value={scope} onChange={(e) => setScope(e.target.value)} placeholder="Define what is in scope for this project..." rows={4} className={inputClass} />
        </div>

        <div>
          <label htmlFor="keyDeliverables" className={labelClass}>Key Deliverables</label>
          <textarea id="keyDeliverables" value={keyDeliverables} onChange={(e) => setKeyDeliverables(e.target.value)} placeholder="List the main deliverables expected from this project..." rows={4} className={inputClass} />
        </div>

        <div>
          <label htmlFor="timeline" className={labelClass}>Timeline</label>
          <textarea id="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="Key dates, phases, and deadlines..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="budget" className={labelClass}>Budget <span className="text-gray-400 font-normal">(optional)</span></label>
          <input id="budget" type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="$50,000" className={inputClass} />
        </div>

        <div>
          <label htmlFor="successMetrics" className={labelClass}>Success Metrics</label>
          <textarea id="successMetrics" value={successMetrics} onChange={(e) => setSuccessMetrics(e.target.value)} placeholder="How will success be measured?" rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="stakeholders" className={labelClass}>Stakeholders <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea id="stakeholders" value={stakeholders} onChange={(e) => setStakeholders(e.target.value)} placeholder="Key stakeholders and their roles..." rows={3} className={inputClass} />
        </div>

        <div>
          <label htmlFor="risksConstraints" className={labelClass}>Risks & Constraints <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea id="risksConstraints" value={risksConstraints} onChange={(e) => setRisksConstraints(e.target.value)} placeholder="Known risks, constraints, or dependencies..." rows={3} className={inputClass} />
        </div>

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Project Brief" />
      </div>
    </ToolShell>
  );
}
