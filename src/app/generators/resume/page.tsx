"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { getToolSeoContent, getRelatedTools } from "@/lib/seo-content";
import DocumentPreview from "@/components/DocumentPreview";
import { useDocumentFlow } from "@/hooks/useDocumentFlow";
import {
  generateResume,
  generateResumePreviewData,
  ResumeData,
  ResumeStyle,
  ResumePreviewData,
  Experience,
  Education,
} from "@/lib/generators/resume";
import { saveAs } from "file-saver";

const degreeOptions = [
  "",
  "High School",
  "Associate",
  "Bachelor's",
  "Master's",
  "PhD",
  "Diploma",
  "Certificate",
  "Other",
];

const styleOptions: {
  value: ResumeStyle;
  label: string;
  description: string;
}[] = [
  {
    value: "classic",
    label: "Classic",
    description: "Traditional centered layout with clear section dividers",
  },
  {
    value: "modern",
    label: "Modern",
    description: "Contemporary design with blue accents and clean typography",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Dense, space-efficient layout that fits more on one page",
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function blankExperience(): Experience {
  return {
    company: "",
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

function blankEducation(): Education {
  return {
    institution: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
    grade: "",
  };
}

// --- Preview renderer ---

function ResumePreviewContent({
  preview,
}: {
  preview: ResumePreviewData;
}) {
  if (preview.style === "modern") {
    return <ModernPreview preview={preview} />;
  }
  if (preview.style === "minimal") {
    return <MinimalPreview preview={preview} />;
  }
  return <ClassicPreview preview={preview} />;
}

function ClassicPreview({ preview }: { preview: ResumePreviewData }) {
  return (
    <div className="text-sm leading-relaxed">
      <h1 className="text-center text-lg font-bold text-gray-900">
        {preview.fullName}
      </h1>
      {preview.contactLine && (
        <p className="text-center text-xs text-gray-500 mt-1">
          {preview.contactLine}
        </p>
      )}
      <hr className="my-3 border-gray-800" />

      {preview.summary && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider border-b border-gray-800 pb-1 mt-4 mb-2 text-gray-900">
            Professional Summary
          </h2>
          <p className="text-gray-700 text-xs">{preview.summary}</p>
        </>
      )}

      {preview.experience.length > 0 && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider border-b border-gray-800 pb-1 mt-4 mb-2 text-gray-900">
            Experience
          </h2>
          {preview.experience.map((exp, i) => (
            <div key={i} className={i > 0 ? "mt-3" : ""}>
              <div className="flex justify-between items-baseline">
                <p className="text-xs">
                  <span className="font-bold text-gray-900">{exp.title}</span>
                  {exp.company && (
                    <span className="italic text-gray-700">
                      {" "}
                      at {exp.company}
                    </span>
                  )}
                  {exp.location && (
                    <span className="text-gray-500">
                      {" "}
                      &mdash; {exp.location}
                    </span>
                  )}
                </p>
              </div>
              <p className="text-xs text-gray-500 italic">{exp.dates}</p>
              {exp.bullets.length > 0 && (
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-xs text-gray-700">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {preview.education.length > 0 && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider border-b border-gray-800 pb-1 mt-4 mb-2 text-gray-900">
            Education
          </h2>
          {preview.education.map((edu, i) => (
            <div key={i} className={i > 0 ? "mt-2" : ""}>
              <p className="text-xs">
                <span className="font-bold text-gray-900">
                  {[edu.degree, edu.field].filter(Boolean).join(" in ") ||
                    "Degree"}
                </span>
                {edu.institution && (
                  <span className="text-gray-700">
                    {" "}
                    &mdash; {edu.institution}
                  </span>
                )}
              </p>
              {(edu.dates || edu.grade) && (
                <p className="text-xs text-gray-500 italic">
                  {[edu.dates, edu.grade ? `Grade: ${edu.grade}` : ""]
                    .filter(Boolean)
                    .join("  |  ")}
                </p>
              )}
            </div>
          ))}
        </>
      )}

      {preview.skills && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider border-b border-gray-800 pb-1 mt-4 mb-2 text-gray-900">
            Skills
          </h2>
          <p className="text-xs text-gray-700">{preview.skills}</p>
        </>
      )}

      {preview.certifications && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider border-b border-gray-800 pb-1 mt-4 mb-2 text-gray-900">
            Certifications
          </h2>
          <p className="text-xs text-gray-700">{preview.certifications}</p>
        </>
      )}

      {preview.languages && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider border-b border-gray-800 pb-1 mt-4 mb-2 text-gray-900">
            Languages
          </h2>
          <p className="text-xs text-gray-700">{preview.languages}</p>
        </>
      )}

      {preview.hobbies && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider border-b border-gray-800 pb-1 mt-4 mb-2 text-gray-900">
            Hobbies &amp; Interests
          </h2>
          <p className="text-xs text-gray-700">{preview.hobbies}</p>
        </>
      )}
    </div>
  );
}

function ModernPreview({ preview }: { preview: ResumePreviewData }) {
  return (
    <div className="text-sm leading-relaxed">
      <h1 className="text-left text-xl font-bold text-blue-600">
        {preview.fullName}
      </h1>
      {preview.contactLine && (
        <p className="text-left text-xs text-gray-500 mt-1">
          {preview.contactLine}
        </p>
      )}

      {preview.summary && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider text-blue-600 border-b border-blue-300 pb-1 mt-5 mb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 text-xs">{preview.summary}</p>
        </>
      )}

      {preview.experience.length > 0 && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider text-blue-600 border-b border-blue-300 pb-1 mt-5 mb-2">
            Experience
          </h2>
          {preview.experience.map((exp, i) => (
            <div key={i} className={i > 0 ? "mt-3" : ""}>
              <p className="text-xs">
                <span className="font-bold text-blue-600">{exp.title}</span>
                {exp.company && (
                  <span className="italic text-gray-700">
                    {" "}
                    at {exp.company}
                  </span>
                )}
                {exp.location && (
                  <span className="text-gray-500">
                    {" "}
                    &mdash; {exp.location}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 italic">{exp.dates}</p>
              {exp.bullets.length > 0 && (
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-xs text-gray-700">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {preview.education.length > 0 && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider text-blue-600 border-b border-blue-300 pb-1 mt-5 mb-2">
            Education
          </h2>
          {preview.education.map((edu, i) => (
            <div key={i} className={i > 0 ? "mt-2" : ""}>
              <p className="text-xs">
                <span className="font-bold text-blue-600">
                  {[edu.degree, edu.field].filter(Boolean).join(" in ") ||
                    "Degree"}
                </span>
                {edu.institution && (
                  <span className="text-gray-700">
                    {" "}
                    &mdash; {edu.institution}
                  </span>
                )}
              </p>
              {(edu.dates || edu.grade) && (
                <p className="text-xs text-gray-500 italic">
                  {[edu.dates, edu.grade ? `Grade: ${edu.grade}` : ""]
                    .filter(Boolean)
                    .join("  |  ")}
                </p>
              )}
            </div>
          ))}
        </>
      )}

      {preview.skills && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider text-blue-600 border-b border-blue-300 pb-1 mt-5 mb-2">
            Skills
          </h2>
          <p className="text-xs text-gray-700">{preview.skills}</p>
        </>
      )}

      {preview.certifications && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider text-blue-600 border-b border-blue-300 pb-1 mt-5 mb-2">
            Certifications
          </h2>
          <p className="text-xs text-gray-700">{preview.certifications}</p>
        </>
      )}

      {preview.languages && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider text-blue-600 border-b border-blue-300 pb-1 mt-5 mb-2">
            Languages
          </h2>
          <p className="text-xs text-gray-700">{preview.languages}</p>
        </>
      )}

      {preview.hobbies && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider text-blue-600 border-b border-blue-300 pb-1 mt-5 mb-2">
            Hobbies &amp; Interests
          </h2>
          <p className="text-xs text-gray-700">{preview.hobbies}</p>
        </>
      )}
    </div>
  );
}

function MinimalPreview({ preview }: { preview: ResumePreviewData }) {
  return (
    <div className="text-sm leading-snug">
      <h1 className="text-left text-base font-bold text-gray-900">
        {preview.fullName}
      </h1>
      {preview.contactLine && (
        <p className="text-left text-xs text-gray-400 mt-0.5">
          {preview.contactLine}
        </p>
      )}

      {preview.summary && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider mt-4 mb-1 text-gray-900">
            Professional Summary
          </h2>
          <p className="text-gray-700 text-xs">{preview.summary}</p>
        </>
      )}

      {preview.experience.length > 0 && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider mt-4 mb-1 text-gray-900">
            Experience
          </h2>
          {preview.experience.map((exp, i) => (
            <div key={i} className={i > 0 ? "mt-2" : ""}>
              <p className="text-xs">
                <span className="font-bold text-gray-900">{exp.title}</span>
                {exp.company && (
                  <span className="italic text-gray-700">
                    {" "}
                    at {exp.company}
                  </span>
                )}
                {exp.location && (
                  <span className="text-gray-500">
                    {" "}
                    &mdash; {exp.location}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 italic">{exp.dates}</p>
              {exp.bullets.length > 0 && (
                <ul className="list-disc list-inside mt-0.5 space-y-0">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-xs text-gray-700">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {preview.education.length > 0 && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider mt-4 mb-1 text-gray-900">
            Education
          </h2>
          {preview.education.map((edu, i) => (
            <div key={i} className={i > 0 ? "mt-1.5" : ""}>
              <p className="text-xs">
                <span className="font-bold text-gray-900">
                  {[edu.degree, edu.field].filter(Boolean).join(" in ") ||
                    "Degree"}
                </span>
                {edu.institution && (
                  <span className="text-gray-700">
                    {" "}
                    &mdash; {edu.institution}
                  </span>
                )}
              </p>
              {(edu.dates || edu.grade) && (
                <p className="text-xs text-gray-500 italic">
                  {[edu.dates, edu.grade ? `Grade: ${edu.grade}` : ""]
                    .filter(Boolean)
                    .join("  |  ")}
                </p>
              )}
            </div>
          ))}
        </>
      )}

      {preview.skills && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider mt-4 mb-1 text-gray-900">
            Skills
          </h2>
          <p className="text-xs text-gray-700">{preview.skills}</p>
        </>
      )}

      {preview.certifications && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider mt-4 mb-1 text-gray-900">
            Certifications
          </h2>
          <p className="text-xs text-gray-700">{preview.certifications}</p>
        </>
      )}

      {preview.languages && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider mt-4 mb-1 text-gray-900">
            Languages
          </h2>
          <p className="text-xs text-gray-700">{preview.languages}</p>
        </>
      )}

      {preview.hobbies && (
        <>
          <h2 className="uppercase font-bold text-xs tracking-wider mt-4 mb-1 text-gray-900">
            Hobbies &amp; Interests
          </h2>
          <p className="text-xs text-gray-700">{preview.hobbies}</p>
        </>
      )}
    </div>
  );
}

// --- Main page component ---

export default function ResumePage() {
  const seoData = getToolSeoContent("resume");
  const relatedTools = getRelatedTools("resume");
  const { isEditing, isPreviewing, showPreview, goBackToEdit } =
    useDocumentFlow();

  // Style
  const [style, setStyle] = useState<ResumeStyle>("classic");

  // Personal info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");

  // Summary
  const [professionalSummary, setProfessionalSummary] = useState("");

  // Experience
  const [experience, setExperience] = useState<Experience[]>([
    blankExperience(),
  ]);

  // Education
  const [education, setEducation] = useState<Education[]>([blankEducation()]);

  // Skills & optional
  const [skills, setSkills] = useState("");
  const [certifications, setCertifications] = useState("");
  const [languages, setLanguages] = useState("");
  const [hobbies, setHobbies] = useState("");

  // Preview data
  const [previewData, setPreviewData] = useState<ResumePreviewData | null>(
    null
  );

  const isValid = fullName.trim().length > 0;

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string | boolean
  ) => {
    setExperience((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addExperience = () => {
    if (experience.length < 8) {
      setExperience((prev) => [...prev, blankExperience()]);
    }
  };

  const removeExperience = (index: number) => {
    if (experience.length > 1) {
      setExperience((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setEducation((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addEducation = () => {
    if (education.length < 4) {
      setEducation((prev) => [...prev, blankEducation()]);
    }
  };

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      setEducation((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const buildFormData = (): ResumeData => ({
    fullName,
    email,
    phone,
    location,
    linkedin,
    website,
    professionalSummary,
    experience,
    education,
    skills,
    certifications,
    languages,
    hobbies,
    style,
  });

  const handleGeneratePreview = () => {
    const data = buildFormData();
    const preview = generateResumePreviewData(data);
    setPreviewData(preview);
    showPreview();
  };

  const handleDownload = async () => {
    const data = buildFormData();
    const blob = await generateResume(data);
    const today = new Date().toISOString().split("T")[0];
    const filename = `resume-${slugify(fullName)}-${today}.docx`;
    saveAs(blob, filename);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const sectionHeaderClass =
    "text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4";

  return (
    <ToolShell
      title="Resume / CV Generator"
      description="Create a professional resume in minutes. Free online tool, download as Word document instantly."
      category="Document Generator"
      seoHeading={seoData.heading}
      seoContent={seoData.content}
      faqs={seoData.faqs}
      relatedTools={relatedTools}
    >
      {/* ── Editing Mode ── */}
      {isEditing && (
        <div className="space-y-6">
          {/* ── Style Selector ── */}
          <div>
            <h2 className={sectionHeaderClass}>Resume Style</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {styleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStyle(opt.value)}
                  className={`text-left border rounded-lg p-3 transition-all ${
                    style === opt.value
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <span className="block text-sm font-medium text-gray-900">
                    {opt.label}
                  </span>
                  <span className="block text-xs text-gray-500 mt-0.5">
                    {opt.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Personal Information ── */}
          <div>
            <h2 className={sectionHeaderClass}>Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className={labelClass}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Smith"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7700 900000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="location" className={labelClass}>
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="London, UK"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="linkedin" className={labelClass}>
                    LinkedIn URL{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="linkedin"
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="linkedin.com/in/johnsmith"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="website" className={labelClass}>
                    Website{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="website"
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="johnsmith.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Professional Summary ── */}
          <div>
            <h2 className={sectionHeaderClass}>Professional Summary</h2>
            <div>
              <label htmlFor="professionalSummary" className={labelClass}>
                Summary
              </label>
              <textarea
                id="professionalSummary"
                value={professionalSummary}
                onChange={(e) => setProfessionalSummary(e.target.value)}
                placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications. Proven track record of delivering high-quality solutions on time..."
                rows={4}
                className={inputClass}
              />
            </div>
          </div>

          {/* ── Work Experience ── */}
          <div>
            <h2 className={sectionHeaderClass}>Work Experience</h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Experience {index + 1}
                    </span>
                    {experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Job Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) =>
                          updateExperience(index, "title", e.target.value)
                        }
                        placeholder="Software Engineer"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(index, "company", e.target.value)
                        }
                        placeholder="Acme Corp"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(index, "location", e.target.value)
                      }
                      placeholder="London, UK"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(index, "startDate", e.target.value)
                        }
                        placeholder="Jan 2022"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>End Date</label>
                      <input
                        type="text"
                        value={exp.current ? "Present" : exp.endDate}
                        onChange={(e) =>
                          updateExperience(index, "endDate", e.target.value)
                        }
                        placeholder="Dec 2024"
                        disabled={exp.current}
                        className={`${inputClass} ${exp.current ? "bg-gray-100" : ""}`}
                      />
                      <label className="flex items-center gap-2 mt-1.5 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) =>
                            updateExperience(index, "current", e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        I currently work here
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Responsibilities &amp; Achievements
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(index, "description", e.target.value)
                      }
                      placeholder={
                        "Led development of customer-facing web app serving 50k+ users\nReduced page load time by 40% through performance optimisation\nMentored 3 junior developers"
                      }
                      rows={4}
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      One achievement per line. Each line becomes a bullet point.
                    </p>
                  </div>
                </div>
              ))}
              {experience.length < 8 && (
                <button
                  type="button"
                  onClick={addExperience}
                  className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  + Add Experience
                </button>
              )}
            </div>
          </div>

          {/* ── Education ── */}
          <div>
            <h2 className={sectionHeaderClass}>Education</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Education {index + 1}
                    </span>
                    {education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(index, "institution", e.target.value)
                        }
                        placeholder="University of London"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Degree</label>
                      <select
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(index, "degree", e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="">-- Select Degree --</option>
                        {degreeOptions
                          .filter((d) => d !== "")
                          .map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Field of Study</label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) =>
                        updateEducation(index, "field", e.target.value)
                      }
                      placeholder="Computer Science"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass}>Start Year</label>
                      <input
                        type="text"
                        value={edu.startYear}
                        onChange={(e) =>
                          updateEducation(index, "startYear", e.target.value)
                        }
                        placeholder="2018"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>End Year</label>
                      <input
                        type="text"
                        value={edu.endYear}
                        onChange={(e) =>
                          updateEducation(index, "endYear", e.target.value)
                        }
                        placeholder="2022"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Grade / GPA{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={edu.grade}
                        onChange={(e) =>
                          updateEducation(index, "grade", e.target.value)
                        }
                        placeholder="First Class / 3.8"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {education.length < 4 && (
                <button
                  type="button"
                  onClick={addEducation}
                  className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  + Add Education
                </button>
              )}
            </div>
          </div>

          {/* ── Skills ── */}
          <div>
            <h2 className={sectionHeaderClass}>Skills</h2>
            <div>
              <label htmlFor="skills" className={labelClass}>
                Key Skills
              </label>
              <textarea
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="JavaScript, TypeScript, React, Node.js, Python, SQL, AWS, Docker, Git, Agile/Scrum..."
                rows={3}
                className={inputClass}
              />
            </div>
          </div>

          {/* ── Optional Sections ── */}
          <div>
            <h2 className={sectionHeaderClass}>
              Additional Information{" "}
              <span className="text-gray-400 font-normal text-sm">
                (optional)
              </span>
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="certifications" className={labelClass}>
                  Certifications
                </label>
                <textarea
                  id="certifications"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  placeholder={
                    "AWS Solutions Architect Associate (2024)\nGoogle Professional Cloud Developer (2023)"
                  }
                  rows={3}
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">
                  One certification per line.
                </p>
              </div>
              <div>
                <label htmlFor="languages" className={labelClass}>
                  Languages
                </label>
                <input
                  id="languages"
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="English (Native), Spanish (Fluent), French (Intermediate)"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="hobbies" className={labelClass}>
                  Hobbies &amp; Interests
                </label>
                <input
                  id="hobbies"
                  type="text"
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  placeholder="Open-source contributing, hiking, photography, chess"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ── Generate Button ── */}
          <button
            onClick={handleGeneratePreview}
            disabled={!isValid}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Generate Resume
          </button>
        </div>
      )}

      {/* ── Preview Mode ── */}
      {isPreviewing && previewData && (
        <DocumentPreview
          onDownload={handleDownload}
          onEdit={goBackToEdit}
          documentTitle="Resume Preview"
        >
          <ResumePreviewContent preview={previewData} />
        </DocumentPreview>
      )}
    </ToolShell>
  );
}
