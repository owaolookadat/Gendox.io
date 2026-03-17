import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

// Simple in-memory rate limiting (per-IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max generations per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

type ToolType =
  | "cover-letter"
  | "recommendation-letter"
  | "reference-letter"
  | "performance-review"
  | "press-release"
  | "business-proposal"
  | "company-profile";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPrompt(tool: ToolType, data: Record<string, any>): string {
  switch (tool) {
    case "cover-letter":
      return `Write a professional cover letter for a job application. Use the following details:

Applicant: ${data.yourName}
Job Title: ${data.jobTitle} at ${data.companyName}
Years of Experience: ${data.yearsExperience}
Style: ${data.style || "Professional"}
${data.recipientName ? `Addressed to: ${data.recipientName}${data.recipientTitle ? `, ${data.recipientTitle}` : ""}` : "Addressed to: Hiring Manager"}
${data.keySkills ? `Key Skills: ${data.keySkills}` : ""}
${data.whyInterested ? `Why interested: ${data.whyInterested}` : ""}
${data.closingStatement ? `Closing preference: ${data.closingStatement}` : ""}

Write ONLY the body paragraphs (3-4 paragraphs). Do NOT include the date, address block, "Dear...", or "Sincerely..." sign-off — those are handled separately. Start directly with the opening paragraph. Make it compelling, specific, and natural-sounding. Avoid generic phrases like "I am writing to express my interest." Each paragraph should flow naturally into the next.`;

    case "recommendation-letter":
      return `Write a professional ${data.context || "professional"} recommendation letter. Use these details:

Written by: ${data.yourName}, ${data.yourTitle} at ${data.yourOrganization}
Recommending: ${data.candidateName} for ${data.candidateRole}
Known for: ${data.howLongKnown}
${data.keyStrengths ? `Key strengths: ${data.keyStrengths}` : ""}
${data.specificExamples ? `Specific examples: ${data.specificExamples}` : ""}
${data.closingRecommendation ? `Closing note: ${data.closingRecommendation}` : ""}

Write ONLY the body paragraphs (4-5 paragraphs). Do NOT include the date, address, salutation ("Dear..."), or sign-off. Start with an opening paragraph establishing your relationship with the candidate. Include specific, vivid examples of their work. Make it sound genuinely personal and persuasive — not template-like. End with a strong recommendation paragraph.`;

    case "reference-letter":
      return `Write a professional reference letter. Use these details:

Written by: ${data.referrerName}, ${data.referrerTitle} at ${data.referrerCompany}
Referring: ${data.candidateName} who worked as ${data.candidateRole}
Relationship duration: ${data.relationshipDuration}
${data.skills ? `Key skills: ${data.skills}` : ""}
${data.achievements ? `Achievements: ${data.achievements}` : ""}
${data.personalQualities ? `Personal qualities: ${data.personalQualities}` : ""}
${data.recommendation ? `Custom recommendation: ${data.recommendation}` : ""}

Write ONLY the body paragraphs (4-5 paragraphs). Do NOT include date, address, salutation, or sign-off. Start by establishing your professional relationship and capacity. Include specific examples and achievements. Describe personal qualities naturally. End with a clear, confident endorsement. Make it sound authentic and specific, not generic.`;

    case "performance-review":
      return `Write a professional performance review. Use these details:

Employee: ${data.employeeName}, ${data.employeeTitle} in ${data.department}
Reviewer: ${data.reviewerName}
Review Period: ${data.reviewPeriodStart} to ${data.reviewPeriodEnd}
Overall Rating: ${data.overallRating}
Key Achievements: ${data.keyAchievements}
Areas for Improvement: ${data.areasForImprovement}
Goals for Next Period: ${data.goalsForNextPeriod}
${data.skillsAssessment ? `Skills Assessment: ${data.skillsAssessment}` : ""}
${data.trainingNeeds ? `Training Needs: ${data.trainingNeeds}` : ""}
Manager Comments: ${data.managerComments}
${data.employeeComments ? `Employee Comments: ${data.employeeComments}` : ""}

Write a comprehensive performance review document. Structure it with these sections, each as a separate paragraph or group:

1. PERFORMANCE SUMMARY — A 2-3 sentence overview paragraph
2. KEY ACHIEVEMENTS — Expand the achievements into well-written prose (1-2 paragraphs)
3. AREAS FOR DEVELOPMENT — Constructive, growth-oriented language (1 paragraph)
4. GOALS & OBJECTIVES — Frame goals as actionable next steps (1 paragraph)
${data.skillsAssessment ? "5. SKILLS ASSESSMENT — Professional evaluation (1 paragraph)" : ""}
${data.trainingNeeds ? "6. TRAINING & DEVELOPMENT — Recommended development (1 paragraph)" : ""}
7. MANAGER'S OVERALL ASSESSMENT — Expand manager comments into polished prose (1-2 paragraphs)

Use a professional but supportive tone. Be specific and constructive. Separate each section with a blank line. Start each section with the section title in ALL CAPS followed by a colon.`;

    case "press-release":
      return `Write a professional press release body. Use these details:

Company: ${data.companyName}
Location: ${data.cityLocation}
Release Date: ${data.releaseDate}
Headline: ${data.headline}
${data.subheadline ? `Subheadline: ${data.subheadline}` : ""}
Main news (paragraph 1): ${data.bodyParagraph1}
Details/quotes (paragraph 2): ${data.bodyParagraph2}
${data.bodyParagraph3 ? `Background (paragraph 3): ${data.bodyParagraph3}` : ""}
Boilerplate: ${data.boilerplate}

Write ONLY the body content (3-4 paragraphs). Do NOT include the headline, subheadline, "FOR IMMEDIATE RELEASE", contact info, or boilerplate — those are handled separately. Start with the dateline format "${data.cityLocation} — " and the main news. Include a compelling quote. Expand on the details with industry context. Write in AP style press release format. Make it newsworthy and impactful.`;

    case "business-proposal":
      return `Write a professional business proposal. Use these details:

From: ${data.yourName}${data.yourTitle ? `, ${data.yourTitle}` : ""} at ${data.yourCompany}
To: ${data.clientName}${data.clientCompany ? ` at ${data.clientCompany}` : ""}
Project: ${data.projectTitle}
Executive Summary: ${data.executiveSummary}
${data.problemStatement ? `Problem: ${data.problemStatement}` : ""}
Proposed Solution: ${data.proposedSolution}
${data.deliverables ? `Deliverables: ${data.deliverables}` : ""}
${data.timeline ? `Timeline: ${data.timeline}` : ""}
${data.budgetPricing ? `Budget: ${data.budgetPricing}` : ""}
${data.termsAndConditions ? `Terms: ${data.termsAndConditions}` : ""}

Write a polished business proposal. Structure it with these sections:

1. EXECUTIVE SUMMARY — Expand into a compelling 2-3 sentence overview
${data.problemStatement ? "2. PROBLEM STATEMENT — Articulate the challenge professionally (1-2 paragraphs)" : ""}
3. PROPOSED SOLUTION — Detail the solution with clear benefits (2-3 paragraphs)
${data.deliverables ? "4. DELIVERABLES — List and describe each deliverable clearly" : ""}
${data.timeline ? "5. TIMELINE — Present the timeline professionally" : ""}
${data.budgetPricing ? "6. INVESTMENT — Present pricing professionally (avoid \"cost\", use \"investment\")" : ""}

Use persuasive, confident language. Focus on client benefits. Separate sections with blank lines. Start each section with the title in ALL CAPS followed by a colon.`;

    case "company-profile":
      return `Write a professional company profile document. Use these details:

Company: ${data.companyName}
Founded: ${data.foundedYear}
Headquarters: ${data.headquarters}
Industry: ${data.industry}
Type: ${data.companyType}
Employees: ${data.numberOfEmployees}
Mission: ${data.missionStatement}
Overview: ${data.companyOverview}
Products/Services: ${data.productsServices}
${data.keyAchievements ? `Achievements: ${data.keyAchievements}` : ""}
${data.leadershipTeam ? `Leadership: ${data.leadershipTeam}` : ""}
Contact: ${data.contactInformation}

Write a polished company profile. Structure it with these sections:

1. ABOUT ${data.companyName.toUpperCase()} — Compelling overview paragraph incorporating the mission, history, and market position (2-3 paragraphs)
2. PRODUCTS & SERVICES — Detailed description of offerings (1-2 paragraphs)
${data.keyAchievements ? "3. KEY ACHIEVEMENTS — Highlight accomplishments professionally (1 paragraph)" : ""}
${data.leadershipTeam ? "4. LEADERSHIP — Introduce the leadership team (1 paragraph)" : ""}

Write in third person. Use confident, authoritative language. Make it sound like a Fortune 500 company profile. Separate sections with blank lines. Start each section with the title in ALL CAPS followed by a colon.`;

    default:
      throw new Error(`Unknown tool: ${tool}`);
  }
}

export async function POST(request: NextRequest) {
  // Check API key
  const client = getOpenAIClient();
  if (!client) {
    return NextResponse.json(
      { error: "AI generation is not configured. Please set OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { tool, data } = body as { tool: ToolType; data: Record<string, unknown> };

    if (!tool || !data) {
      return NextResponse.json(
        { error: "Missing tool or data" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(tool, data);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional document writer. Write clear, polished, business-appropriate content. Never use markdown formatting (no #, **, or - bullets). Use plain text only. Be specific and avoid generic filler phrases. Write as if this will be printed on company letterhead.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
