"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import { generateCompanyProfile, CompanyProfileData } from "@/lib/generators/company-profile";
import { saveAs } from "file-saver";

const companyTypes = ["Private", "Public", "Non-Profit", "Government"];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CompanyProfilePage() {
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

  const handleDownload = async () => {
    const data: CompanyProfileData = {
      companyName, foundedYear, headquarters, industry, companyType,
      numberOfEmployees, missionStatement, companyOverview, productsServices,
      keyAchievements, leadershipTeam, contactInformation,
    };
    const blob = await generateCompanyProfile(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `company-profile-${slugify(companyName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <ToolShell
      title="Company Profile Generator"
      description="Create a professional company profile document in seconds. Download as Word document instantly."
      category="Document Generator"
    >
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

        <DownloadButton onClick={handleDownload} disabled={!isValid} label="Download Company Profile" />
      </div>
    </ToolShell>
  );
}
