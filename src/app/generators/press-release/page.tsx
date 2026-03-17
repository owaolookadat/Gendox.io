"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DocumentPreview from "@/components/DocumentPreview";
import { useDocumentFlow } from "@/hooks/useDocumentFlow";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import { generatePressRelease, PressReleaseData } from "@/lib/generators/press-release";
import { generateAIDocx } from "@/lib/generators/ai-docx";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function PressReleasePage() {
  const seoData = getToolSeoContent("press-release");
  const relatedTools = getRelatedTools("press-release");
  const { isEditing, isPreviewing, showPreview, goBackToEdit } = useDocumentFlow();
  const { aiContent, isGenerating, error: aiError, generate, clearAI } = useAIGeneration();

  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [cityLocation, setCityLocation] = useState("");
  const [bodyParagraph1, setBodyParagraph1] = useState("");
  const [bodyParagraph2, setBodyParagraph2] = useState("");
  const [bodyParagraph3, setBodyParagraph3] = useState("");
  const [boilerplate, setBoilerplate] = useState("");

  const isValid =
    companyName && companyAddress && contactName && contactEmail && contactPhone &&
    releaseDate && headline && cityLocation && bodyParagraph1 && bodyParagraph2 && boilerplate;

  const handleGenerate = async () => {
    const result = await generate("press-release", {
      companyName, companyAddress, contactName, contactEmail, contactPhone,
      releaseDate, headline, subheadline, cityLocation,
      bodyParagraph1, bodyParagraph2, bodyParagraph3, boilerplate,
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

  const formattedDate = releaseDate
    ? new Date(releaseDate + "T00:00:00").toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const handleDownload = async () => {
    const today = new Date().toISOString().split("T")[0];
    const filename = `press-release-${slugify(companyName)}-${today}.docx`;

    if (aiContent) {
      const contentParts: string[] = [];
      contentParts.push("FOR IMMEDIATE RELEASE");
      contentParts.push(formattedDate);
      contentParts.push("");
      contentParts.push(aiContent);
      contentParts.push("");
      contentParts.push("###");
      contentParts.push("");
      contentParts.push(`About ${companyName}`);
      contentParts.push(boilerplate);
      contentParts.push("");
      contentParts.push("Media Contact:");
      contentParts.push(contactName);
      contentParts.push(contactEmail);
      contentParts.push(contactPhone);

      const blob = await generateAIDocx({
        title: headline,
        content: contentParts.join("\n\n"),
      });
      saveAs(blob, filename);
    } else {
      const data: PressReleaseData = {
        companyName, companyAddress, contactName, contactEmail, contactPhone,
        releaseDate, headline, subheadline, cityLocation,
        bodyParagraph1, bodyParagraph2, bodyParagraph3, boilerplate,
      };
      const blob = await generatePressRelease(data);
      saveAs(blob, filename);
    }
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  // Build preview body paragraphs (fallback when AI is null)
  const fallbackParagraphs: string[] = [];
  if (bodyParagraph1) fallbackParagraphs.push(bodyParagraph1);
  if (bodyParagraph2) fallbackParagraphs.push(bodyParagraph2);
  if (bodyParagraph3) fallbackParagraphs.push(bodyParagraph3);

  return (
    <ToolShell
      title="Press Release Generator"
      description="Create a professional press release in seconds. Download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      {isEditing && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className={labelClass}>Company Name</label>
              <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" className={inputClass} />
            </div>
            <div>
              <label htmlFor="cityLocation" className={labelClass}>City / Location</label>
              <input id="cityLocation" type="text" value={cityLocation} onChange={(e) => setCityLocation(e.target.value)} placeholder="London, UK" className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="companyAddress" className={labelClass}>Company Address</label>
            <textarea id="companyAddress" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="123 Business Street&#10;London, EC1A 1BB" rows={3} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="contactName" className={labelClass}>Contact Name</label>
              <input id="contactName" type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Jane Smith" className={inputClass} />
            </div>
            <div>
              <label htmlFor="contactEmail" className={labelClass}>Contact Email</label>
              <input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="jane@acme.com" className={inputClass} />
            </div>
            <div>
              <label htmlFor="contactPhone" className={labelClass}>Contact Phone</label>
              <input id="contactPhone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+44 20 1234 5678" className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="releaseDate" className={labelClass}>Release Date</label>
            <input id="releaseDate" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label htmlFor="headline" className={labelClass}>Headline</label>
            <input id="headline" type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Company Announces Major Product Launch" className={inputClass} />
          </div>

          <div>
            <label htmlFor="subheadline" className={labelClass}>Subheadline <span className="text-gray-400 font-normal">(optional)</span></label>
            <input id="subheadline" type="text" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} placeholder="New product set to transform the industry" className={inputClass} />
          </div>

          <div>
            <label htmlFor="bodyParagraph1" className={labelClass}>Body Paragraph 1 — The News</label>
            <textarea id="bodyParagraph1" value={bodyParagraph1} onChange={(e) => setBodyParagraph1(e.target.value)} placeholder="Announce the main news here..." rows={4} className={inputClass} />
          </div>

          <div>
            <label htmlFor="bodyParagraph2" className={labelClass}>Body Paragraph 2 — Details / Quotes</label>
            <textarea id="bodyParagraph2" value={bodyParagraph2} onChange={(e) => setBodyParagraph2(e.target.value)} placeholder="Provide supporting details, quotes, or statistics..." rows={4} className={inputClass} />
          </div>

          <div>
            <label htmlFor="bodyParagraph3" className={labelClass}>Body Paragraph 3 — Background <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea id="bodyParagraph3" value={bodyParagraph3} onChange={(e) => setBodyParagraph3(e.target.value)} placeholder="Additional background or context..." rows={4} className={inputClass} />
          </div>

          <div>
            <label htmlFor="boilerplate" className={labelClass}>Boilerplate / About Company</label>
            <textarea id="boilerplate" value={boilerplate} onChange={(e) => setBoilerplate(e.target.value)} placeholder="Brief company description used at the end of press releases..." rows={4} className={inputClass} />
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
              "Generate Press Release"
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
          documentTitle="Press Release Preview"
          onDownload={handleDownload}
          onEdit={goBackToEdit}
        >
          <div className="font-serif text-sm text-gray-800 leading-relaxed">
            {/* FOR IMMEDIATE RELEASE header */}
            <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">
              FOR IMMEDIATE RELEASE
            </p>

            {/* Release Date */}
            {formattedDate && (
              <p className="text-sm text-gray-600 mb-6">{formattedDate}</p>
            )}

            {/* Headline */}
            <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
              {headline}
            </h2>

            {/* Subheadline */}
            {subheadline && (
              <p className="text-base italic text-gray-600 mb-6">{subheadline}</p>
            )}

            {/* Body */}
            {aiContent ? (
              aiContent.split(/\n\n+/).map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))
            ) : (
              fallbackParagraphs.map((para, i) => (
                <p key={i} className="mb-4">
                  {i === 0 && cityLocation ? (
                    <>
                      <span className="font-bold">{cityLocation}</span> — {para}
                    </>
                  ) : (
                    para
                  )}
                </p>
              ))
            )}

            {/* ### end mark */}
            <p className="text-center font-bold text-gray-500 my-6">###</p>

            {/* About / Boilerplate */}
            {boilerplate && (
              <div className="border-t border-gray-200 pt-4 mb-4">
                <p className="font-bold text-sm mb-2">About {companyName}</p>
                <p className="text-sm text-gray-600">{boilerplate}</p>
              </div>
            )}

            {/* Media Contact */}
            <div className="border-t border-gray-200 pt-4">
              <p className="font-bold text-sm mb-2">Media Contact:</p>
              {contactName && <p className="text-sm">{contactName}</p>}
              {contactEmail && <p className="text-sm text-blue-600">{contactEmail}</p>}
              {contactPhone && <p className="text-sm">{contactPhone}</p>}
            </div>
          </div>
        </DocumentPreview>
      )}
    </ToolShell>
  );
}
