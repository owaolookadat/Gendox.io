"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DownloadButton from "@/components/DownloadButton";
import { generatePressRelease, PressReleaseData } from "@/lib/generators/press-release";
import { saveAs } from "file-saver";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function PressReleasePage() {
  const seoData = getToolSeoContent("press-release");
  const relatedTools = getRelatedTools("press-release");
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

  const handleDownload = async () => {
    const data: PressReleaseData = {
      companyName, companyAddress, contactName, contactEmail, contactPhone,
      releaseDate, headline, subheadline, cityLocation,
      bodyParagraph1, bodyParagraph2, bodyParagraph3, boilerplate,
    };
    const blob = await generatePressRelease(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `press-release-${slugify(companyName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

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

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Press Release" />
      </div>
    </ToolShell>
  );
}
