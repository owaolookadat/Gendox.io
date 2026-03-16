# GENDOX — Project Brief for Claude Code

## What We're Building
A programmatic SEO utility website with free online tools (document generators,
calculators, converters). Users land from Google, use a tool, download output,
see ads / affiliate offers. Zero sign-up, zero friction.

**Live domain:** gendox.io  
**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · docx (npm) · Vercel

---

## Phase 1 Goal
Get 3 fully working tools live and deployable to Vercel:

1. **Resignation Letter Generator** → `/generators/resignation-letter`
2. **Invoice Generator** → `/generators/invoice`
3. **Profit Margin Calculator** → `/calculators/profit-margin`

---

## Project Structure to Create

```
gendox/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, nav, footer
│   │   ├── page.tsx                # Homepage — tool directory
│   │   ├── generators/
│   │   │   ├── resignation-letter/
│   │   │   │   └── page.tsx        # Resignation letter tool
│   │   │   └── invoice/
│   │   │       └── page.tsx        # Invoice tool
│   │   └── calculators/
│   │       └── profit-margin/
│   │           └── page.tsx        # Profit margin calculator
│   ├── components/
│   │   ├── ToolShell.tsx           # Reusable wrapper for all tools
│   │   ├── DownloadButton.tsx      # Reusable DOCX download button
│   │   └── AdPlaceholder.tsx       # Ad slot placeholder
│   └── lib/
│       ├── generators/
│       │   ├── resignation-letter.ts   # DOCX generation logic
│       │   └── invoice.ts              # DOCX generation logic
│       └── utils.ts
├── public/
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Tool Specs

### 1. Resignation Letter Generator
**Route:** `/generators/resignation-letter`  
**SEO title:** `Resignation Letter Generator — Free, Instant Download | Gendox`  
**Meta description:** `Generate a professional resignation letter in seconds. Free online tool, no sign-up required. Download as Word document instantly.`

**Input fields:**
- Your Full Name (text)
- Your Job Title (text)
- Company Name (text)
- Manager's Name (text)
- Last Working Day (date picker)
- Reason for leaving (select: New Opportunity / Personal Reasons / Career Change / Relocation / Other)
- Notice period (select: Immediate / 1 Week / 2 Weeks / 1 Month / Other)
- Optional personal message (textarea, max 200 chars)

**Output:** Professional DOCX file using the `docx` npm package  
**Template:**
```
[Your Name]
[Date Today]

[Manager Name]
[Company Name]

Dear [Manager Name],

I am writing to formally notify you of my resignation from my position as 
[Job Title] at [Company Name], effective [Last Working Day].

[If reason provided: brief sentence about reason]

[If personal message provided: include it as a paragraph]

I am committed to ensuring a smooth transition and am happy to assist with 
handover activities during my notice period.

Thank you for the opportunities for professional growth during my time here.

Yours sincerely,

