"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DocumentPreview from "@/components/DocumentPreview";
import { useDocumentFlow } from "@/hooks/useDocumentFlow";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import { generateCompanyProfile, CompanyProfileData } from "@/lib/generators/company-profile";
import { generateAIDocx } from "@/lib/generators/ai-docx";
import { saveAs } from "file-saver";

const companyTypes = ["Private", "Public", "Non-Profit", "Government"];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CompanyProfilePage() {
  const seoData = getToolSeoContent("company-profile");
  const relatedTools = getRelatedTools("company-profile");
  const { isEditing, isPreviewing, showPreview, goBackToEdit } = useDocumentFlow();
  const { aiContent, isGenerating, error: aiError, generate, clearAI } = useAIGeneration();

  const [companyName, setCompanyName] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyType, setCompanyType] = useState("Private");
  const [numberOfEmployees, setNumberOfEmployees] = useState("");
  const [missionStatement, setMissionStatement] = useState("");
  const [companyOverview, setCompanyOverview] = useState("");
  const [productsServices, setProductsServices] = useState("");
  const [keyAchievements, setKeyAchievements] = useState("");
  const [leadershipTeam, setLeadershipTeam] = useState("");
  const [contactInformation, setContactInformation] = useState("");

  const isValid =
    companyName && foundedYear && headquarters && industry && numberOfEmployees &&
    missionStatement && companyOverview && productsServices && contactInformation;

  const handleGenerate = async () => {
    const result = await generate("company-profile", {
      companyName, foundedYear, headquarters, industry, companyType,
      numberOfEmployees, missionStatement, companyOverview, productsServices,
      keyAchievements, leadershipTeam, contactInformation,
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
    const today = new Date().toISOString().split("T")[0];
    const filename = `company-profile-${slugify(companyName)}-${today}.docx`;

    if (aiContent) {
      const detailLines: string[] = [];
      if (foundedYear) detailLines.push(`Founded: ${foundedYear}`);
      if (headquarters) detailLines.push(`Headquarters: ${headquarters}`);
      if (industry) detailLines.push(`Industry: ${industry}`);
      if (companyType) detailLines.push(`Company Type: ${companyType}`);
      if (numberOfEmployees) detailLines.push(`Employees: ${numberOfEmployees}`);
      if (contactInformation.trim()) {
        detailLines.push("");
        contactInformation.trim().split("\n").forEach((l) => detailLines.push(l));
      }

      const fullContent = aiContent + "\n\n" + "COMPANY DETAILS\n" + detailLines.join("\n");

      const blob = await generateAIDocx({
        title: `${companyName} - Company Profile`,
        content: fullContent,
        hasSections: true,
      });
      saveAs(blob, filename);
    } else {
      const data: CompanyProfileData = {
        companyName, foundedYear, headquarters, industry, companyType,
        numberOfEmployees, missionStatement, companyOverview, productsServices,
        keyAchievements, leadershipTeam, contactInformation,
      };
      const blob = await generateCompanyProfile(data);
      saveAs(blob, filename);
    }
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const subtitleParts: string[] = [];
  if (industry) subtitleParts.push(industry);
  if (companyType) subtitleParts.push(companyType);
  if (foundedYear) subtitleParts.push(`Est. ${foundedYear}`);

  return (
    <ToolShell
      title="Company Profile Generator"
      description="Create a professional company profile document in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
      aiPowered
    >
      {isEditing && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className={labelClass}>Company Name</label>
              <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" className={inputClass} />
            </div>
            <div>
              <label htmlFor="foundedYear" className={labelClass}>Founded Year</label>
              <input id="foundedYear" type="text" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} placeholder="2010" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="headquarters" className={labelClass}>Headquarters</label>
              <input id="headquarters" type="text" value={headquarters} onChange={(e) => setHeadquarters(e.target.value)} placeholder="London, UK" className={inputClass} />
            </div>
            <div>
              <label htmlFor="industry" className={labelClass}>Industry</label>
              <input id="industry" type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Technology" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyType" className={labelClass}>Company Type</label>
              <select id="companyType" value={companyType} onChange={(e) => setCompanyType(e.target.value)} className={inputClass}>
                {companyTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="numberOfEmployees" className={labelClass}>Number of Employees</label>
              <input id="numberOfEmployees" type="text" value={numberOfEmployees} onChange={(e) => setNumberOfEmployees(e.target.value)} placeholder="50-200" className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="missionStatement" className={labelClass}>Mission Statement</label>
            <textarea id="missionStatement" value={missionStatement} onChange={(e) => setMissionStatement(e.target.value)} placeholder="Our mission is to..." rows={3} className={inputClass} />
          </div>

          <div>
            <label htmlFor="companyOverview" className={labelClass}>Company Overview</label>
            <textarea id="companyOverview" value={companyOverview} onChange={(e) => setCompanyOverview(e.target.value)} placeholder="Describe what the company does, its history, and market position..." rows={4} className={inputClass} />
          </div>

          <div>
            <label htmlFor="productsServices" className={labelClass}>Products / Services</label>
            <textarea id="productsServices" value={productsServices} onChange={(e) => setProductsServices(e.target.value)} placeholder="Describe the main products or services offered..." rows={4} className={inputClass} />
          </div>

          <div>
            <label htmlFor="keyAchievements" className={labelClass}>Key Achievements <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea id="keyAchievements" value={keyAchievements} onChange={(e) => setKeyAchievements(e.target.value)} placeholder="Awards, milestones, notable accomplishments..." rows={3} className={inputClass} />
          </div>

          <div>
            <label htmlFor="leadershipTeam" className={labelClass}>Leadership Team <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea id="leadershipTeam" value={leadershipTeam} onChange={(e) => setLeadershipTeam(e.target.value)} placeholder="CEO: Jane Doe&#10;CTO: John Smith" rows={3} className={inputClass} />
          </div>

          <div>
            <label htmlFor="contactInformation" className={labelClass}>Contact Information</label>
            <textarea id="contactInformation" value={contactInformation} onChange={(e) => setContactInformation(e.target.value)} placeholder="Email: info@acme.com&#10;Phone: +44 20 1234 5678&#10;Website: www.acme.com" rows={3} className={inputClass} />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!isValid || isGenerating}
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
              "Generate Company Profile"
            )}
          </button>

          {aiError && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">{aiError}</p>
              <button
                onClick={handleTemplateFallback}
                disabled={!isValid}
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
          documentTitle="Company Profile Preview"
          onDownload={handleDownload}
          onEdit={goBackToEdit}
        >
          <div className="font-serif text-sm text-gray-800 leading-relaxed">
            {/* Company Name */}
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
              {companyName || "Company Name"}
            </h1>

            {/* Subtitle: industry, type, founded */}
            {subtitleParts.length > 0 && (
              <p className="text-xs text-gray-500 text-center mb-6">
                {subtitleParts.join("  |  ")}
              </p>
            )}

            {/* AI-generated content or template fallback */}
            {aiContent ? (
              aiContent
                .split(/\n\n+/)
                .filter(Boolean)
                .map((block, i) => {
                  // Check if this block looks like a section heading (ALL CAPS with optional colon)
                  const sectionMatch = block.match(/^([A-Z][A-Z &/'-]+):?\s*([\s\S]*)$/);
                  if (sectionMatch) {
                    const heading = sectionMatch[1].trim().replace(/:$/, "");
                    const bodyText = sectionMatch[2].trim();
                    return (
                      <div key={i} className="mb-4">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
                          {heading}
                        </h2>
                        {bodyText && (
                          <p className="whitespace-pre-line">{bodyText}</p>
                        )}
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="mb-4">{block}</p>
                  );
                })
            ) : (
              /* Template fallback: structured preview using raw form data */
              <>
                {missionStatement && (
                  <div className="mb-4">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
                      Mission Statement
                    </h2>
                    <p className="whitespace-pre-line">{missionStatement}</p>
                  </div>
                )}

                {companyOverview && (
                  <div className="mb-4">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
                      Company Overview
                    </h2>
                    <p className="whitespace-pre-line">{companyOverview}</p>
                  </div>
                )}

                {productsServices && (
                  <div className="mb-4">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
                      Products &amp; Services
                    </h2>
                    <p className="whitespace-pre-line">{productsServices}</p>
                  </div>
                )}

                {keyAchievements && (
                  <div className="mb-4">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
                      Key Achievements
                    </h2>
                    <p className="whitespace-pre-line">{keyAchievements}</p>
                  </div>
                )}

                {leadershipTeam && (
                  <div className="mb-4">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
                      Leadership Team
                    </h2>
                    <p className="whitespace-pre-line">{leadershipTeam}</p>
                  </div>
                )}
              </>
            )}

            {/* Footer: company details and contact info */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                {foundedYear && (
                  <>
                    <span className="font-medium text-gray-600">Founded:</span>
                    <span>{foundedYear}</span>
                  </>
                )}
                {headquarters && (
                  <>
                    <span className="font-medium text-gray-600">Headquarters:</span>
                    <span>{headquarters}</span>
                  </>
                )}
                {industry && (
                  <>
                    <span className="font-medium text-gray-600">Industry:</span>
                    <span>{industry}</span>
                  </>
                )}
                {companyType && (
                  <>
                    <span className="font-medium text-gray-600">Type:</span>
                    <span>{companyType}</span>
                  </>
                )}
                {numberOfEmployees && (
                  <>
                    <span className="font-medium text-gray-600">Employees:</span>
                    <span>{numberOfEmployees}</span>
                  </>
                )}
              </div>

              {contactInformation && (
                <div className="text-xs text-gray-500">
                  <span className="font-medium text-gray-600">Contact:</span>
                  <p className="whitespace-pre-line mt-0.5">{contactInformation}</p>
                </div>
              )}
            </div>
          </div>
        </DocumentPreview>
      )}
    </ToolShell>
  );
}
