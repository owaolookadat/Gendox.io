"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import {
  Star,
  Mail,
  FileText,
  Scale,
  Users,
  Award,
  Sparkles,
  FileDown,
  ShieldCheck,
  Zap,
  ArrowUp,
  Search,
} from "lucide-react";

interface Tool {
  title: string;
  slug: string;
  desc: string;
  keywords: string;
  expertCrafted?: boolean;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  cardAccent: string;
  id: string;
  tools: Tool[];
}

const EXPERT_CRAFTED_SLUGS = new Set([
  "cover-letter",
  "recommendation-letter",
  "reference-letter",
  "performance-review",
  "press-release",
  "business-proposal",
  "company-profile",
]);

const categories: Category[] = [
  {
    name: "Popular Tools",
    icon: <Star className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    cardAccent: "hover:border-blue-400",
    id: "popular",
    tools: [
      { title: "Resume / CV Generator", slug: "resume", desc: "Build a professional resume with experience, education & skills. Download as Word.", keywords: "cv curriculum vitae job application" },
      { title: "Invoice Generator", slug: "invoice", desc: "Create invoices with line items, tax calculations & payment details.", keywords: "bill billing payment freelance" },
      { title: "Cover Letter Generator", slug: "cover-letter", desc: "Write a tailored cover letter that matches your job application.", keywords: "job application hiring", expertCrafted: true },
      { title: "Resignation Letter Generator", slug: "resignation-letter", desc: "Generate a professional resignation letter with customizable tone.", keywords: "quit leaving job notice" },
      { title: "NDA Generator", slug: "nda", desc: "Create a mutual or one-way non-disclosure agreement.", keywords: "non-disclosure confidentiality secret" },
      { title: "Rental Agreement Generator", slug: "rental-agreement", desc: "Draft a complete rental/lease agreement with all key clauses.", keywords: "lease tenant landlord property rent" },
    ],
  },
  {
    name: "Letters",
    icon: <Mail className="w-5 h-5" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
    cardAccent: "hover:border-indigo-400",
    id: "letters",
    tools: [
      { title: "Business Letter", slug: "business-letter", desc: "Write a formal business letter for any professional purpose.", keywords: "formal corporate" },
      { title: "Reference Letter", slug: "reference-letter", desc: "Create a character or professional reference for a colleague.", keywords: "recommendation character vouch", expertCrafted: true },
      { title: "Recommendation Letter", slug: "recommendation-letter", desc: "Write a strong recommendation for a job or academic application.", keywords: "endorse support", expertCrafted: true },
      { title: "Offer Letter", slug: "offer-letter", desc: "Generate a formal job offer letter with compensation details.", keywords: "job hire employment salary" },
      { title: "Termination Letter", slug: "termination-letter", desc: "Create a professional employee termination notice.", keywords: "fire dismiss end employment" },
      { title: "Warning Letter", slug: "warning-letter", desc: "Issue a formal written warning to an employee.", keywords: "disciplinary misconduct" },
      { title: "Complaint Letter", slug: "complaint-letter", desc: "Write a formal complaint to a business or organization.", keywords: "dispute issue problem" },
      { title: "Thank You Letter", slug: "thank-you-letter", desc: "Send a professional thank you after an interview or event.", keywords: "gratitude appreciation" },
      { title: "Letter of Intent", slug: "letter-of-intent", desc: "Draft a formal letter of intent for business or education.", keywords: "LOI interest purpose" },
      { title: "Apology Letter", slug: "apology-letter", desc: "Write a sincere apology for a professional situation.", keywords: "sorry regret mistake" },
      { title: "Authorization Letter", slug: "authorization-letter", desc: "Authorize someone to act on your behalf.", keywords: "delegate proxy behalf" },
      { title: "Permission Letter", slug: "permission-letter", desc: "Request formal permission from an authority or organization.", keywords: "request allow approve" },
      { title: "Sponsorship Letter", slug: "sponsorship-letter", desc: "Write a compelling sponsorship request for an event or cause.", keywords: "funding donate support event" },
      { title: "Demand Letter", slug: "demand-letter", desc: "Create a formal demand for payment or action.", keywords: "payment owed debt collect" },
    ],
  },
  {
    name: "Business Documents",
    icon: <FileText className="w-5 h-5" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    cardAccent: "hover:border-emerald-400",
    id: "business",
    tools: [
      { title: "Receipt Generator", slug: "receipt", desc: "Generate a receipt for any transaction or payment.", keywords: "proof payment transaction" },
      { title: "Purchase Order", slug: "purchase-order", desc: "Create a purchase order for goods or services.", keywords: "PO procurement buying" },
      { title: "Quotation Generator", slug: "quotation", desc: "Send a professional price quotation to a client.", keywords: "quote estimate pricing proposal" },
      { title: "Business Proposal", slug: "business-proposal", desc: "Draft a business proposal for a project or partnership.", keywords: "pitch plan project", expertCrafted: true },
      { title: "Meeting Minutes", slug: "meeting-minutes", desc: "Document decisions, action items & attendees from a meeting.", keywords: "notes agenda actions record" },
      { title: "Memo Generator", slug: "memo", desc: "Create an internal memo for your team or organization.", keywords: "memorandum internal notice announcement" },
      { title: "Press Release", slug: "press-release", desc: "Write a press release for a company announcement.", keywords: "news media announcement PR", expertCrafted: true },
      { title: "Job Description", slug: "job-description", desc: "Create a detailed job posting with responsibilities & requirements.", keywords: "hiring recruitment posting vacancy" },
      { title: "Company Profile", slug: "company-profile", desc: "Generate a professional company overview document.", keywords: "about business overview", expertCrafted: true },
      { title: "Scope of Work", slug: "scope-of-work", desc: "Define project deliverables, timeline & responsibilities clearly.", keywords: "SOW project deliverables" },
      { title: "Project Brief", slug: "project-brief", desc: "Create a concise project brief with objectives & constraints.", keywords: "overview summary plan" },
    ],
  },
  {
    name: "Legal & Agreements",
    icon: <Scale className="w-5 h-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    cardAccent: "hover:border-amber-400",
    id: "legal",
    tools: [
      { title: "Employment Contract", slug: "employment-contract", desc: "Create an employment contract with terms & conditions.", keywords: "hire job work agreement" },
      { title: "Service Agreement", slug: "service-agreement", desc: "Draft a service agreement between provider and client.", keywords: "freelance consulting contract" },
      { title: "Loan Agreement", slug: "loan-agreement", desc: "Create a loan agreement with repayment terms.", keywords: "borrow lend money debt" },
      { title: "Partnership Agreement", slug: "partnership-agreement", desc: "Draft an agreement between business partners.", keywords: "joint venture co-founder" },
      { title: "Bill of Sale", slug: "bill-of-sale", desc: "Document the sale of goods between buyer and seller.", keywords: "sell purchase transfer ownership" },
      { title: "Promissory Note", slug: "promissory-note", desc: "Create a written promise to pay a specified amount.", keywords: "IOU debt promise pay" },
      { title: "Eviction Notice", slug: "eviction-notice", desc: "Issue a formal eviction notice to a tenant.", keywords: "landlord tenant vacate leave" },
      { title: "Power of Attorney", slug: "power-of-attorney", desc: "Authorize someone to make decisions on your behalf.", keywords: "POA legal authority delegate" },
      { title: "Affidavit Generator", slug: "affidavit", desc: "Create a sworn statement of facts for legal use.", keywords: "oath sworn declaration statement" },
      { title: "Consent Form", slug: "consent-form", desc: "Generate a consent form for activities or procedures.", keywords: "permission agree acknowledge" },
      { title: "Waiver Form", slug: "waiver-form", desc: "Create a liability waiver for events or activities.", keywords: "liability release indemnity risk" },
    ],
  },
  {
    name: "HR & Employment",
    icon: <Users className="w-5 h-5" />,
    color: "text-violet-600",
    bgColor: "bg-violet-50 border-violet-200 hover:bg-violet-100",
    cardAccent: "hover:border-violet-400",
    id: "hr",
    tools: [
      { title: "Pay Stub Generator", slug: "pay-stub", desc: "Generate a professional pay stub with earnings & deductions.", keywords: "payslip salary wages paycheck" },
      { title: "Experience Certificate", slug: "experience-certificate", desc: "Create a work experience certificate for a departing employee.", keywords: "employment proof work history" },
      { title: "Internship Certificate", slug: "internship-certificate", desc: "Generate a certificate for completed internships.", keywords: "intern training completion" },
      { title: "Leave Application", slug: "leave-application", desc: "Write a formal leave request for vacation or sick leave.", keywords: "vacation sick day off absence" },
      { title: "Performance Review", slug: "performance-review", desc: "Document an employee's performance evaluation.", keywords: "appraisal assessment feedback rating", expertCrafted: true },
      { title: "Joining Letter", slug: "joining-letter", desc: "Create an appointment letter for a new employee.", keywords: "appointment welcome onboarding" },
      { title: "Relieving Letter", slug: "relieving-letter", desc: "Issue a relieving letter upon an employee's departure.", keywords: "exit departure clearance" },
    ],
  },
  {
    name: "Certificates",
    icon: <Award className="w-5 h-5" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    cardAccent: "hover:border-yellow-400",
    id: "certificates",
    tools: [
      { title: "Certificate of Completion", slug: "certificate-of-completion", desc: "Create a certificate for completing a course or program.", keywords: "course training achievement" },
      { title: "Award Certificate", slug: "award-certificate", desc: "Generate a professional award or recognition certificate.", keywords: "recognition achievement honor" },
    ],
  },
];