[Your Name]
```

**File name on download:** `resignation-letter-[company]-[date].docx`

---

### 2. Invoice Generator
**Route:** `/generators/invoice`  
**SEO title:** `Free Invoice Generator — Create & Download Invoice Instantly | Gendox`  
**Meta description:** `Create a professional invoice online for free. Add your details, line items, and download as a Word document. No sign-up needed.`

**Input fields:**
- Your Name / Business Name (text)
- Your Email (text)
- Your Address (textarea)
- Client Name (text)
- Client Address (textarea)
- Invoice Number (text, default: INV-001)
- Invoice Date (date, default: today)
- Due Date (date, default: today + 30 days)
- Currency (select: GBP £ / USD $ / EUR € / MYR RM)
- Line items (dynamic — up to 10 rows):
  - Description (text)
  - Quantity (number)
  - Unit Price (number)
  - Line Total (auto-calculated, read-only)
- Tax Rate % (number, optional, default 0)
- Notes (textarea, optional)

**Calculations (all client-side):**
- Subtotal = sum of all line totals
- Tax = subtotal × (tax rate / 100)
- Total = subtotal + tax

**Output:** DOCX file with a clean invoice layout  
**File name:** `invoice-[invoice-number]-[client-name].docx`

---

### 3. Profit Margin Calculator
**Route:** `/calculators/profit-margin`  
**SEO title:** `Profit Margin Calculator — Free Online Tool | Gendox`  
**Meta description:** `Calculate gross profit margin, net profit margin, and markup instantly. Free online calculator, no sign-up required.`

**This is a pure calculator — NO file download, just instant results**

**Input fields:**
- Revenue / Selling Price (£)
- Cost of Goods Sold / Cost Price (£)
- Operating Expenses (£, optional)

**Output (calculated live as user types):**
- Gross Profit = Revenue - COGS
- Gross Profit Margin % = (Gross Profit / Revenue) × 100
- Net Profit = Revenue - COGS - Operating Expenses
- Net Profit Margin % = (Net Profit / Revenue) × 100
- Markup % = (Gross Profit / COGS) × 100

Display results in a clean card grid. Colour code: green if margin > 20%, amber if 10-20%, red if < 10%.

---

## Reusable Components

### ToolShell.tsx
Every tool page uses this wrapper. Props:
```typescript
interface ToolShellProps {
  title: string           // H1
  description: string     // Subheading below H1
  category: string        // e.g. "Document Generator"
  children: React.ReactNode
}
```
Layout inside ToolShell:
1. Breadcrumb: Home > Category > Tool Name
2. H1 title
3. Short description (1 sentence)
4. Trust badges: "Free" | "No Sign-Up" | "Instant Download"
5. {children} — the actual tool form + output
6. AdPlaceholder (below fold)
7. SEO content block (200 word explainer, below fold)

### DownloadButton.tsx
Props:
```typescript
interface DownloadButtonProps {
  onClick: () => void
  label?: string          // default: "Download Free"
  disabled?: boolean
}
```
Style: Large, full-width, green button. Shows loading spinner while generating.

---

## DOCX Generation (lib/generators/)

Use the `docx` npm package (already in package.json).  
All generation happens **client-side** — no API calls, no server.

```typescript
// Example pattern for resignation-letter.ts
import { Document, Packer, Paragraph, TextRun } from "docx";

export async function generateResignationLetter(data: ResignationLetterData): Promise<Blob> {
  const doc = new Document({ ... });
  const buffer = await Packer.toBlob(doc);
  return buffer;
}
```

Trigger download with:
```typescript
import { saveAs } from "file-saver";
saveAs(blob, filename);
```

---

## Styling Rules

- **Framework:** Tailwind CSS only — no custom CSS files
- **Font:** Use `font-sans` (system font stack) — keep it clean
- **Colours:**
  - Primary: `blue-600` (buttons, links, accents)
  - Success/Download: `green-600`
  - Background: `gray-50` (page), `white` (cards)
  - Text: `gray-900` (headings), `gray-600` (body), `gray-400` (placeholders)
- **Layout:** Max width `max-w-2xl mx-auto` for all tool forms
- **Cards:** `bg-white rounded-lg border border-gray-200 p-6 shadow-sm`
- **Inputs:** `w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
- **Labels:** `block text-sm font-medium text-gray-700 mb-1`
- **NO dark mode for now** — keep it simple

---

## Homepage (page.tsx)

Simple tool directory:
- Hero: "Free Online Tools & Generators" headline + "Instant. Free. No sign-up." subheading
- Tool cards grid (3 cols on desktop, 1 col mobile)
- Each card: icon + title + description + "Use Tool →" link

---

## Navigation (layout.tsx)

Simple top nav:
- Left: "Gendox" logo (text, links to /)
- Right: nothing for now (keep it clean)

Footer:
- "© 2025 Gendox — Free Online Tools"
- Links: About | Privacy Policy (just placeholder hrefs for now)

---

## SEO Setup

In each tool's `page.tsx`, export metadata:
```typescript
export const metadata: Metadata = {
  title: "...",
  description: "...",
  openGraph: {
    title: "...",
    description: "...",
    type: "website",
  },
};
```

---

## Dependencies to Install

```bash
npm install docx file-saver
npm install -D @types/file-saver
```

---

## What NOT to Build Yet

- ❌ User accounts / auth
- ❌ Payment / Stripe
- ❌ Database / backend API
- ❌ Email capture
- ❌ Dark mode
- ❌ More than 3 tools
- ❌ Blog / articles section

---

## Definition of Done

- [ ] `npm run dev` starts with no errors
- [ ] All 3 tool routes load correctly
- [ ] Resignation letter generates and downloads a real .docx file
- [ ] Invoice generates and downloads a real .docx file with correct totals
- [ ] Profit margin calculator updates results live as user types
- [ ] All pages have correct `<title>` and meta description
- [ ] Site is deployable to Vercel with `npm run build` passing
- [ ] Mobile responsive (check at 375px width)
