"use client";

import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DownloadButton from "@/components/DownloadButton";
import {
  generateResume,
  ResumeData,
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

export default function ResumePage() {
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

  const handleDownload = async () => {
    const data: ResumeData = {
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
    };

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
    >
      <div className="space-y-6">
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
                    placeholder={"Led development of customer-facing web app serving 50k+ users\nReduced page load time by 40% through performance optimisation\nMentored 3 junior developers"}
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
                placeholder={"AWS Solutions Architect Associate (2024)\nGoogle Professional Cloud Developer (2023)"}
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

        {/* ── Download ── */}
        <DownloadButton
          onClick={handleDownload}
          disabled={!isValid}
          label="Download Resume"
        />
      </div>
    </ToolShell>
  );
}