const allTools = categories.flatMap((c) => c.tools);

export default function Home() {
  const [search, setSearch] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        tools: cat.tools.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.desc.toLowerCase().includes(q) ||
            t.keywords.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.tools.length > 0);
  }, [search]);

  const totalShown = filteredCategories.reduce(
    (sum, c) => sum + c.tools.length,
    0
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-sm mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {allTools.length} free tools — no sign-up required
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            Free Document Generators
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Create professional documents in seconds. Download as Word files instantly.
            Expertly crafted from millions of real-world examples.
          </p>

          {/* Value props */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100 mb-10">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>Instant Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-300" />
              <span>No Sign-Up Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <FileDown className="w-4 h-4 text-blue-200" />
              <span>Download as .docx</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>Expert Quality</span>
            </div>
          </div>

          {/* Search — inside hero */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools... e.g. invoice, resignation, NDA"
                className="w-full pl-12 pr-10 py-4 rounded-xl text-gray-900 text-base shadow-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {search && (
              <p className="text-sm text-blue-200 mt-3">
                {totalShown} {totalShown === 1 ? "tool" : "tools"} found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Category quick-nav */}
        {!search && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${cat.bgColor}`}
              >
                <span className={cat.color}>{cat.icon}</span>
                <span className="text-gray-700">{cat.name}</span>
                <span className="text-xs text-gray-400">({cat.tools.length})</span>
              </a>
            ))}
          </div>
        )}

        {/* No results */}
        {search && totalShown === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-2">
              No tools found for &ldquo;{search}&rdquo;
            </p>
            <p className="text-gray-400 text-sm">
              Try a different search term or{" "}
              <button
                onClick={() => setSearch("")}
                className="text-blue-600 hover:underline"
              >
                browse all tools
              </button>
            </p>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-12">
          {filteredCategories.map((category) => (
            <section key={category.id} id={category.id}>
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className={`${category.color} p-1.5 rounded-lg bg-opacity-10`}>
                  {category.icon}
                </span>
                {category.name}
                <span className="text-sm font-normal text-gray-400">
                  ({category.tools.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/generators/${tool.slug}`}
                    className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md ${category.cardAccent} transition-all group flex flex-col relative`}
                  >
                    {/* Expert crafted badge */}
                    {tool.expertCrafted && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-50 to-blue-50 text-emerald-700 border border-emerald-200">
                        <Sparkles className="w-3 h-3" />
                        Pro
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1.5 pr-12">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex-1 leading-relaxed">{tool.desc}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-sm text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">
                        Use Tool &rarr;
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md font-mono">
                        .docx
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Social proof / stats section */}
        {!search && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-gray-900">{allTools.length}</p>
                <p className="text-sm text-gray-500 mt-1">Free Tools</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">6</p>
                <p className="text-sm text-gray-500 mt-1">Categories</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{EXPERT_CRAFTED_SLUGS.size}</p>
                <p className="text-sm text-gray-500 mt-1">Pro Quality</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500 mt-1">Sign-ups Needed</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105 z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
