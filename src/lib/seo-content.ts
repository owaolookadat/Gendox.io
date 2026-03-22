interface FAQ {
  question: string;
  answer: string;
}

interface SeoContent {
  heading: string;
  content: string;
  faqs: FAQ[];
}

interface RelatedTool {
  title: string;
  slug: string;
  desc: string;
}

const seoData: Record<string, SeoContent> = {
  resume: {
    heading: "What is a Resume?",
    content:
      "A resume is a concise document that summarises your professional experience, skills, education, and achievements for potential employers. It serves as your first impression in the job application process and is typically the deciding factor in whether you get called for an interview. A well-structured resume highlights relevant qualifications, uses clear formatting, and is tailored to the specific role you are applying for. Key elements include a professional summary or objective, work experience listed in reverse chronological order, education credentials, and a skills section. Using a resume generator saves significant time by handling formatting and structure automatically, letting you focus on the content that matters most. Whether you are a recent graduate or a seasoned professional, having a polished resume is essential for standing out in competitive job markets.",
    faqs: [
      {
        question: "How long should my resume be?",
        answer:
          "For most professionals, a one-page resume is ideal. If you have more than 10 years of relevant experience or work in academia, a two-page resume is acceptable. Focus on the most relevant and recent experience rather than listing every job you have ever held.",
      },
      {
        question: "What format should I use for my resume?",
        answer:
          "The reverse chronological format is the most widely accepted, listing your most recent experience first. Functional resumes focus on skills rather than timeline and are useful for career changers. Combination resumes blend both approaches. Our generator uses the reverse chronological format as it is preferred by most hiring managers and applicant tracking systems.",
      },
      {
        question: "Should I include a photo on my resume?",
        answer:
          "In the UK and US, it is generally recommended not to include a photo on your resume to avoid potential bias. However, in some European and Asian countries, photos are expected. Follow the norms of the country where you are applying.",
      },
    ],
  },

  "resignation-letter": {
    heading: "What is a Resignation Letter?",
    content:
      "A resignation letter is a formal document that notifies your employer of your decision to leave your position. It is a professional courtesy that helps maintain good relationships and ensures a smooth transition. Even if you have already communicated your resignation verbally, a written letter creates an official record of your notice and last working day. A strong resignation letter includes the date of your last day, a brief statement of gratitude, and an offer to help with the transition. It should remain professional and positive regardless of your reasons for leaving, as it becomes part of your employment record. Using a resignation letter generator ensures your letter follows proper business format, includes all necessary details, and maintains a professional tone that preserves your reputation.",
    faqs: [
      {
        question: "How much notice should I give when resigning?",
        answer:
          "The standard notice period is two weeks in the US and one month in the UK, though your employment contract may specify a different period. Check your contract for any required notice period. Giving adequate notice demonstrates professionalism and helps maintain positive references.",
      },
      {
        question: "Should I include my reason for leaving?",
        answer:
          "You are not obligated to include your reason for resigning. A simple, professional statement that you are moving on is sufficient. If you choose to include a reason, keep it brief and positive. Avoid criticising the company, management, or colleagues in your resignation letter.",
      },
      {
        question: "Can I resign by email?",
        answer:
          "While a printed letter is traditional, email resignations are increasingly accepted in many workplaces. It is best to first tell your manager in person or via video call, then follow up with a formal written letter or email. Our generator creates a document you can adapt for either format.",
      },
    ],
  },

  "cover-letter": {
    heading: "What is a Cover Letter?",
    content:
      "A cover letter is a one-page document that accompanies your resume when applying for a job. It introduces you to the hiring manager, explains why you are interested in the role, and highlights how your experience and skills make you a strong candidate. Unlike a resume, a cover letter allows you to tell your professional story, address specific job requirements, and demonstrate your knowledge of the company. A compelling cover letter can set you apart from other applicants who only submit a resume. Key elements include a strong opening that grabs attention, specific examples of relevant achievements, and a clear call to action. Using a cover letter generator helps you structure your letter professionally and ensures you include all the essential components that hiring managers look for.",
    faqs: [
      {
        question: "Do I really need a cover letter?",
        answer:
          "Yes, unless the job posting specifically says not to include one. A cover letter gives you the opportunity to explain your qualifications in more detail than a resume allows. Many hiring managers consider a cover letter essential and may discard applications without one.",
      },
      {
        question: "How long should a cover letter be?",
        answer:
          "A cover letter should be no longer than one page, ideally three to four paragraphs. Keep it concise and focused on the most relevant qualifications. Hiring managers typically spend less than a minute reviewing a cover letter, so every sentence should add value.",
      },
      {
        question: "Should I address a cover letter to a specific person?",
        answer:
          "Whenever possible, address your cover letter to the hiring manager by name. Check the job posting, company website, or LinkedIn to find the right person. If you cannot find a name, use a professional greeting such as 'Dear Hiring Manager' rather than 'To Whom It May Concern'.",
      },
    ],
  },

  "business-letter": {
    heading: "What is a Business Letter?",
    content:
      "A business letter is a formal written communication used in professional contexts between companies, organisations, or individuals. Business letters serve a wide range of purposes including making enquiries, placing orders, filing complaints, providing information, or establishing partnerships. Unlike casual emails, business letters follow a structured format with specific sections including sender and recipient addresses, a date, salutation, body paragraphs, and a formal closing. The tone is professional and the language is clear and direct. A well-written business letter reflects positively on you and your organisation, establishing credibility and professionalism. Using a business letter generator ensures proper formatting, appropriate tone, and a professional appearance that makes the right impression on your recipients.",
    faqs: [
      {
        question: "What is the correct format for a business letter?",
        answer:
          "The standard business letter format includes your address, the date, the recipient's address, a salutation, body paragraphs, a closing, and your signature. Use block format where all text is left-aligned with single spacing within paragraphs and double spacing between them. Our generator handles all formatting automatically.",
      },
      {
        question: "How formal should a business letter be?",
        answer:
          "Business letters should maintain a professional tone throughout. Use formal salutations like 'Dear Mr Smith' rather than 'Hi John'. Avoid slang, contractions, and overly casual language. The level of formality may vary slightly depending on your relationship with the recipient, but err on the side of being more formal.",
      },
      {
        question: "When should I use a business letter instead of an email?",
        answer:
          "Use a formal business letter for important communications such as legal matters, official complaints, contract proposals, or when making a strong professional impression matters. Letters carry more weight than emails for formal requests, official notices, and any communication that may need to serve as a legal record.",
      },
    ],
  },

  "reference-letter": {
    heading: "What is a Reference Letter?",
    content:
      "A reference letter, also known as a letter of reference, is a document written by someone who can vouch for your qualifications, character, or work performance. These letters are commonly requested by employers, academic institutions, and landlords to verify claims made by applicants. A good reference letter provides specific examples of the person's skills, achievements, and character traits rather than vague praise. It typically includes how the writer knows the person, the duration of their relationship, and concrete examples that demonstrate the person's capabilities. Reference letters can be written by former employers, colleagues, professors, or community leaders. Using a reference letter generator helps structure the letter properly and ensures all important elements are included, making it easier to write a compelling and professional reference.",
    faqs: [
      {
        question: "What is the difference between a reference letter and a recommendation letter?",
        answer:
          "A reference letter is a general endorsement of someone's character and abilities that can be used for multiple purposes. A recommendation letter is typically written for a specific position or programme and is tailored to that opportunity. In practice, the terms are often used interchangeably.",
      },
      {
        question: "Who should I ask for a reference letter?",
        answer:
          "Ask someone who knows your work well and can speak positively about your abilities. Former managers, senior colleagues, professors, or mentors are ideal choices. Choose someone who can provide specific examples of your achievements rather than someone with an impressive title who barely knows you.",
      },
      {
        question: "How recent should a reference letter be?",
        answer:
          "Ideally, a reference letter should be no more than one to two years old. If you are using an older letter, consider asking the writer for an updated version. Most employers and institutions prefer current references that reflect your recent skills and experience.",
      },
    ],
  },

  "recommendation-letter": {
    heading: "What is a Recommendation Letter?",
    content:
      "A recommendation letter is a formal document written by someone who can assess and endorse your qualifications for a specific role, programme, or opportunity. Unlike general reference letters, recommendation letters are targeted to a particular position and explain why the candidate is an excellent fit. These letters are crucial for job applications, university admissions, scholarship applications, and professional certifications. An effective recommendation letter goes beyond listing accomplishments to provide insight into the candidate's work ethic, leadership abilities, and personal qualities. It should include the recommender's credentials, their relationship with the candidate, specific achievements with measurable results, and a strong closing endorsement. A recommendation letter generator helps you create a well-structured, persuasive letter that covers all the essential elements and follows proper business formatting conventions.",
    faqs: [
      {
        question: "How do I write a strong recommendation letter?",
        answer:
          "Focus on specific examples and measurable achievements rather than general praise. Mention the candidate's key strengths with concrete stories that illustrate them. Tailor the letter to the specific opportunity and explain why the candidate would excel in that particular role or programme.",
      },
      {
        question: "How long should a recommendation letter be?",
        answer:
          "A recommendation letter should typically be one to two pages long. It should be detailed enough to provide meaningful insight but concise enough to hold the reader's attention. Four to five well-developed paragraphs usually provide the right level of detail.",
      },
      {
        question: "Can I write a recommendation letter for myself?",
        answer:
          "It is common for the recommender to ask you to draft the letter, which they will then review and sign. Our generator makes this process easier by helping you structure the content professionally. The final letter should always be reviewed and approved by the person whose name appears on it.",
      },
    ],
  },

  "offer-letter": {
    heading: "What is an Offer Letter?",
    content:
      "An offer letter is a formal document from an employer to a selected candidate, confirming the terms of employment. It serves as the official job offer and typically includes the position title, start date, salary, benefits, reporting structure, and employment conditions. An offer letter bridges the gap between a verbal offer and a formal employment contract, giving the candidate clear written terms to review before accepting. While not always legally binding in the same way as an employment contract, offer letters set expectations and demonstrate professionalism. Key elements include compensation details, work schedule, probation period if applicable, and any conditions such as background checks or reference verification. Using an offer letter generator ensures you include all necessary details in a professional format, reducing the risk of misunderstandings and creating a positive first impression with your new hire.",
    faqs: [
      {
        question: "Is an offer letter legally binding?",
        answer:
          "Offer letters are generally not full employment contracts, but they can be legally binding depending on the language used and local employment laws. To protect both parties, clearly state that the offer is contingent on any conditions and that it does not constitute a contract. Consult a legal professional for your specific situation.",
      },
      {
        question: "What should be included in an offer letter?",
        answer:
          "An offer letter should include the job title, department, start date, salary or hourly rate, pay frequency, benefits overview, work schedule, reporting manager, employment type (full-time or part-time), any probation period, and a deadline for the candidate to accept or decline the offer.",
      },
      {
        question: "How long should a candidate have to respond to an offer letter?",
        answer:
          "A standard response window is five to seven business days. This gives the candidate enough time to review the terms and make an informed decision without leaving the position open indefinitely. Clearly state the deadline in your offer letter.",
      },
    ],
  },

  "termination-letter": {
    heading: "What is a Termination Letter?",
    content:
      "A termination letter is a formal document that officially communicates the end of an employment relationship between an employer and an employee. It serves as a written record of the decision, the reasons behind it, and the terms of separation. Termination letters are essential for legal protection, ensuring that both parties have a clear understanding of the circumstances and any obligations going forward. A proper termination letter includes the effective date of termination, the reason for the decision, details about final pay and benefits, information about returning company property, and any non-compete or confidentiality reminders. The tone should be professional and factual, avoiding emotional language. Using a termination letter generator helps ensure compliance with best practices, covers all necessary legal elements, and maintains a respectful tone even in difficult circumstances.",
    faqs: [
      {
        question: "What legal considerations should I be aware of when writing a termination letter?",
        answer:
          "Ensure the termination complies with local employment laws, any contractual obligations, and anti-discrimination regulations. Document the reasons for termination clearly and factually. Keep records of any warnings or performance improvement plans. Consider having the letter reviewed by a legal professional, especially for complex situations.",
      },
      {
        question: "Should I include the reason for termination in the letter?",
        answer:
          "Yes, it is best practice to include a clear, factual reason for termination. This creates a documented record that can protect the employer legally. Keep the explanation professional and avoid subjective or emotional language. Reference any previous warnings or performance discussions where applicable.",
      },
      {
        question: "What information about final pay should be included?",
        answer:
          "Include details about the final paycheck date, any unused holiday pay, severance pay if applicable, the status of health insurance and other benefits, pension or retirement account information, and the process for returning company property. Comply with local laws regarding timing of final pay.",
      },
    ],
  },

  "warning-letter": {
    heading: "What is a Warning Letter?",
    content:
      "A warning letter is a formal document issued by an employer to an employee to address performance issues, policy violations, or misconduct in the workplace. It serves as an official record that the employee has been notified of the problem and the expected corrective actions. Warning letters are a critical part of progressive discipline, typically following verbal warnings and preceding more severe consequences such as suspension or termination. A well-written warning letter clearly describes the specific issue, references relevant company policies, outlines expected improvements with measurable goals, sets a timeline for improvement, and states the consequences of failing to improve. Using a warning letter generator ensures your letter is professional, thorough, and properly documented, which is essential for protecting both the employer and employee in any future disputes.",
    faqs: [
      {
        question: "How many warning letters should be issued before termination?",
        answer:
          "Most companies follow a progressive discipline policy that includes a verbal warning, a first written warning, a final written warning, and then termination. However, serious misconduct such as theft or harassment may warrant immediate termination. Always follow your company's specific discipline policy and local employment laws.",
      },
      {
        question: "Should the employee sign the warning letter?",
        answer:
          "Yes, ask the employee to sign the letter to acknowledge receipt. Their signature does not necessarily mean they agree with the warning, only that they have received and read it. If the employee refuses to sign, note this on the document and have a witness present. Keep a copy in the employee's personnel file.",
      },
      {
        question: "Can a warning letter be removed from an employee's record?",
        answer:
          "This depends on company policy and the nature of the warning. Some organisations remove warnings after a set period, such as six to twelve months, if the employee has shown sustained improvement. Others retain all warnings permanently. Check your company's HR policies for guidance.",
      },
    ],
  },

  "complaint-letter": {
    heading: "What is a Complaint Letter?",
    content:
      "A complaint letter is a formal written communication that addresses a problem, dissatisfaction, or grievance with a product, service, or situation. Whether directed at a company, organisation, or individual, a well-crafted complaint letter clearly states the issue, provides supporting evidence, and requests a specific resolution. Effective complaint letters are factual and professional rather than emotional or threatening, which increases the likelihood of a positive outcome. Key elements include a clear description of the problem, relevant dates and reference numbers, what you have already done to resolve the issue, and what action you expect in response. Writing a complaint letter creates a documented record that can be useful if the matter escalates to consumer protection agencies or legal proceedings. A complaint letter generator helps you organise your thoughts into a structured, professional format that gets results.",
    faqs: [
      {
        question: "How do I make my complaint letter effective?",
        answer:
          "Be specific about the problem, include dates and reference numbers, state what resolution you want, and set a reasonable deadline for response. Keep the tone professional and factual. Attach copies of relevant documents such as receipts or previous correspondence. Send the letter to the right person or department.",
      },
      {
        question: "Should I send my complaint letter by post or email?",
        answer:
          "For formal complaints, consider sending a physical letter by recorded delivery so you have proof of receipt. Email is acceptable for initial complaints and quicker response times. For serious matters, you may want to send both. Keep copies of all correspondence for your records.",
      },
      {
        question: "What should I do if my complaint is not resolved?",
        answer:
          "If you do not receive a satisfactory response, escalate your complaint to a senior manager or the company's complaints department. You can also contact relevant consumer protection agencies, ombudsman services, or industry regulators. Keep detailed records of all communications.",
      },
    ],
  },

  "thank-you-letter": {
    heading: "What is a Thank You Letter?",
    content:
      "A thank you letter is a formal expression of gratitude written to acknowledge someone's help, support, kindness, or contribution. In professional settings, thank you letters are commonly sent after job interviews, receiving gifts, completing projects, or when someone has gone above and beyond their duties. A well-written thank you letter strengthens professional relationships, leaves a positive impression, and demonstrates good manners and professionalism. It can also serve as a strategic career tool, particularly after interviews, where it reinforces your interest in the position and reminds the interviewer of your qualifications. Key elements include a specific mention of what you are thankful for, the impact their action had, and a forward-looking statement. Using a thank you letter generator ensures your message is properly structured, appropriately toned, and includes all the elements that make it meaningful and professional.",
    faqs: [
      {
        question: "When should I send a thank you letter after an interview?",
        answer:
          "Send a thank you letter within 24 hours of your interview. This keeps you fresh in the interviewer's mind and demonstrates your enthusiasm for the role. If you interviewed with multiple people, send a personalised thank you to each person, referencing specific topics you discussed.",
      },
      {
        question: "Should a thank you letter be handwritten or typed?",
        answer:
          "In most professional contexts, a typed letter or email is appropriate and expected. Handwritten notes are a nice touch for personal occasions or when you want to make an extra impression. For post-interview thank you letters, email is preferred due to the speed of delivery.",
      },
      {
        question: "How long should a thank you letter be?",
        answer:
          "A thank you letter should be brief and focused, typically three to four short paragraphs. It should express genuine gratitude, mention something specific, and look forward to the future. Avoid making it too long or turning it into another sales pitch for yourself.",
      },
    ],
  },

  "letter-of-intent": {
    heading: "What is a Letter of Intent?",
    content:
      "A letter of intent is a document that outlines a preliminary agreement between two or more parties before a formal contract is finalised. It establishes the key terms, conditions, and intentions of the parties involved in a potential transaction or arrangement. Letters of intent are commonly used in business acquisitions, real estate transactions, joint ventures, academic applications, and job applications. While not always legally binding, a letter of intent demonstrates serious interest and commitment, and it provides a framework for negotiations. Key elements include the names of the parties, a description of the proposed transaction, major terms and conditions, a timeline, and any confidentiality provisions. Using a letter of intent generator helps you create a clear, professional document that covers all essential elements and sets the right tone for productive negotiations.",
    faqs: [
      {
        question: "Is a letter of intent legally binding?",
        answer:
          "A letter of intent is generally not fully legally binding, though certain provisions within it, such as confidentiality clauses or exclusivity agreements, may be enforceable. The binding nature depends on the language used and local laws. Always specify which parts are binding and which are not. Consult a legal professional for important transactions.",
      },
      {
        question: "What is the difference between a letter of intent and a contract?",
        answer:
          "A letter of intent outlines preliminary terms and the intention to enter into a formal agreement, while a contract is a legally binding document with fully defined terms. The letter of intent typically precedes the contract and serves as a basis for negotiation. The final contract will contain more detailed terms and conditions.",
      },
      {
        question: "When should I use a letter of intent?",
        answer:
          "Use a letter of intent when you want to establish preliminary terms before committing to a full agreement. Common situations include business acquisitions, real estate purchases, joint ventures, academic or programme applications, and expressing serious interest in an opportunity that requires formal negotiation.",
      },
    ],
  },

  "apology-letter": {
    heading: "What is an Apology Letter?",
    content:
      "An apology letter is a formal written communication that acknowledges a mistake, expresses regret, and outlines steps to prevent the issue from recurring. In professional contexts, apology letters are used to address customer complaints, business errors, missed deadlines, service failures, or interpersonal misunderstandings. A sincere and well-structured apology letter can repair damaged relationships, restore trust, and demonstrate accountability. The most effective apology letters take full responsibility without making excuses, specifically acknowledge the impact of the mistake on the affected party, and provide concrete actions being taken to remedy the situation. Timing matters too; the sooner an apology is delivered, the more effective it tends to be. Using an apology letter generator helps you craft a thoughtful, professional response that strikes the right balance between sincerity and professionalism.",
    faqs: [
      {
        question: "What makes an effective apology letter?",
        answer:
          "An effective apology letter includes a clear acknowledgement of the specific mistake, a genuine expression of regret, an understanding of how it affected the other party, concrete steps being taken to fix the issue, and measures to prevent it from happening again. Avoid conditional language like 'if I offended you' and take full responsibility.",
      },
      {
        question: "Should a business apology letter offer compensation?",
        answer:
          "Offering compensation such as a refund, discount, or free service can demonstrate your commitment to making things right and help retain the customer's loyalty. The appropriateness of compensation depends on the severity of the error and your company's policies. Even a small gesture can significantly improve the customer's perception.",
      },
      {
        question: "How soon should I send an apology letter?",
        answer:
          "Send your apology letter as soon as possible after the incident. A prompt response shows you take the matter seriously and care about the affected party. Delays can make the situation worse and suggest indifference. Even if a full resolution is not yet available, acknowledge the issue quickly and provide updates as they come.",
      },
    ],
  },

  "authorization-letter": {
    heading: "What is an Authorization Letter?",
    content:
      "An authorization letter is a formal document that grants permission to another person to act on your behalf for specific tasks or transactions. It is commonly used when you cannot be physically present to handle matters personally, such as collecting documents, signing agreements, making financial transactions, or representing you in official proceedings. An authorization letter serves as legal proof that the designated person has your explicit permission to perform the stated actions. Key elements include clear identification of both the authoriser and the authorised person, a detailed description of the tasks being authorised, any limitations or conditions, the validity period, and appropriate signatures. Using an authorization letter generator ensures your letter meets formal requirements, clearly defines the scope of authority, and provides the legal clarity needed to avoid disputes or misunderstandings.",
    faqs: [
      {
        question: "What is the difference between an authorization letter and a power of attorney?",
        answer:
          "An authorization letter grants limited, specific permissions for particular tasks and is generally simpler and less formal. A power of attorney is a broader legal document that grants comprehensive authority to act on someone's behalf and typically requires notarisation. Use an authorization letter for simple, one-off tasks and a power of attorney for more complex or ongoing matters.",
      },
      {
        question: "Does an authorization letter need to be notarised?",
        answer:
          "Most authorization letters do not require notarisation for everyday tasks like collecting documents or packages. However, some institutions such as banks or government agencies may require notarised authorisation for certain transactions. Check with the institution where the letter will be used for their specific requirements.",
      },
      {
        question: "How long is an authorization letter valid?",
        answer:
          "An authorization letter is valid for the period specified in the document. If no end date is mentioned, it is generally assumed to be valid for the specific task only. For ongoing authorisation, specify clear start and end dates. It is good practice to include an expiry date to prevent misuse.",
      },
    ],
  },

  "permission-letter": {
    heading: "What is a Permission Letter?",
    content:
      "A permission letter is a formal document that requests or grants approval to do something that requires consent from an authority figure or organisation. Permission letters are used in various contexts including schools, workplaces, government agencies, and personal matters. Common uses include requesting time off work, seeking permission for a child to travel, obtaining consent to use intellectual property, or requesting access to facilities or records. A well-written permission letter clearly states who is requesting permission, what is being requested, the reason for the request, and any relevant details such as dates and locations. It should be polite, concise, and provide enough context for the recipient to make an informed decision. Using a permission letter generator helps you create a properly formatted, professional request that includes all necessary information and follows appropriate conventions.",
    faqs: [
      {
        question: "What is the difference between a permission letter and an authorization letter?",
        answer:
          "A permission letter is a request seeking approval to do something, while an authorization letter grants someone else the authority to act on your behalf. Permission letters ask for consent, whereas authorization letters give consent. The recipient of a permission letter has the authority to approve or deny the request.",
      },
      {
        question: "How formal should a permission letter be?",
        answer:
          "The level of formality depends on the context and recipient. Letters to employers, schools, and official organisations should be formal with proper salutations and professional language. Letters to neighbours or community members can be slightly less formal while remaining polite and respectful. Our generator adapts the tone to your chosen context.",
      },
      {
        question: "Should I include supporting documents with a permission letter?",
        answer:
          "Including supporting documents strengthens your request. For travel permission, attach itineraries or booking confirmations. For workplace requests, include relevant project details or schedules. For medical-related permissions, include appropriate documentation. Reference any attachments in the letter itself.",
      },
    ],
  },

  "sponsorship-letter": {
    heading: "What is a Sponsorship Letter?",
    content:
      "A sponsorship letter is a formal request sent to potential sponsors seeking financial support, resources, or partnerships for events, projects, organisations, or individuals. Whether you are organising a charity event, seeking corporate sponsorship for a sports team, or requesting funding for a community project, a compelling sponsorship letter can open doors to valuable partnerships. An effective sponsorship letter clearly explains the event or project, demonstrates its value and reach, outlines specific sponsorship tiers or benefits, and shows how the sponsorship will benefit both parties. The letter should include audience demographics, expected attendance or reach, media coverage opportunities, and branding visibility details. Using a sponsorship letter generator helps you create a persuasive, professional proposal that presents your opportunity in the best possible light and maximises your chances of securing support.",
    faqs: [
      {
        question: "How do I find potential sponsors for my event?",
        answer:
          "Look for companies whose target audience aligns with your event attendees. Research local businesses, industry leaders, and companies with active corporate social responsibility programmes. Check who sponsors similar events in your area or industry. Start with companies you already have relationships with, as warm contacts have higher success rates.",
      },
      {
        question: "What sponsorship benefits should I offer?",
        answer:
          "Common sponsorship benefits include logo placement on marketing materials, social media mentions, speaking opportunities, exhibition space, complimentary tickets, product placement, and post-event reports with engagement metrics. Create tiered sponsorship packages at different price points to appeal to various budgets.",
      },
      {
        question: "How far in advance should I send sponsorship letters?",
        answer:
          "Send sponsorship letters at least three to six months before your event. Large corporations often plan their sponsorship budgets a year in advance. Early outreach gives sponsors time to evaluate your proposal and allocate budget. Follow up within two weeks if you have not received a response.",
      },
    ],
  },

  "demand-letter": {
    heading: "What is a Demand Letter?",
    content:
      "A demand letter is a formal written communication that requests payment, action, or resolution of a dispute before pursuing legal action. It is typically the first step in the formal dispute resolution process and serves as a final attempt to resolve the matter without going to court. Demand letters are used for unpaid debts, breach of contract, property damage, refund requests, and other civil disputes. A well-crafted demand letter clearly states the facts of the situation, the legal basis for your claim, the specific amount or action demanded, and a deadline for compliance. It should also mention the consequences of non-compliance, such as legal proceedings. Using a demand letter generator helps you create a professional, legally-oriented document that is taken seriously by recipients and can often resolve disputes without the expense and time of court proceedings.",
    faqs: [
      {
        question: "Is a demand letter legally required before filing a lawsuit?",
        answer:
          "While not always legally required, sending a demand letter before filing a lawsuit is strongly recommended and is required in some jurisdictions for certain types of claims. It demonstrates good faith, may be viewed favourably by courts, and often resolves disputes without litigation. Many small claims courts expect you to have attempted resolution before filing.",
      },
      {
        question: "How long should I give the recipient to respond to a demand letter?",
        answer:
          "A reasonable deadline is typically 14 to 30 days, depending on the complexity of the matter and the amount involved. For straightforward payment demands, 14 days is common. For more complex issues requiring investigation, 30 days may be more appropriate. Clearly state the deadline in your letter.",
      },
      {
        question: "Should I have a lawyer write my demand letter?",
        answer:
          "A demand letter from a lawyer carries more weight but is not always necessary. For smaller claims, a well-written demand letter from you can be effective. For larger amounts or complex legal issues, consider consulting a solicitor. Our generator helps you create a professional letter that clearly communicates your position.",
      },
    ],
  },

  invoice: {
    heading: "What is an Invoice?",
    content:
      "An invoice is a commercial document issued by a seller to a buyer that itemises the products or services provided, their costs, and the payment terms. Invoices are essential for business record-keeping, tax compliance, and maintaining healthy cash flow. They serve as a legal record of the transaction and are necessary for both accounts receivable and accounts payable processes. A professional invoice should include your business details, the client's information, a unique invoice number, the date of issue, a clear description of goods or services, unit prices, quantities, subtotals, applicable taxes, the total amount due, payment terms, and accepted payment methods. Using an invoice generator saves time, reduces errors in calculations, ensures consistency across all your invoices, and presents a professional image to your clients. Proper invoicing also makes tax season significantly easier by keeping your financial records organised.",
    faqs: [
      {
        question: "What payment terms should I include on my invoice?",
        answer:
          "Common payment terms include Net 30 (due within 30 days), Net 15, Net 60, or Due on Receipt. Choose terms that balance your cash flow needs with industry standards. Clearly state the due date, accepted payment methods, and any late payment fees. For new clients, consider shorter payment terms or requiring a deposit.",
      },
      {
        question: "Do I need to include tax on my invoice?",
        answer:
          "This depends on your location and the nature of your business. In the UK, if you are VAT-registered, you must include VAT on your invoices. In the US, sales tax requirements vary by state. Our generator allows you to add tax at any rate. Consult a tax professional for your specific obligations.",
      },
      {
        question: "What is the difference between an invoice and a receipt?",
        answer:
          "An invoice is a request for payment issued before payment is made, while a receipt is confirmation that payment has been received. Invoices detail what is owed, whereas receipts confirm what has been paid. Both are important financial documents but serve different purposes in the transaction cycle.",
      },
    ],
  },

  receipt: {
    heading: "What is a Receipt?",
    content:
      "A receipt is a written acknowledgement that payment has been received for goods or services. Receipts serve as proof of purchase for the buyer and a record of sale for the seller. They are essential for returns, warranty claims, expense tracking, tax deductions, and financial record-keeping. A proper receipt includes the seller's business details, the date of the transaction, an itemised list of products or services purchased, the payment method, the amount paid, and any applicable taxes. For businesses, issuing receipts is not just good practice but often a legal requirement. Digital receipts are increasingly common and are as valid as paper ones. Using a receipt generator helps you create professional, consistent receipts quickly, ensuring all required information is included and your business records stay organised and accurate.",
    faqs: [
      {
        question: "Are digital receipts legally valid?",
        answer:
          "Yes, digital receipts are legally valid in most jurisdictions, including the UK, US, and EU. They carry the same legal weight as paper receipts for tax purposes, warranty claims, and proof of purchase. Ensure your digital receipts contain all required information including business details, date, items, and amounts.",
      },
      {
        question: "How long should I keep receipts?",
        answer:
          "For tax purposes, keep receipts for at least six years in the UK and three to seven years in the US. For warranty items, keep receipts until the warranty expires. For major purchases, keep receipts indefinitely. Digital storage makes it easy to archive receipts without physical clutter.",
      },
      {
        question: "What must a receipt legally include?",
        answer:
          "Legal requirements vary by jurisdiction, but generally a receipt should include the seller's name and address, the date of sale, a description of goods or services, the amount paid, the payment method, and any applicable tax amounts. VAT-registered businesses in the UK must include their VAT number.",
      },
    ],
  },

  "purchase-order": {
    heading: "What is a Purchase Order?",
    content:
      "A purchase order is a formal document sent by a buyer to a supplier to authorise a purchase of goods or services. It acts as a legally binding contract once accepted by the supplier, detailing exactly what is being ordered, the agreed prices, delivery dates, and payment terms. Purchase orders are fundamental to business procurement, providing a clear paper trail that helps prevent disputes, manage budgets, and track spending. They differ from invoices in that purchase orders are issued before goods are delivered, while invoices are issued after. A comprehensive purchase order includes a unique PO number, the buyer's and supplier's details, item descriptions with quantities and prices, delivery address and expected date, payment terms, and any special instructions. Using a purchase order generator streamlines your procurement process, ensures consistency, and creates professional documents that protect both buyer and supplier interests.",
    faqs: [
      {
        question: "What is the difference between a purchase order and an invoice?",
        answer:
          "A purchase order is created by the buyer to request goods or services and is sent to the supplier before the transaction. An invoice is created by the supplier to request payment and is sent to the buyer after goods or services have been delivered. The purchase order initiates the transaction, while the invoice closes it.",
      },
      {
        question: "Is a purchase order legally binding?",
        answer:
          "A purchase order becomes a legally binding contract once the supplier accepts it, either by written confirmation or by fulfilling the order. Before acceptance, it is merely an offer. Include clear terms and conditions on your purchase orders to protect your interests and ensure both parties understand their obligations.",
      },
      {
        question: "Do small businesses need to use purchase orders?",
        answer:
          "While not legally required, purchase orders benefit businesses of all sizes by creating a clear record of orders, preventing misunderstandings, and aiding financial tracking. Even small businesses benefit from the organisation and professionalism that purchase orders bring to their procurement process.",
      },
    ],
  },

  quotation: {
    heading: "What is a Quotation?",
    content:
      "A quotation, also known as a quote or price quote, is a formal document that specifies the cost of goods or services before a buyer commits to a purchase. Quotations provide potential customers with a clear breakdown of prices, enabling them to compare offerings and make informed purchasing decisions. Unlike estimates, quotations are typically fixed-price commitments that remain valid for a specified period. A professional quotation includes your business details, the client's information, a detailed breakdown of products or services with individual prices, quantities, applicable taxes, total cost, validity period, and terms and conditions. Clear and detailed quotations reduce the risk of disputes and set proper expectations from the outset. Using a quotation generator helps you create consistent, professional quotes quickly, allowing you to respond to enquiries promptly and increase your chances of winning business.",
    faqs: [
      {
        question: "What is the difference between a quotation and an estimate?",
        answer:
          "A quotation is a fixed price that the seller commits to for a specified period, while an estimate is an approximate cost that may change as work progresses. Quotations are more formal and binding, whereas estimates provide a general idea of cost. Use quotes for well-defined projects and estimates when scope may vary.",
      },
      {
        question: "How long should a quotation remain valid?",
        answer:
          "Most quotations are valid for 30 days, though this can vary by industry and the nature of the goods or services. For materials subject to price fluctuations, shorter validity periods of 7 to 14 days may be appropriate. Always clearly state the validity period on your quotation.",
      },
      {
        question: "Can a quotation be changed after it is sent?",
        answer:
          "A quotation can be revised before the client accepts it, though this may affect your credibility. If costs have genuinely changed, provide a new quotation with an explanation. Once a quotation is accepted, it generally becomes a binding agreement and changes would need to be negotiated with the client.",
      },
    ],
  },

  "business-proposal": {
    heading: "What is a Business Proposal?",
    content:
      "A business proposal is a formal document that outlines a plan to provide products, services, or solutions to a prospective client or partner. It is a persuasive sales tool that demonstrates your understanding of the client's needs and explains how your offering addresses them. Business proposals can be solicited, in response to a request for proposal, or unsolicited, when you proactively pitch your services. An effective business proposal includes an executive summary, a clear problem statement, your proposed solution, a detailed scope of work, pricing and timeline, your qualifications and relevant experience, and terms and conditions. The proposal should focus on the client's benefits rather than just listing features. Using a business proposal generator helps you create a professional, well-structured document that presents your offering compellingly and increases your chances of winning new business.",
    faqs: [
      {
        question: "How long should a business proposal be?",
        answer:
          "The length depends on the complexity of the project. Simple proposals may be two to five pages, while complex projects may require 10 to 20 pages or more. Focus on quality over quantity. Every section should add value and help the client make a decision. Avoid unnecessary padding that dilutes your key messages.",
      },
      {
        question: "What makes a business proposal successful?",
        answer:
          "Successful proposals demonstrate a deep understanding of the client's needs, present a clear and compelling solution, provide social proof through case studies or testimonials, offer competitive pricing with clear value justification, and include a strong call to action. Personalise every proposal rather than using a generic template.",
      },
      {
        question: "Should I include pricing in my business proposal?",
        answer:
          "Yes, include pricing unless the client has specifically asked for a separate quote. Present pricing clearly with a breakdown of costs and explain the value behind each price point. Offering multiple pricing tiers or packages gives the client options and can increase your close rate.",
      },
    ],
  },

  "meeting-minutes": {
    heading: "What are Meeting Minutes?",
    content:
      "Meeting minutes are a written record of what was discussed, decided, and assigned during a meeting. They serve as an official account of proceedings and provide a reference for attendees and absentees alike. Good meeting minutes capture key decisions, action items with assigned owners and deadlines, and any voting results. They are essential for accountability, ensuring that follow-up tasks are completed and that there is a clear record of organisational decision-making. Meeting minutes are particularly important for board meetings, committee meetings, and project team meetings where formal documentation is required. Key elements include the date and time, attendees, agenda items discussed, decisions made, action items assigned, and the date of the next meeting. Using a meeting minutes generator helps you create organised, consistent records quickly, so you can focus on participating in the meeting rather than worrying about formatting.",
    faqs: [
      {
        question: "What should meeting minutes include?",
        answer:
          "Meeting minutes should include the meeting date, time, and location, a list of attendees and absentees, the agenda items discussed, key decisions made, action items with owners and deadlines, any votes taken and their results, and the date of the next meeting. Keep the language clear and objective.",
      },
      {
        question: "How detailed should meeting minutes be?",
        answer:
          "Meeting minutes should capture decisions and action items rather than recording every word spoken. Focus on what was decided, not the full discussion that led to the decision. Include enough context for someone who was not present to understand what happened and what needs to be done.",
      },
      {
        question: "When should meeting minutes be distributed?",
        answer:
          "Distribute meeting minutes within 24 to 48 hours of the meeting while discussions are still fresh. This allows attendees to review for accuracy and gives action item owners immediate visibility of their responsibilities. Use email or your team's collaboration platform for distribution.",
      },
    ],
  },

  memo: {
    heading: "What is a Memo?",
    content:
      "A memo, short for memorandum, is an internal communication document used within organisations to inform employees about policies, procedures, updates, or important announcements. Unlike external business letters, memos are designed for internal audiences and follow a distinct format with clear To, From, Date, and Subject lines. Memos are used for a variety of purposes including announcing policy changes, sharing project updates, requesting action, providing instructions, or documenting internal decisions. They are typically brief, direct, and focused on a single topic to ensure the message is clearly understood. The tone is professional but can be less formal than external correspondence since the audience is within the same organisation. Using a memo generator ensures your internal communications are well-structured, professional, and include all the standard formatting elements that employees expect, helping your messages be taken seriously and acted upon.",
    faqs: [
      {
        question: "When should I use a memo instead of an email?",
        answer:
          "Memos are best for formal internal announcements, policy changes, and important decisions that need to be documented as official records. Use emails for routine day-to-day communication. Memos carry more weight and formality, making them appropriate for communications that need to be archived or referenced later.",
      },
      {
        question: "How long should a memo be?",
        answer:
          "Most memos should be one page or less, covering a single topic clearly and concisely. If your memo exceeds one page, consider whether the information could be better communicated through a report or meeting. Use bullet points and headings to make longer memos scannable and easy to follow.",
      },
      {
        question: "What is the correct memo format?",
        answer:
          "A standard memo format includes a header with To, From, Date, and Subject fields, followed by the body of the memo. The body typically starts with a summary of the key point, followed by supporting details, and ends with any required actions or next steps. No closing signature is needed.",
      },
    ],
  },

  "press-release": {
    heading: "What is a Press Release?",
    content:
      "A press release is an official statement delivered to members of the media to announce something newsworthy about a company, product, event, or achievement. It is a fundamental public relations tool used to generate media coverage and public awareness. Press releases follow a specific format that journalists expect, including a compelling headline, a dateline, a strong lead paragraph that covers the essential who, what, when, where, and why, supporting details in the body, a company boilerplate, and media contact information. An effective press release presents information in a newsworthy angle that makes journalists want to cover the story. It should be factual, concise, and free of excessive promotional language. Using a press release generator helps you create properly formatted announcements that follow industry standards, increasing the likelihood that journalists will read and publish your news.",
    faqs: [
      {
        question: "How do I write a newsworthy press release?",
        answer:
          "Focus on what makes your announcement genuinely interesting to the public, not just to your company. Include statistics, quotes from key figures, and the impact of the news. Answer why someone who has never heard of your company should care about this announcement. Tie your news to broader industry trends when possible.",
      },
      {
        question: "Where should I distribute my press release?",
        answer:
          "Distribute your press release through wire services like PR Newswire or Business Wire for broad reach, directly to relevant journalists and bloggers, on your company website's press page, and through your social media channels. Building relationships with journalists in your industry will increase pickup rates over time.",
      },
      {
        question: "How long should a press release be?",
        answer:
          "A press release should be 400 to 600 words, fitting on one to two pages. Journalists prefer concise releases that get to the point quickly. Put the most important information in the first paragraph, as many readers will not read beyond it. Use the inverted pyramid structure with decreasing importance.",
      },
    ],
  },

  "job-description": {
    heading: "What is a Job Description?",
    content:
      "A job description is a formal document that outlines the responsibilities, requirements, qualifications, and expectations for a specific role within an organisation. It serves multiple purposes: attracting qualified candidates, setting performance expectations, defining the scope of the role, and providing a basis for evaluating applicants. A well-written job description improves recruitment outcomes by helping candidates self-assess their fit for the position. Key elements include the job title, department, reporting structure, key responsibilities, required and preferred qualifications, skills and competencies, salary range or band, benefits, and information about the company culture. Using inclusive language and avoiding unnecessary jargon helps attract a diverse pool of candidates. A job description generator helps you create comprehensive, professional descriptions that cover all essential elements and present your opportunity in the best possible light to potential candidates.",
    faqs: [
      {
        question: "Should I include a salary range in the job description?",
        answer:
          "Including a salary range is increasingly recommended and is now required by law in some jurisdictions. Posting salary ranges attracts more qualified applicants, saves time by filtering out mismatched expectations, and demonstrates transparency. If you cannot share exact figures, provide a broad range or indicate that compensation is competitive.",
      },
      {
        question: "How can I write an inclusive job description?",
        answer:
          "Use gender-neutral language and avoid unnecessary jargon or requirements that could exclude qualified candidates. Focus on essential skills rather than years of experience. Include a diversity statement and ensure the requirements listed are genuinely necessary for the role rather than nice-to-have preferences.",
      },
      {
        question: "How long should a job description be?",
        answer:
          "An effective job description is typically 600 to 800 words. It should be detailed enough to give candidates a clear picture of the role but concise enough to hold their attention. Use bullet points for responsibilities and requirements to improve readability. Avoid lengthy paragraphs.",
      },
    ],
  },

  "company-profile": {
    heading: "What is a Company Profile?",
    content:
      "A company profile is a professional document that provides an overview of a business, including its history, mission, products or services, achievements, and key personnel. It serves as an introduction to your company for potential clients, investors, partners, and stakeholders. A compelling company profile builds credibility, differentiates your business from competitors, and creates a strong first impression. It is commonly used in proposals, on websites, in marketing materials, and when seeking investment or partnerships. Key elements include the company overview and history, mission and vision statements, products or services description, target market, competitive advantages, key team members, notable clients or projects, and contact information. Using a company profile generator helps you organise this information into a professional, polished document that effectively communicates your company's story and value proposition.",
    faqs: [
      {
        question: "How long should a company profile be?",
        answer:
          "A standard company profile is one to two pages for a brief overview, or up to five pages for a more detailed version. The length depends on your purpose and audience. For inclusion in proposals, keep it concise at one page. For investor presentations or partnership discussions, a more detailed profile is appropriate.",
      },
      {
        question: "What makes a company profile effective?",
        answer:
          "An effective company profile tells a compelling story, highlights unique selling points, includes concrete achievements and statistics, and is tailored to the intended audience. Use professional language, include client testimonials or case studies where possible, and keep the design clean and branded. Focus on what makes your company different.",
      },
      {
        question: "How often should I update my company profile?",
        answer:
          "Review and update your company profile at least annually or whenever significant changes occur such as new products, major clients, team changes, awards, or strategic shifts. An outdated profile can damage credibility, so ensure all statistics, team information, and achievements are current.",
      },
    ],
  },

  "scope-of-work": {
    heading: "What is a Scope of Work?",
    content:
      "A scope of work is a detailed document that defines the specific tasks, deliverables, timelines, and boundaries of a project or contract. It serves as a mutual agreement between the client and service provider about what will be done, how it will be done, and when it will be completed. A well-defined scope of work prevents scope creep, reduces misunderstandings, and provides a clear reference point for evaluating project progress and completion. Key elements include a project overview, specific deliverables with descriptions, acceptance criteria, milestones and deadlines, resource requirements, assumptions and constraints, and the change management process. The scope of work is typically part of a larger contract but can stand alone as a project planning document. Using a scope of work generator helps you create thorough, professional documents that clearly define expectations and protect both parties throughout the project lifecycle.",
    faqs: [
      {
        question: "How detailed should a scope of work be?",
        answer:
          "A scope of work should be detailed enough that both parties have a clear, shared understanding of what will be delivered. Include specific deliverables, quantities, quality standards, and deadlines. However, avoid being so prescriptive that it limits the service provider's ability to find the best solutions. Strike a balance between clarity and flexibility.",
      },
      {
        question: "What is scope creep and how does a scope of work prevent it?",
        answer:
          "Scope creep is the gradual expansion of project requirements beyond the original agreement, often without corresponding increases in budget or timeline. A well-written scope of work prevents this by clearly defining what is and is not included, establishing a formal change request process, and providing a reference point for evaluating new requests.",
      },
      {
        question: "Should a scope of work include pricing?",
        answer:
          "A scope of work can include pricing but often does not, as pricing is typically covered in a separate proposal or contract. If pricing is included, clearly link costs to specific deliverables. Some organisations prefer to keep the scope of work focused on what will be done, with commercial terms in a separate agreement.",
      },
    ],
  },

  "project-brief": {
    heading: "What is a Project Brief?",
    content:
      "A project brief is a concise document that outlines the key information about a project, serving as a guide for all stakeholders involved. It provides a high-level overview of the project's objectives, scope, timeline, budget, and success criteria without going into the granular detail of a full project plan. A project brief is typically created at the start of a project to align team members and stakeholders on what needs to be achieved and why. It answers fundamental questions about the project's purpose, target audience, key deliverables, constraints, and measures of success. The brief serves as a reference point throughout the project to ensure activities stay aligned with the original vision. Using a project brief generator helps you capture all essential project information in a clear, organised format that facilitates better communication and decision-making from day one.",
    faqs: [
      {
        question: "What is the difference between a project brief and a project plan?",
        answer:
          "A project brief is a high-level overview document that outlines what the project aims to achieve and why. A project plan is a detailed document that explains how the project will be executed, including task breakdowns, resource allocation, and detailed schedules. The brief typically comes first and informs the creation of the detailed plan.",
      },
      {
        question: "Who should write the project brief?",
        answer:
          "The project brief is typically written by the project manager or project sponsor in collaboration with key stakeholders. Input from the client, team leads, and subject matter experts ensures the brief accurately captures requirements and constraints. The brief should be reviewed and approved by all key stakeholders before work begins.",
      },
      {
        question: "How long should a project brief be?",
        answer:
          "A project brief should be concise, typically one to three pages. Its purpose is to provide a quick overview, not exhaustive detail. If your brief is becoming too long, consider moving detailed information into appendices or separate documents. The brief should be easy to read and reference quickly.",
      },
    ],
  },

  nda: {
    heading: "What is a Non-Disclosure Agreement (NDA)?",
    content:
      "A non-disclosure agreement, commonly known as an NDA, is a legally binding contract that establishes a confidential relationship between parties and protects sensitive information from being shared with unauthorised third parties. NDAs are essential in business situations where proprietary information, trade secrets, client data, or intellectual property must be discussed with external parties such as potential partners, investors, contractors, or employees. They can be unilateral, where only one party shares confidential information, or mutual, where both parties share sensitive information. Key elements of an NDA include the definition of confidential information, the obligations of the receiving party, the duration of the agreement, permitted disclosures, and remedies for breach. Using an NDA generator helps you create a professional, comprehensive agreement that clearly defines what is protected, reducing the risk of disputes and providing legal recourse if confidentiality is breached.",
    faqs: [
      {
        question: "When should I use an NDA?",
        answer:
          "Use an NDA before sharing confidential business information with potential partners, investors, employees, contractors, or any third party. Common situations include business negotiations, hiring processes, product development discussions, vendor evaluations, and merger or acquisition talks. It is always better to have an NDA in place before sensitive information is disclosed.",
      },
      {
        question: "What is the difference between a unilateral and mutual NDA?",
        answer:
          "A unilateral NDA protects information shared by one party only, while a mutual NDA protects information shared by both parties. Use a unilateral NDA when only you are sharing confidential information, such as with employees or contractors. Use a mutual NDA for business partnerships, joint ventures, or negotiations where both parties share sensitive information.",
      },
      {
        question: "How long does an NDA last?",
        answer:
          "NDA durations typically range from one to five years, though some trade secrets may warrant indefinite protection. The appropriate duration depends on the nature of the information and the industry. Technology-related NDAs may have shorter terms as information becomes outdated quickly, while NDAs covering trade secrets or proprietary processes may last longer.",
      },
    ],
  },

  "employment-contract": {
    heading: "What is an Employment Contract?",
    content:
      "An employment contract is a legally binding agreement between an employer and an employee that defines the terms and conditions of the employment relationship. It outlines rights, responsibilities, and obligations for both parties, providing clarity and protection throughout the duration of employment. A comprehensive employment contract covers essential details such as job title and duties, compensation and benefits, working hours, holiday entitlement, probation period, notice requirements, confidentiality obligations, and termination conditions. Employment contracts can be permanent, fixed-term, or for specific projects, and they must comply with local employment laws and regulations. Having a clear, written employment contract reduces the risk of misunderstandings and disputes while ensuring both employer and employee know what is expected. Using an employment contract generator helps you create a thorough, professional agreement that covers all essential terms and follows standard legal conventions.",
    faqs: [
      {
        question: "Is a written employment contract legally required?",
        answer:
          "In the UK, employers must provide a written statement of employment particulars from day one. In the US, most employment is at-will unless a contract states otherwise. Regardless of legal requirements, a written contract is strongly recommended as it protects both parties, clarifies expectations, and reduces the risk of disputes.",
      },
      {
        question: "What is the difference between an employment contract and an offer letter?",
        answer:
          "An offer letter is a preliminary document that outlines basic terms and invites the candidate to accept the position. An employment contract is a more detailed, legally binding agreement that covers all terms and conditions of employment. The offer letter is typically followed by the employment contract before or on the start date.",
      },
      {
        question: "Can an employment contract be changed after signing?",
        answer:
          "Changes to an employment contract require the agreement of both parties. Neither the employer nor the employee can unilaterally change contract terms. Proposed changes should be discussed, agreed upon in writing, and signed by both parties. Significant changes may require a new contract entirely.",
      },
    ],
  },

  "service-agreement": {
    heading: "What is a Service Agreement?",
    content:
      "A service agreement is a contract between a service provider and a client that outlines the terms under which services will be delivered. It defines the scope of work, payment terms, timelines, responsibilities, and the rights and obligations of both parties. Service agreements are used by freelancers, consultants, agencies, and businesses of all sizes to formalise their working relationships with clients. A well-drafted service agreement protects both parties by clearly defining expectations and providing a framework for resolving disputes. Key elements include a detailed description of services, deliverables, payment schedule, intellectual property rights, confidentiality clauses, liability limitations, termination conditions, and dispute resolution procedures. Using a service agreement generator helps you create a comprehensive, professional contract that covers all essential terms, reducing the risk of misunderstandings and protecting your business interests.",
    faqs: [
      {
        question: "What is the difference between a service agreement and a scope of work?",
        answer:
          "A service agreement is the overarching contract that governs the business relationship, including legal terms, payment, liability, and termination. A scope of work is a specific document detailing what will be delivered for a particular project. A service agreement may reference multiple scopes of work over the course of the relationship.",
      },
      {
        question: "Should I always use a service agreement?",
        answer:
          "Yes, even for small projects or work with trusted clients. A written service agreement protects both parties, prevents misunderstandings, and provides legal recourse if issues arise. Verbal agreements are difficult to enforce and can lead to costly disputes. The investment in creating a proper agreement is always worthwhile.",
      },
      {
        question: "What happens if a service agreement is breached?",
        answer:
          "When a service agreement is breached, the non-breaching party can seek remedies as outlined in the agreement, such as mediation, arbitration, or legal action. Include a clear dispute resolution clause in your agreement. Document any breaches in writing and attempt to resolve the issue amicably before pursuing formal remedies.",
      },
    ],
  },

  "rental-agreement": {
    heading: "What is a Rental Agreement?",
    content:
      "A rental agreement is a legally binding contract between a landlord and a tenant that outlines the terms and conditions for renting a property. It establishes the rights and obligations of both parties, covering essential details such as the rental period, monthly rent amount, security deposit, maintenance responsibilities, house rules, and termination conditions. Rental agreements can be fixed-term leases, which run for a specific period, or periodic tenancies, which renew automatically on a monthly or weekly basis. A clear rental agreement protects both landlord and tenant by setting expectations, preventing disputes, and providing a legal framework for addressing issues that may arise during the tenancy. Using a rental agreement generator helps you create a comprehensive document that covers all essential terms, complies with standard practices, and presents a professional image to prospective tenants.",
    faqs: [
      {
        question: "What is the difference between a lease and a rental agreement?",
        answer:
          "A lease is typically a fixed-term agreement, usually for six to twelve months, that cannot be changed during the term without both parties' agreement. A rental agreement, often month-to-month, is more flexible and can be modified or terminated with shorter notice. Leases offer more stability, while rental agreements offer more flexibility.",
      },
      {
        question: "What should a rental agreement include?",
        answer:
          "A rental agreement should include the names of all parties, the property address, rental amount and due date, security deposit details, lease duration, maintenance responsibilities, rules about pets and smoking, guest policies, utility responsibilities, termination notice requirements, and any other specific terms agreed upon.",
      },
      {
        question: "Can a landlord change the terms of a rental agreement?",
        answer:
          "For fixed-term leases, terms generally cannot be changed until the lease expires unless both parties agree. For periodic tenancies, the landlord can propose changes with proper notice, typically one to two months. Any changes should be documented in writing and agreed upon by both parties.",
      },
    ],
  },

  "loan-agreement": {
    heading: "What is a Loan Agreement?",
    content:
      "A loan agreement is a legally binding contract between a lender and a borrower that outlines the terms and conditions of a loan. It specifies the loan amount, interest rate, repayment schedule, collateral if any, and the consequences of default. Loan agreements are used for personal loans between individuals, business loans, equipment financing, and any situation where money is lent with the expectation of repayment. Even between friends or family members, a written loan agreement is essential to prevent misunderstandings and protect both parties' interests. A comprehensive loan agreement covers the principal amount, interest calculation method, payment frequency, late payment penalties, prepayment terms, and default provisions. Using a loan agreement generator helps you create a clear, professional document that defines all essential terms, ensures both parties understand their obligations, and provides legal protection in case of disputes.",
    faqs: [
      {
        question: "Do I need a loan agreement for personal loans between friends or family?",
        answer:
          "Yes, absolutely. Written loan agreements are especially important for personal loans because they prevent misunderstandings that can damage relationships. Clearly document the amount, interest rate if any, repayment schedule, and what happens if payments are missed. A written agreement protects both parties and preserves the relationship.",
      },
      {
        question: "What interest rate should I charge on a personal loan?",
        answer:
          "For personal loans, the interest rate should be reasonable and comply with local usury laws that cap maximum rates. In the UK, there are no specific caps on personal loans between individuals, but the rate should be fair. For family loans, some choose zero interest, though this may have tax implications. Research applicable laws in your jurisdiction.",
      },
      {
        question: "What happens if the borrower defaults on the loan?",
        answer:
          "Your loan agreement should specify the consequences of default, which may include acceleration of the full balance, additional fees, seizure of collateral, or legal action. The agreement should define what constitutes a default, such as missing a certain number of payments. Having clear default terms in writing makes enforcement easier.",
      },
    ],
  },

  "partnership-agreement": {
    heading: "What is a Partnership Agreement?",
    content:
      "A partnership agreement is a legal document that establishes the terms, conditions, and operating procedures for a business partnership between two or more parties. It defines each partner's roles, responsibilities, capital contributions, profit-sharing arrangements, decision-making authority, and the process for resolving disputes or dissolving the partnership. Without a written partnership agreement, partnerships are governed by default laws that may not reflect the partners' actual intentions. A well-drafted partnership agreement prevents conflicts by addressing potential issues before they arise, including what happens if a partner wants to leave, how new partners can join, and how disagreements will be resolved. Key elements include the business purpose, partner contributions, profit and loss distribution, management responsibilities, and exit procedures. Using a partnership agreement generator helps you create a comprehensive document that protects all partners' interests and establishes a solid foundation for the business relationship.",
    faqs: [
      {
        question: "Do we need a partnership agreement if we trust each other?",
        answer:
          "Yes, even the most trusted partnerships benefit from a written agreement. Business circumstances change, and a clear agreement prevents misunderstandings that can arise over time. It protects all partners' interests, provides a framework for decision-making, and addresses scenarios that may not have been discussed informally.",
      },
      {
        question: "How should profits be split in a partnership?",
        answer:
          "Profit distribution should reflect each partner's contributions, whether financial, intellectual, or operational. Common approaches include equal splits, percentage-based splits proportional to investment, or arrangements where one partner draws a salary before profits are divided. The agreement should clearly define how and when profits will be distributed.",
      },
      {
        question: "What happens if a partner wants to leave the partnership?",
        answer:
          "Your partnership agreement should include exit provisions covering buyout terms, valuation methods, notice periods, and non-compete clauses. Without these provisions, a partner's departure can be disruptive and potentially force the dissolution of the business. Address these scenarios proactively in your agreement.",
      },
    ],
  },

  "bill-of-sale": {
    heading: "What is a Bill of Sale?",
    content:
      "A bill of sale is a legal document that records the transfer of ownership of personal property from a seller to a buyer. It serves as proof of purchase and protects both parties in the transaction by documenting the terms of the sale including the items sold, the purchase price, and the date of transfer. Bills of sale are commonly used for vehicle sales, equipment purchases, business asset transfers, and private sales of valuable items. They are particularly important for high-value transactions or items that require registration, such as vehicles and boats. A comprehensive bill of sale includes the names and addresses of both parties, a detailed description of the property, the sale price, payment method, warranties or disclaimers, and both parties' signatures. Using a bill of sale generator helps you create a legally sound document that clearly records the transaction and provides protection against future disputes.",
    faqs: [
      {
        question: "When do I need a bill of sale?",
        answer:
          "You need a bill of sale whenever you buy or sell personal property privately, especially for vehicles, boats, equipment, livestock, or other valuable items. Many states and jurisdictions require a bill of sale for vehicle registration transfers. Even when not legally required, a bill of sale protects both buyer and seller by documenting the transaction.",
      },
      {
        question: "Does a bill of sale need to be notarised?",
        answer:
          "Requirements vary by jurisdiction and the type of property being sold. Some states require notarisation for vehicle bills of sale, while others do not. For high-value transactions, notarisation adds an extra layer of authentication. Check your local requirements, especially for vehicles and real property.",
      },
      {
        question: "What is the difference between a bill of sale and a receipt?",
        answer:
          "A bill of sale is a legal document that transfers ownership and typically includes more detailed terms such as warranties, descriptions, and conditions of the sale. A receipt simply confirms that payment was made. For private sales of valuable items, a bill of sale provides significantly more legal protection than a simple receipt.",
      },
    ],
  },

  "promissory-note": {
    heading: "What is a Promissory Note?",
    content:
      "A promissory note is a written financial instrument in which one party, the maker, promises to pay a specific sum of money to another party, the payee, under agreed-upon terms. It is essentially a formal IOU that creates a legal obligation to repay the debt. Promissory notes are simpler than loan agreements but carry legal weight, making them suitable for straightforward lending arrangements between individuals or businesses. They specify the principal amount, interest rate if applicable, repayment schedule, maturity date, and the consequences of default. Promissory notes are commonly used for personal loans, real estate transactions, student loans, and business financing. They can be secured, backed by collateral, or unsecured, based solely on the maker's promise to pay. Using a promissory note generator helps you create a clear, legally valid document that protects the interests of both the lender and borrower.",
    faqs: [
      {
        question: "What is the difference between a promissory note and a loan agreement?",
        answer:
          "A promissory note is a simpler document where the borrower promises to pay the lender. A loan agreement is a more comprehensive contract that details the rights and obligations of both parties. For simple, straightforward loans, a promissory note may be sufficient. For complex transactions with multiple conditions, a full loan agreement is more appropriate.",
      },
      {
        question: "Is a promissory note legally enforceable?",
        answer:
          "Yes, a properly executed promissory note is legally enforceable. To be valid, it must clearly state the amount, identify the parties, include the repayment terms, and be signed by the maker. Having the note witnessed or notarised strengthens its enforceability, though this is not always legally required.",
      },
      {
        question: "Can a promissory note be transferred to someone else?",
        answer:
          "Yes, promissory notes can be negotiable or non-negotiable. A negotiable promissory note can be endorsed and transferred to a third party, who then becomes the payee. A non-negotiable note can only be enforced by the original payee. Specify whether the note is negotiable in the document.",
      },
    ],
  },

  "eviction-notice": {
    heading: "What is an Eviction Notice?",
    content:
      "An eviction notice is a formal legal document served by a landlord to a tenant, notifying them that they must vacate the rental property within a specified time period. Eviction notices are issued for various reasons including non-payment of rent, lease violations, property damage, illegal activities, or when the landlord needs to recover the property. The notice is the required first step in the legal eviction process and must comply with local tenancy laws regarding the notice period, delivery method, and content. A valid eviction notice clearly states the reason for eviction, the date by which the tenant must vacate, any opportunity to remedy the situation, and the consequences of non-compliance. Using an eviction notice generator helps landlords create properly formatted, legally oriented notices that follow standard conventions and clearly communicate the required information to tenants.",
    faqs: [
      {
        question: "How much notice must a landlord give for eviction?",
        answer:
          "Notice periods vary significantly by jurisdiction and the reason for eviction. In the UK, Section 21 notices require two months, while Section 8 notices vary from two weeks to two months depending on the grounds. In the US, notice periods range from three days to 90 days depending on the state and reason. Always check your local laws.",
      },
      {
        question: "Can a tenant fight an eviction notice?",
        answer:
          "Yes, tenants have the right to challenge an eviction through the courts. Common defences include improper notice, landlord retaliation, discrimination, or the landlord's failure to maintain the property. Tenants should seek legal advice promptly upon receiving an eviction notice. Landlords should ensure their eviction process strictly follows local laws.",
      },
      {
        question: "What happens if a tenant does not leave after the notice period?",
        answer:
          "If a tenant does not vacate after the notice period expires, the landlord must go through the formal court eviction process. Self-help evictions, such as changing locks or removing belongings, are illegal in most jurisdictions. The landlord must obtain a court order for possession before physically removing the tenant.",
      },
    ],
  },

  "power-of-attorney": {
    heading: "What is a Power of Attorney?",
    content:
      "A power of attorney is a legal document that authorises one person, known as the agent or attorney-in-fact, to act on behalf of another person, known as the principal, in legal, financial, or medical matters. This document is essential for planning ahead in case you become unable to manage your own affairs due to illness, injury, or absence. Powers of attorney can be general, granting broad authority, or limited, restricting authority to specific tasks or time periods. They can also be durable, meaning they remain effective if the principal becomes incapacitated, or non-durable, which terminate upon incapacitation. A properly executed power of attorney includes clear identification of both parties, a specific description of the powers granted, any limitations, the duration, and appropriate signatures and witnesses. Using a power of attorney generator helps you create a comprehensive document that clearly defines the scope of authority being granted.",
    faqs: [
      {
        question: "What types of power of attorney are there?",
        answer:
          "The main types are general (broad authority over financial and legal matters), limited or special (authority for specific tasks), durable (remains effective if the principal becomes incapacitated), springing (only takes effect upon a specific event like incapacitation), and medical or healthcare (authority over medical decisions). Choose the type that best fits your needs.",
      },
      {
        question: "Does a power of attorney need to be notarised?",
        answer:
          "Requirements vary by jurisdiction and the type of power of attorney. Many states require notarisation for real estate transactions. In the UK, lasting powers of attorney must be registered with the Office of the Public Guardian. For important powers of attorney, notarisation or formal registration adds legal protection and is recommended.",
      },
      {
        question: "Can a power of attorney be revoked?",
        answer:
          "Yes, a principal can revoke a power of attorney at any time as long as they have mental capacity. The revocation should be in writing, and all relevant parties including financial institutions and the agent should be notified. Some jurisdictions require the revocation to be registered or recorded where the original was filed.",
      },
    ],
  },

  affidavit: {
    heading: "What is an Affidavit?",
    content:
      "An affidavit is a written statement of facts made voluntarily under oath or affirmation, signed before an authorised official such as a notary public or commissioner for oaths. Affidavits serve as sworn evidence and carry the same weight as oral testimony given in court. They are used in a wide range of legal, business, and personal contexts including court proceedings, immigration applications, name changes, property transactions, and identity verification. Because affidavits are made under oath, providing false information constitutes perjury, which is a criminal offence. A proper affidavit includes the affiant's identification, a clear statement of facts in numbered paragraphs, a jurat or oath clause, the affiant's signature, and the official's notarisation or attestation. Using an affidavit generator helps you create a properly structured document with all required elements, ensuring your sworn statement meets legal requirements.",
    faqs: [
      {
        question: "Does an affidavit need to be notarised?",
        answer:
          "Yes, most affidavits require notarisation or attestation by an authorised official to be legally valid. The notary or commissioner verifies the identity of the person making the affidavit and witnesses their signature. Some jurisdictions accept sworn affidavits before other authorised persons such as court clerks or certain government officials.",
      },
      {
        question: "What is the penalty for lying in an affidavit?",
        answer:
          "Making false statements in an affidavit constitutes perjury, which is a serious criminal offence. Penalties vary by jurisdiction but can include fines and imprisonment. Always ensure that every statement in your affidavit is truthful and accurate. If you are uncertain about any facts, state them as beliefs rather than facts.",
      },
      {
        question: "What is the difference between an affidavit and a statutory declaration?",
        answer:
          "Both are sworn written statements, but they serve slightly different purposes. Affidavits are typically used in legal proceedings and court matters, while statutory declarations are used for administrative and non-court purposes. In practice, the terms are sometimes used interchangeably, though the formal requirements may differ by jurisdiction.",
      },
    ],
  },

  "consent-form": {
    heading: "What is a Consent Form?",
    content:
      "A consent form is a document that records a person's informed agreement to participate in an activity, receive a treatment, or allow the use of their information or likeness. Consent forms are widely used in healthcare, research, education, photography, events, and business contexts. They serve the dual purpose of informing the participant about what they are agreeing to and providing legal protection for the organisation obtaining consent. An effective consent form clearly describes the activity or procedure, explains potential risks and benefits, outlines the participant's rights including the right to withdraw consent, and is written in plain language that the participant can easily understand. For consent to be valid, it must be given voluntarily, by a person with capacity to consent, and with full understanding of what is being agreed to. Using a consent form generator helps you create clear, comprehensive forms that meet these requirements and protect all parties involved.",
    faqs: [
      {
        question: "What makes consent legally valid?",
        answer:
          "For consent to be legally valid, it must be given voluntarily without coercion, by a person who has the capacity to make the decision, and with a clear understanding of what is being consented to. The person must be informed of the relevant facts, risks, and their right to withdraw consent at any time. Written consent provides better evidence than verbal consent.",
      },
      {
        question: "Can consent be withdrawn after signing a form?",
        answer:
          "Yes, consent can generally be withdrawn at any time. The consent form should clearly state the right to withdraw and explain how to do so. However, withdrawal cannot typically undo actions already taken with valid consent. Organisations should have clear processes for handling consent withdrawal and should respect the decision promptly.",
      },
      {
        question: "Do minors need a different consent form?",
        answer:
          "Yes, minors generally cannot give legal consent themselves. A parent or legal guardian must provide consent on their behalf. The consent form should include fields for the guardian's information and signature. In some cases, such as medical treatment for older teenagers, the minor's own assent may also be required alongside parental consent.",
      },
    ],
  },

  "waiver-form": {
    heading: "What is a Waiver Form?",
    content:
      "A waiver form is a legal document in which a person voluntarily relinquishes a known right, typically the right to pursue legal action for injuries or damages that may occur during a specific activity. Waivers are commonly used by businesses, event organisers, fitness centres, adventure sports providers, and recreational facilities to manage liability risks. By signing a waiver, the participant acknowledges the inherent risks of the activity and agrees not to hold the organiser responsible for certain types of harm. An effective waiver form clearly describes the activity, identifies specific risks involved, explains the rights being waived, and is written in clear, understandable language. While waivers provide significant legal protection, they are not absolute and may not be enforceable if they are unconscionable, involve gross negligence, or were signed under duress. Using a waiver form generator helps you create a thorough, well-structured document that provides maximum legal protection while clearly informing participants of the risks.",
    faqs: [
      {
        question: "Are waiver forms legally enforceable?",
        answer:
          "Waiver forms are generally enforceable when properly drafted and signed voluntarily by an informed adult. However, enforceability varies by jurisdiction and circumstances. Waivers typically cannot protect against gross negligence or intentional harm. Courts may also invalidate waivers that are unclear, hidden in fine print, or signed under pressure. Have your waiver reviewed by a legal professional.",
      },
      {
        question: "Can a waiver form cover all types of liability?",
        answer:
          "No, waivers typically cannot waive liability for gross negligence, intentional misconduct, or fraud. They are most effective for inherent risks associated with the activity. Some jurisdictions have additional restrictions on what can be waived. The waiver should specifically list the risks being assumed and the types of liability being waived.",
      },
      {
        question: "Do I need a separate waiver for minors?",
        answer:
          "Yes, minors cannot legally sign waivers themselves. A parent or legal guardian must sign on their behalf. However, some jurisdictions do not allow parents to waive their children's right to sue. Include a parental consent and assumption of risk section in your waiver, and consult local laws regarding enforceability for minors.",
      },
    ],
  },

  "pay-stub": {
    heading: "What is a Pay Stub?",
    content:
      "A pay stub, also known as a payslip, is a document provided to employees that details their earnings and deductions for a specific pay period. It breaks down gross pay, taxes withheld, benefits deductions, and the resulting net pay. Pay stubs serve as proof of income and are essential for financial transparency, tax filing, loan applications, and rental agreements. In many jurisdictions, employers are legally required to provide pay stubs to employees with each payment. Key information on a pay stub includes the employee's name and details, the pay period dates, gross earnings broken down by regular and overtime hours, federal and state tax withholdings, social security and medicare contributions, health insurance premiums, retirement contributions, and the final net pay amount. Using a pay stub generator helps employers create accurate, professional pay stubs that comply with standard formats and provide employees with clear documentation of their compensation.",
    faqs: [
      {
        question: "Am I legally required to provide pay stubs to employees?",
        answer:
          "Requirements vary by jurisdiction. In the UK, employers must provide itemised pay statements. In the US, most states require employers to provide pay stubs, though federal law does not mandate it. Check your local employment laws for specific requirements. Even where not legally required, providing pay stubs is considered best practice.",
      },
      {
        question: "What deductions should appear on a pay stub?",
        answer:
          "Common deductions include income tax withholding (federal, state, and local where applicable), National Insurance or Social Security contributions, pension or retirement fund contributions, health insurance premiums, and any voluntary deductions such as charitable donations or union dues. Each deduction should be listed separately with clear labels.",
      },
      {
        question: "How long should employees keep their pay stubs?",
        answer:
          "Employees should keep pay stubs for at least one year and compare them with their annual tax documents for accuracy. For tax disputes or other financial matters, keeping pay stubs for three to seven years is advisable. Digital copies are just as valid as paper ones and are easier to store and organise.",
      },
    ],
  },

  "experience-certificate": {
    heading: "What is an Experience Certificate?",
    content:
      "An experience certificate is a formal document issued by an employer to an employee confirming their tenure, role, and performance during their employment. It serves as official proof of work experience and is commonly required when applying for new jobs, pursuing further education, or obtaining professional certifications. The certificate validates the employee's professional history and can include details about their responsibilities, skills demonstrated, and overall performance. Key elements of an experience certificate include the employee's full name, job title, employment dates, a brief description of duties, and an assessment of their work quality and character. It is typically issued on company letterhead and signed by an authorised representative. Using an experience certificate generator helps employers create professional, well-formatted certificates quickly, ensuring consistency and completeness across all certificates issued by the organisation.",
    faqs: [
      {
        question: "When is an experience certificate issued?",
        answer:
          "An experience certificate is typically issued when an employee leaves the organisation, either through resignation, contract completion, or retirement. Some employers issue it on the last day of work, while others provide it shortly after. Employees have the right to request an experience certificate from their former employer for any completed employment period.",
      },
      {
        question: "What is the difference between an experience certificate and a relieving letter?",
        answer:
          "An experience certificate confirms the employee's role, tenure, and performance, while a relieving letter confirms that the employee has been formally released from their duties and has no outstanding obligations. Both are typically issued upon departure, but they serve different purposes. Some employers combine both into a single document.",
      },
      {
        question: "Can I request an experience certificate from a previous employer?",
        answer:
          "Yes, you can request an experience certificate from any former employer, regardless of how long ago you worked there. Most employers are obligated to provide one upon request. Contact the HR department with your employment details including dates and role. Allow reasonable time for the certificate to be prepared.",
      },
    ],
  },

  "internship-certificate": {
    heading: "What is an Internship Certificate?",
    content:
      "An internship certificate is a formal document issued by an organisation to an intern upon completion of their internship programme. It verifies that the individual participated in the internship, confirms the duration and department, and typically includes a brief assessment of their performance and contributions. Internship certificates are valuable for students and recent graduates as they provide official documentation of practical experience, which is essential for building a professional portfolio, applying for jobs, and meeting academic credit requirements. The certificate should include the intern's name, the organisation's name, the internship period, the department or project they worked on, key responsibilities or projects, and an evaluation of their performance. Using an internship certificate generator helps organisations create professional, consistent certificates that properly acknowledge the intern's contributions and serve as credible documentation of their experience.",
    faqs: [
      {
        question: "What is the difference between an internship certificate and a letter of recommendation?",
        answer:
          "An internship certificate is a factual document that confirms participation in an internship and may include a brief performance assessment. A letter of recommendation is a more personal, detailed endorsement of the intern's abilities and potential, written to support future applications. Both are valuable but serve different purposes.",
      },
      {
        question: "Should an internship certificate include a performance evaluation?",
        answer:
          "Including a brief, positive performance evaluation adds value to the certificate and helps the intern in future applications. Mention key skills demonstrated, projects contributed to, and overall attitude. If performance was poor, it is better to issue a basic certificate confirming participation without detailed evaluation.",
      },
      {
        question: "Can I get an internship certificate for unpaid internships?",
        answer:
          "Yes, you are entitled to an internship certificate regardless of whether the internship was paid or unpaid. The certificate documents your experience and is equally valid. Ensure the organisation issues one before your internship ends, and keep it safely along with any other documentation of your work during the internship.",
      },
    ],
  },

  "leave-application": {
    heading: "What is a Leave Application?",
    content:
      "A leave application is a formal written request submitted to an employer or supervisor seeking approval for time off from work. It is a standard workplace document used to apply for various types of leave including annual leave, sick leave, personal leave, maternity or paternity leave, bereavement leave, and study leave. A well-written leave application clearly states the type of leave requested, the specific dates, the reason if appropriate, and any arrangements made to cover responsibilities during the absence. Submitting a formal leave application ensures proper documentation, helps managers plan workloads, and maintains a clear record for payroll and HR purposes. The application should be submitted with adequate advance notice following your company's leave policy. Using a leave application generator helps you create a professional, properly formatted request that includes all necessary information, increasing the likelihood of approval and maintaining a professional image.",
    faqs: [
      {
        question: "How far in advance should I submit a leave application?",
        answer:
          "The required notice period depends on your company's policy and the type of leave. For planned annual leave, submit your application at least two to four weeks in advance, or more for extended periods. For sick leave, notify your employer as soon as possible on the first day of absence. Emergency leave should be communicated as soon as circumstances allow.",
      },
      {
        question: "Can my employer reject my leave application?",
        answer:
          "Employers can generally decline leave requests for operational reasons, but they must do so fairly and consistently. They cannot unreasonably refuse statutory leave entitlements. If your request is declined, discuss alternative dates with your manager. Keep records of all leave requests and responses for your own reference.",
      },
      {
        question: "Do I need to give a reason for taking leave?",
        answer:
          "For annual leave or personal leave, you are generally not required to provide a specific reason, though some employers appreciate knowing for planning purposes. For sick leave, you may need to provide a medical certificate for absences beyond a certain number of days. For special leave types, supporting documentation is usually required.",
      },
    ],
  },

  "performance-review": {
    heading: "What is a Performance Review?",
    content:
      "A performance review is a formal assessment of an employee's work performance, accomplishments, and areas for development over a specific period. It is a structured conversation between a manager and an employee that evaluates past performance against established objectives and sets goals for the future. Performance reviews serve multiple purposes including providing feedback, identifying training needs, informing compensation decisions, documenting performance for legal purposes, and supporting career development planning. An effective performance review covers key achievements, areas of strength, areas requiring improvement, specific and measurable goals for the next review period, and any support or resources needed. Using a performance review generator helps managers create thorough, consistent evaluations that are fair, documented, and actionable, leading to more productive conversations and better employee development outcomes.",
    faqs: [
      {
        question: "How often should performance reviews be conducted?",
        answer:
          "Traditional annual reviews are being supplemented or replaced by more frequent check-ins, with many organisations conducting formal reviews bi-annually or quarterly. Regular feedback conversations throughout the year are more effective than a single annual review. The ideal frequency depends on your organisation's culture, the nature of the work, and the employee's experience level.",
      },
      {
        question: "How can I make performance reviews more effective?",
        answer:
          "Base reviews on specific, measurable objectives set at the beginning of the period. Provide both positive feedback and constructive criticism with concrete examples. Make it a two-way conversation where the employee can share their perspective. Focus on future development as much as past performance, and follow up on agreed actions.",
      },
      {
        question: "Should performance reviews be linked to pay decisions?",
        answer:
          "This is debated among HR professionals. Linking reviews to pay can make employees defensive and less open to feedback. Many organisations separate the development conversation from the compensation discussion. If they are linked, ensure the criteria are transparent, consistent, and communicated clearly to all employees.",
      },
    ],
  },

  "joining-letter": {
    heading: "What is a Joining Letter?",
    content:
      "A joining letter is a formal document submitted by a new employee to their employer on or before their first day of work, confirming their acceptance of the job offer and their intention to join the organisation on the agreed start date. It serves as the employee's formal acknowledgement of the employment terms and their commitment to the position. The joining letter typically references the offer letter, confirms the start date, and may include details about the position accepted. In some organisations, the joining letter is a required document for the HR onboarding process. It becomes part of the employee's personnel file and serves as a record of when the employment relationship officially began. Using a joining letter generator helps new employees create a professional, properly formatted letter that makes a positive first impression and ensures all necessary information is included for a smooth onboarding process.",
    faqs: [
      {
        question: "When should I submit a joining letter?",
        answer:
          "Submit your joining letter on your first day of work or in advance as specified by your employer. Some organisations request it before the start date as part of pre-boarding paperwork. Check with your HR department or hiring manager for their specific requirements. Having it ready shows organisation and professionalism.",
      },
      {
        question: "What is the difference between a joining letter and an offer acceptance?",
        answer:
          "An offer acceptance is your response to the offer letter, confirming that you accept the position and its terms. A joining letter is a separate document confirming your actual arrival and start date. The offer acceptance typically comes first, followed by the joining letter when you begin work. Some organisations combine these into one process.",
      },
      {
        question: "What should a joining letter include?",
        answer:
          "A joining letter should include your full name, the position you are joining, the department, your start date, a reference to the offer letter, and confirmation that you agree to the stated terms and conditions. Keep it brief and professional. You may also mention your enthusiasm for the role and the organisation.",
      },
    ],
  },

  "relieving-letter": {
    heading: "What is a Relieving Letter?",
    content:
      "A relieving letter is a formal document issued by an employer to an employee upon their departure from the organisation, confirming that the employee has been officially released from their duties and all obligations have been fulfilled. It verifies that the employee has completed their notice period, handed over responsibilities, returned company property, and settled any outstanding matters. A relieving letter is distinct from an experience certificate, as it specifically confirms the termination of the employment relationship rather than detailing the employee's performance. New employers often request this document as proof that the candidate has properly separated from their previous employer and is free to join the new organisation. Key elements include the employee's name, designation, department, last working day, and confirmation of dues settled. Using a relieving letter generator helps employers create professional, comprehensive letters that serve as proper closure for the employment relationship.",
    faqs: [
      {
        question: "Is a relieving letter mandatory?",
        answer:
          "While not always legally required, relieving letters are standard practice in many industries and are frequently requested by new employers during the onboarding process. Many organisations will not finalise a new hire's joining without a relieving letter from their previous employer. It is in both parties' interest to issue and obtain one.",
      },
      {
        question: "What is the difference between a relieving letter and a resignation acceptance?",
        answer:
          "A resignation acceptance acknowledges that the employer has received and accepted the employee's resignation. A relieving letter is issued after the employee has completed their notice period and fulfilled all exit requirements. The resignation acceptance comes first, and the relieving letter is issued on or after the last working day.",
      },
      {
        question: "What if my employer refuses to issue a relieving letter?",
        answer:
          "If your employer refuses to issue a relieving letter, first escalate the request through HR channels. If the refusal persists, you may contact your local labour authority or seek legal advice. Document all requests and responses in writing. In the meantime, you can provide new employers with other proof of employment such as pay stubs or tax documents.",
      },
    ],
  },

  "certificate-of-completion": {
    heading: "What is a Certificate of Completion?",
    content:
      "A certificate of completion is a formal document awarded to individuals who have successfully finished a course, training programme, workshop, or project. It serves as official recognition of the participant's effort and achievement, and can be used to demonstrate professional development, meet continuing education requirements, or enhance a portfolio. Certificates of completion are widely used by educational institutions, training providers, employers, professional organisations, and event organisers. Unlike diplomas or degrees, certificates of completion typically verify participation and finishing a specific programme rather than passing an examination, though some may include assessment results. Key elements include the recipient's name, the programme or course title, the date of completion, the issuing organisation's name, and an authorised signature. Using a certificate of completion generator helps organisations create professional, branded certificates efficiently, ensuring consistency across all certificates issued.",
    faqs: [
      {
        question: "What is the difference between a certificate of completion and a certification?",
        answer:
          "A certificate of completion confirms that someone finished a specific course or programme. A certification is a professional credential that typically involves passing an examination, meeting specific requirements, and may require ongoing continuing education to maintain. Certifications carry more professional weight and are often regulated by industry bodies.",
      },
      {
        question: "Do certificates of completion have expiry dates?",
        answer:
          "Most certificates of completion do not expire, as they document the fact that you completed a programme at a specific point in time. However, some industries require periodic recertification, and employers may prefer recent certificates for rapidly evolving fields. The certificate itself should state whether it has an expiry date or is valid indefinitely.",
      },
      {
        question: "How can I verify a certificate of completion?",
        answer:
          "Verification methods include contacting the issuing organisation directly, checking online verification systems if available, or looking for unique certificate numbers that can be validated. Many organisations now offer digital certificates with built-in verification links. When issuing certificates, consider including a verification ID or QR code.",
      },
    ],
  },

  "award-certificate": {
    heading: "What is an Award Certificate?",
    content:
      "An award certificate is a formal document that recognises and honours an individual or organisation for outstanding achievement, contribution, or excellence in a particular area. Award certificates are used across various settings including workplaces, schools, community organisations, sports clubs, and professional associations. They serve as tangible recognition that motivates recipients, boosts morale, and reinforces positive behaviours and outcomes. Whether acknowledging employee of the month, academic excellence, volunteer service, or competitive achievement, a well-designed award certificate carries significant emotional and professional value. Key elements include the recipient's name, the specific award or achievement being recognised, the date, the awarding organisation, and signatures of authorised representatives. Using an award certificate generator helps you create professional, polished certificates that appropriately honour recipients and reflect well on your organisation, without the need for graphic design skills or expensive design software.",
    faqs: [
      {
        question: "What types of award certificates are there?",
        answer:
          "Common types include employee recognition awards, academic achievement certificates, sports and athletic awards, volunteer appreciation certificates, participation certificates, leadership awards, customer service excellence awards, and lifetime achievement recognitions. The type should match the accomplishment being recognised and the context in which it will be presented.",
      },
      {
        question: "How can award certificates improve employee motivation?",
        answer:
          "Award certificates provide public recognition that satisfies the fundamental human need for acknowledgement. They create positive reinforcement for desired behaviours, inspire others to achieve similar results, and serve as lasting reminders of accomplishment. Presenting certificates in team settings amplifies the motivational impact and builds a culture of recognition.",
      },
      {
        question: "Should award certificates be printed or digital?",
        answer:
          "Both formats have value. Printed certificates feel more formal and are often displayed in offices or frames. Digital certificates are easier to share on professional profiles and social media. Many organisations now provide both, offering a physical certificate for display and a digital version for online use. Choose based on your audience and purpose.",
      },
    ],
  },

  merge: {
    heading: "How to Merge PDF Files Online for Free",
    content:
      "Merging PDF files combines multiple documents into a single PDF, making it easier to organise, share, and archive related content. Whether you are compiling reports, combining scanned pages, or assembling a portfolio, our free online PDF merger handles the task directly in your browser with no uploads to external servers. Simply drag and drop your files, reorder them as needed, and download the merged result instantly. No software installation or account creation is required.",
    faqs: [
      {
        question: "Is there a limit to how many PDFs I can merge?",
        answer:
          "Our tool allows you to merge multiple PDF files in a single session. Since all processing happens in your browser, performance depends on your device's memory. For best results, keep the total file size under 100 MB.",
      },
      {
        question: "Will merging PDFs reduce the quality of my documents?",
        answer:
          "No. Merging PDFs does not re-compress or alter the content of your files. Text, images, and formatting remain exactly as they were in the original documents.",
      },
      {
        question: "Can I rearrange the order of PDFs before merging?",
        answer:
          "Yes. After adding your files, you can drag and drop them into any order before merging. The final merged PDF will follow the sequence you set.",
      },
    ],
  },

  split: {
    heading: "How to Split a PDF into Separate Files Online",
    content:
      "Splitting a PDF allows you to extract specific pages or divide a large document into smaller, more manageable files. This is useful when you need to share only part of a report, separate chapters of a book, or isolate individual forms from a multi-page scan. Our free PDF splitter works entirely in your browser, keeping your documents private and secure. Choose which pages to extract, and download the result in seconds.",
    faqs: [
      {
        question: "Can I split a PDF into individual pages?",
        answer:
          "Yes. You can split a PDF into individual single-page files or select specific page ranges to extract. The tool gives you full control over which pages end up in each output file.",
      },
      {
        question: "Does splitting a PDF affect the original file?",
        answer:
          "No. The original PDF remains unchanged. Splitting creates new files from the pages you select without modifying the source document.",
      },
      {
        question: "Can I split a password-protected PDF?",
        answer:
          "You will need to unlock the PDF first before splitting it. If the PDF has a user password, enter it when prompted. Owner-password restrictions on editing do not prevent splitting in most cases.",
      },
    ],
  },

  rotate: {
    heading: "How to Rotate PDF Pages Online for Free",
    content:
      "Rotating PDF pages corrects the orientation of scanned documents, sideways photos, or pages that were saved in the wrong direction. Our free online PDF rotator lets you rotate individual pages or all pages at once by 90, 180, or 270 degrees. Everything runs in your browser so your files stay private. Fix page orientation issues in a few clicks and download the corrected PDF immediately.",
    faqs: [
      {
        question: "Can I rotate just one page in a multi-page PDF?",
        answer:
          "Yes. You can select individual pages to rotate while leaving the rest of the document unchanged. This is useful when only certain scanned pages are oriented incorrectly.",
      },
      {
        question: "What rotation angles are available?",
        answer:
          "You can rotate pages by 90 degrees clockwise, 90 degrees counter-clockwise, or 180 degrees. Apply different rotations to different pages within the same document.",
      },
      {
        question: "Does rotating a PDF change the file size?",
        answer:
          "Rotating pages has a negligible effect on file size. The content remains the same; only the page orientation metadata is updated.",
      },
    ],
  },

  "remove-pages": {
    heading: "How to Remove Pages from a PDF Online",
    content:
      "Removing pages from a PDF lets you delete unwanted content such as blank pages, cover sheets, or irrelevant sections before sharing or archiving a document. Our free online tool makes it simple to select and remove specific pages from any PDF file directly in your browser. Preview each page, choose which ones to delete, and download the cleaned-up document instantly. No software to install and no files uploaded to external servers.",
    faqs: [
      {
        question: "Can I remove multiple pages at once?",
        answer:
          "Yes. You can select multiple pages to remove in a single operation. Use the page previews to identify and mark all the pages you want to delete before processing.",
      },
      {
        question: "Can I undo page removal after downloading?",
        answer:
          "The original file is not modified, so you always have your source document. If you remove the wrong pages, simply start again with the original PDF.",
      },
      {
        question: "Will removing pages break bookmarks or links in my PDF?",
        answer:
          "Internal links and bookmarks that point to removed pages will no longer work. Links pointing to remaining pages will continue to function normally.",
      },
    ],
  },

  "extract-pages": {
    heading: "How to Extract Pages from a PDF Online for Free",
    content:
      "Extracting pages from a PDF creates a new document containing only the pages you need. Unlike splitting, which divides the entire document, extraction lets you cherry-pick specific pages or page ranges from anywhere in the file. This is ideal for pulling out key sections of a contract, saving specific pages of a manual, or creating a summary document from a longer report. Our browser-based tool keeps your files secure and delivers results instantly.",
    faqs: [
      {
        question: "What is the difference between extracting and splitting a PDF?",
        answer:
          "Extracting lets you select specific non-contiguous pages from a PDF into a new file. Splitting divides a document into sequential parts. Use extraction when you need scattered pages and splitting when you want to break a document into ordered sections.",
      },
      {
        question: "Can I extract pages from a scanned PDF?",
        answer:
          "Yes. Page extraction works on all PDF types including scanned documents, text-based PDFs, and PDFs with mixed content. The tool operates on page structure, not content type.",
      },
      {
        question: "Does extracting pages reduce file size?",
        answer:
          "Yes. The extracted PDF will generally be smaller since it contains fewer pages. However, shared resources like fonts may still be included in the new file.",
      },
    ],
  },

  organize: {
    heading: "How to Organize and Reorder PDF Pages Online",
    content:
      "Organising PDF pages lets you rearrange the page order of any document by dragging and dropping page thumbnails into your preferred sequence. This is useful for reordering presentation slides, rearranging report sections, or fixing the page order after scanning. Our free online PDF organiser provides visual page previews so you can see exactly what you are moving. All processing happens locally in your browser for complete privacy.",
    faqs: [
      {
        question: "Can I move pages between different positions in a large PDF?",
        answer:
          "Yes. The visual drag-and-drop interface lets you move any page to any position regardless of document length. Page thumbnails help you identify content quickly.",
      },
      {
        question: "Does reorganising pages affect the PDF content?",
        answer:
          "No. The content of each page remains identical. Only the page order changes. Text, images, annotations, and formatting are all preserved exactly as they are.",
      },
      {
        question: "Can I reverse the page order of my entire PDF?",
        answer:
          "Yes. You can rearrange pages into any order, including reversing the entire document. This is useful for fixing documents that were scanned in the wrong order.",
      },
    ],
  },

  "jpg-to-pdf": {
    heading: "How to Convert JPG Images to PDF Online for Free",
    content:
      "Converting JPG images to PDF creates a professional, shareable document from your photos, scans, or graphics. PDFs preserve image quality while offering a standardised format that looks the same on every device. Our free online converter lets you combine multiple images into a single PDF, adjust page sizing, and download the result instantly. Everything runs in your browser so your images remain private and are never uploaded to external servers.",
    faqs: [
      {
        question: "Can I convert multiple JPGs into one PDF?",
        answer:
          "Yes. You can add multiple JPG images and combine them into a single multi-page PDF document. Rearrange the image order before conversion to control the page sequence.",
      },
      {
        question: "Will converting JPG to PDF reduce image quality?",
        answer:
          "No. The conversion embeds your JPG images into the PDF at their original resolution and quality. There is no additional compression applied during the conversion process.",
      },
      {
        question: "What image formats are supported besides JPG?",
        answer:
          "While this tool is optimised for JPG and JPEG files, most common image formats including PNG can be handled. For best results with photographs, JPG is the recommended format.",
      },
    ],
  },

  "pdf-to-jpg": {
    heading: "How to Convert PDF to JPG Images Online for Free",
    content:
      "Converting a PDF to JPG images turns each page of your document into a separate image file. This is useful for creating thumbnails, sharing individual pages on social media, embedding pages in presentations, or working with content in image editors. Our free online converter processes your PDF entirely in your browser, ensuring your documents stay private. Select your preferred image quality and download the results as individual JPG files.",
    faqs: [
      {
        question: "What resolution will the JPG images be?",
        answer:
          "The output resolution depends on the quality setting you choose. Higher quality settings produce larger, more detailed images suitable for printing, while standard settings create smaller files ideal for screen viewing and web use.",
      },
      {
        question: "Can I convert a specific page of a PDF to JPG?",
        answer:
          "Yes. You can select individual pages or page ranges to convert rather than processing the entire document. This saves time when you only need images of certain pages.",
      },
      {
        question: "Are the converted JPG files suitable for printing?",
        answer:
          "Yes, when using the high-quality setting. For professional printing, choose the highest quality option to preserve detail and sharpness. For web or email use, standard quality is typically sufficient.",
      },
    ],
  },

  "add-page-numbers": {
    heading: "How to Add Page Numbers to a PDF Online for Free",
    content:
      "Adding page numbers to a PDF makes your document easier to navigate, reference, and print. Whether you are preparing a report, thesis, manual, or legal document, numbered pages help readers find content quickly and keep printed pages in order. Our free online tool lets you customise the position, format, and starting number of your page numbers. All processing happens in your browser so your documents remain private and secure.",
    faqs: [
      {
        question: "Can I choose where page numbers appear on the page?",
        answer:
          "Yes. You can place page numbers at the top or bottom of the page, aligned to the left, centre, or right. Choose the position that best suits your document's layout and style.",
      },
      {
        question: "Can I start numbering from a page other than the first?",
        answer:
          "Yes. You can set a custom starting page number and choose which page to begin numbering from. This is useful when your document has a cover page or table of contents that should not be numbered.",
      },
      {
        question: "What number formats are available?",
        answer:
          "Common formats include Arabic numerals (1, 2, 3), Roman numerals (i, ii, iii), and options with prefixes such as 'Page 1 of N'. Select the format that matches your document's requirements.",
      },
    ],
  },

  "add-watermark": {
    heading: "How to Add a Watermark to a PDF Online for Free",
    content:
      "Adding a watermark to a PDF helps protect your documents by marking them as confidential, draft, or proprietary. Watermarks are semi-transparent text or images overlaid on each page, discouraging unauthorised use while keeping the content readable. Our free online tool lets you add custom text watermarks with control over font size, colour, opacity, and rotation. Process your documents entirely in your browser for complete privacy and security.",
    faqs: [
      {
        question: "Can I customise the watermark text and appearance?",
        answer:
          "Yes. You can set custom text, adjust the font size, choose the colour and opacity, and control the rotation angle. This lets you create anything from subtle background marks to prominent overlay text.",
      },
      {
        question: "Will the watermark cover the document content?",
        answer:
          "Watermarks are semi-transparent by design so the underlying text and images remain readable. You can adjust the opacity to find the right balance between visibility of the watermark and readability of the content.",
      },
      {
        question: "Can I remove a watermark after adding it?",
        answer:
          "The watermark is permanently applied to the downloaded PDF. Keep your original un-watermarked file if you may need a clean version later. You can always re-process the original with different watermark settings.",
      },
    ],
  },

  "protect-pdf": {
    heading: "How to Password Protect a PDF Online for Free",
    content:
      "Password protecting a PDF adds encryption to prevent unauthorised access to your sensitive documents. Whether you are sharing financial records, legal contracts, or personal information, adding a password ensures only intended recipients can open and read the file. Our free online tool applies industry-standard encryption to your PDF directly in your browser, so your documents are never uploaded to external servers. Set a password and download the protected file in seconds.",
    faqs: [
      {
        question: "How secure is the PDF password protection?",
        answer:
          "Our tool applies standard PDF encryption which is widely supported by all PDF readers. The security level depends on the strength of your chosen password. Use a strong, unique password with a mix of letters, numbers, and symbols for best protection.",
      },
      {
        question: "Can I remove the password from a protected PDF later?",
        answer:
          "Yes, if you know the password. Open the protected PDF with the correct password, then save it without protection. Without the password, the encryption cannot be removed.",
      },
      {
        question: "Will the recipient need special software to open a protected PDF?",
        answer:
          "No. Any standard PDF reader including Adobe Acrobat, Preview on Mac, and most browser-based viewers can open password-protected PDFs. The recipient simply enters the password when prompted.",
      },
    ],
  },

  "sign-pdf": {
    heading: "How to Add a Signature to a PDF Online for Free",
    content:
      "Adding a signature to a PDF lets you sign documents electronically without printing, signing by hand, and scanning. This is useful for contracts, agreements, forms, and any document that requires your signature. Our free online tool lets you draw, type, or upload your signature and place it anywhere on the PDF. All processing happens locally in your browser, ensuring your documents and signature remain completely private.",
    faqs: [
      {
        question: "Is an electronic signature legally valid?",
        answer:
          "In many jurisdictions, electronic signatures are legally recognised and enforceable under laws such as the ESIGN Act in the US and eIDAS in the EU. However, some documents such as wills or certain real estate transactions may still require wet ink signatures. Check local requirements for your specific use case.",
      },
      {
        question: "Can I add multiple signatures to a PDF?",
        answer:
          "Yes. You can place multiple signatures on the same document, which is useful when a form requires signatures in several locations or when multiple people need to sign the same document.",
      },
      {
        question: "How can I create my signature?",
        answer:
          "You can draw your signature using your mouse or touchscreen, type your name and select a signature style font, or upload an image of your handwritten signature. All three methods produce a clean signature that can be placed on your PDF.",
      },
    ],
  },

  "profit-margin": {
    heading: "How to Calculate Profit Margin for Your Business",
    content:
      "Profit margin measures how much of your revenue turns into profit after costs are deducted, expressed as a percentage. It is one of the most important financial metrics for any business, helping you understand pricing effectiveness, cost management, and overall financial health. Our free profit margin calculator instantly computes gross margin, net margin, and markup percentage from your revenue and cost figures. Use it to evaluate product pricing, compare business performance, or prepare financial projections.",
    faqs: [
      {
        question: "What is the difference between gross and net profit margin?",
        answer:
          "Gross profit margin considers only the cost of goods sold, showing how efficiently you produce or source products. Net profit margin also deducts operating expenses like rent, salaries, and utilities, giving a fuller picture of overall profitability.",
      },
      {
        question: "What is a good profit margin?",
        answer:
          "Good margins vary by industry. Retail businesses often operate on 2 to 5 percent net margins, while software companies may achieve 20 percent or more. Compare your margins to industry benchmarks rather than using a universal standard.",
      },
      {
        question: "What is the difference between margin and markup?",
        answer:
          "Margin is profit as a percentage of revenue (selling price), while markup is profit as a percentage of cost. A product bought for 50 and sold for 100 has a 50 percent margin but a 100 percent markup. Both metrics are useful for different pricing decisions.",
      },
      {
        question: "How can I improve my profit margin?",
        answer:
          "You can improve margins by increasing prices, reducing cost of goods through better supplier negotiations, lowering operating expenses, or focusing on higher-margin products and services. Regularly reviewing your margins helps identify trends early.",
      },
    ],
  },
};

const relatedToolsMap: Record<string, RelatedTool[]> = {
  resume: [
    { title: "Cover Letter Generator", slug: "cover-letter", desc: "Create a matching cover letter for your job application" },
    { title: "Reference Letter Generator", slug: "reference-letter", desc: "Generate a professional reference letter" },
    { title: "Experience Certificate", slug: "experience-certificate", desc: "Document your work experience formally" },
  ],
  "resignation-letter": [
    { title: "Cover Letter Generator", slug: "cover-letter", desc: "Prepare a cover letter for your next role" },
    { title: "Relieving Letter Generator", slug: "relieving-letter", desc: "Create a formal relieving letter" },
    { title: "Reference Letter Generator", slug: "reference-letter", desc: "Generate a professional reference letter" },
  ],
  "cover-letter": [
    { title: "Resume Generator", slug: "resume", desc: "Build a professional resume to pair with your cover letter" },
    { title: "Reference Letter Generator", slug: "reference-letter", desc: "Generate a reference letter for your application" },
    { title: "Thank You Letter Generator", slug: "thank-you-letter", desc: "Send a thank you after your interview" },
  ],
  "business-letter": [
    { title: "Memo Generator", slug: "memo", desc: "Create internal memos for your organisation" },
    { title: "Complaint Letter Generator", slug: "complaint-letter", desc: "Write a formal complaint letter" },
    { title: "Demand Letter Generator", slug: "demand-letter", desc: "Draft a formal demand letter" },
  ],
  "reference-letter": [
    { title: "Recommendation Letter Generator", slug: "recommendation-letter", desc: "Create a targeted recommendation letter" },
    { title: "Experience Certificate", slug: "experience-certificate", desc: "Document work experience formally" },
    { title: "Cover Letter Generator", slug: "cover-letter", desc: "Create a cover letter for job applications" },
  ],
  "recommendation-letter": [
    { title: "Reference Letter Generator", slug: "reference-letter", desc: "Generate a general reference letter" },
    { title: "Cover Letter Generator", slug: "cover-letter", desc: "Create a cover letter for applications" },
    { title: "Resume Generator", slug: "resume", desc: "Build a professional resume" },
  ],
  "offer-letter": [
    { title: "Employment Contract Generator", slug: "employment-contract", desc: "Create a detailed employment contract" },
    { title: "Job Description Generator", slug: "job-description", desc: "Write a comprehensive job description" },
    { title: "Joining Letter Generator", slug: "joining-letter", desc: "Generate a formal joining letter" },
  ],
  "termination-letter": [
    { title: "Warning Letter Generator", slug: "warning-letter", desc: "Issue a formal warning before termination" },
    { title: "Relieving Letter Generator", slug: "relieving-letter", desc: "Create a relieving letter for departing employees" },
    { title: "Experience Certificate", slug: "experience-certificate", desc: "Issue an experience certificate" },
  ],
  "warning-letter": [
    { title: "Termination Letter Generator", slug: "termination-letter", desc: "Draft a formal termination letter" },
    { title: "Performance Review Generator", slug: "performance-review", desc: "Create a performance review document" },
    { title: "Employment Contract Generator", slug: "employment-contract", desc: "Review employment contract terms" },
  ],
  "complaint-letter": [
    { title: "Demand Letter Generator", slug: "demand-letter", desc: "Escalate with a formal demand letter" },
    { title: "Business Letter Generator", slug: "business-letter", desc: "Write a formal business letter" },
    { title: "Apology Letter Generator", slug: "apology-letter", desc: "Respond with a professional apology" },
  ],
  "thank-you-letter": [
    { title: "Cover Letter Generator", slug: "cover-letter", desc: "Create a cover letter for your application" },
    { title: "Recommendation Letter Generator", slug: "recommendation-letter", desc: "Request or write a recommendation" },
    { title: "Business Letter Generator", slug: "business-letter", desc: "Write a formal business letter" },
  ],
  "letter-of-intent": [
    { title: "Business Proposal Generator", slug: "business-proposal", desc: "Create a detailed business proposal" },
    { title: "NDA Generator", slug: "nda", desc: "Protect confidential information" },
    { title: "Partnership Agreement Generator", slug: "partnership-agreement", desc: "Formalise a partnership" },
  ],
  "apology-letter": [
    { title: "Complaint Letter Generator", slug: "complaint-letter", desc: "Write a formal complaint letter" },
    { title: "Business Letter Generator", slug: "business-letter", desc: "Draft a professional business letter" },
    { title: "Thank You Letter Generator", slug: "thank-you-letter", desc: "Express gratitude professionally" },
  ],
  "authorization-letter": [
    { title: "Power of Attorney Generator", slug: "power-of-attorney", desc: "Grant broader legal authority" },
    { title: "Permission Letter Generator", slug: "permission-letter", desc: "Request formal permission" },
    { title: "Consent Form Generator", slug: "consent-form", desc: "Create a consent form" },
  ],
  "permission-letter": [
    { title: "Authorization Letter Generator", slug: "authorization-letter", desc: "Grant authority to act on your behalf" },
    { title: "Leave Application Generator", slug: "leave-application", desc: "Apply for time off work" },
    { title: "Consent Form Generator", slug: "consent-form", desc: "Create a formal consent form" },
  ],
  "sponsorship-letter": [
    { title: "Business Proposal Generator", slug: "business-proposal", desc: "Create a detailed proposal" },
    { title: "Business Letter Generator", slug: "business-letter", desc: "Draft a professional letter" },
    { title: "Company Profile Generator", slug: "company-profile", desc: "Showcase your organisation" },
  ],
  "demand-letter": [
    { title: "Complaint Letter Generator", slug: "complaint-letter", desc: "Write a formal complaint first" },
    { title: "Invoice Generator", slug: "invoice", desc: "Create an invoice for amounts owed" },
    { title: "Promissory Note Generator", slug: "promissory-note", desc: "Document a debt obligation" },
  ],
  invoice: [
    { title: "Receipt Generator", slug: "receipt", desc: "Create a receipt after payment" },
    { title: "Quotation Generator", slug: "quotation", desc: "Send a quote before invoicing" },
    { title: "Purchase Order Generator", slug: "purchase-order", desc: "Create a purchase order" },
  ],
  receipt: [
    { title: "Invoice Generator", slug: "invoice", desc: "Create a professional invoice" },
    { title: "Bill of Sale Generator", slug: "bill-of-sale", desc: "Document a sale transaction" },
    { title: "Purchase Order Generator", slug: "purchase-order", desc: "Create a purchase order" },
  ],
  "purchase-order": [
    { title: "Invoice Generator", slug: "invoice", desc: "Create an invoice for the order" },
    { title: "Quotation Generator", slug: "quotation", desc: "Request or send a price quote" },
    { title: "Receipt Generator", slug: "receipt", desc: "Issue a receipt after payment" },
  ],
  quotation: [
    { title: "Invoice Generator", slug: "invoice", desc: "Convert your quote into an invoice" },
    { title: "Business Proposal Generator", slug: "business-proposal", desc: "Create a full business proposal" },
    { title: "Purchase Order Generator", slug: "purchase-order", desc: "Create a purchase order" },
  ],
  "business-proposal": [
    { title: "Quotation Generator", slug: "quotation", desc: "Create a price quotation" },
    { title: "Scope of Work Generator", slug: "scope-of-work", desc: "Define the project scope" },
    { title: "NDA Generator", slug: "nda", desc: "Protect confidential information" },
  ],
  "meeting-minutes": [
    { title: "Memo Generator", slug: "memo", desc: "Share meeting outcomes via memo" },
    { title: "Project Brief Generator", slug: "project-brief", desc: "Create a project overview" },
    { title: "Business Letter Generator", slug: "business-letter", desc: "Follow up with a formal letter" },
  ],
  memo: [
    { title: "Meeting Minutes Generator", slug: "meeting-minutes", desc: "Record meeting discussions" },
    { title: "Business Letter Generator", slug: "business-letter", desc: "Write a formal external letter" },
    { title: "Press Release Generator", slug: "press-release", desc: "Announce news externally" },
  ],
  "press-release": [
    { title: "Company Profile Generator", slug: "company-profile", desc: "Create your company profile" },
    { title: "Business Letter Generator", slug: "business-letter", desc: "Draft formal communications" },
    { title: "Memo Generator", slug: "memo", desc: "Communicate internally" },
  ],
  "job-description": [
    { title: "Offer Letter Generator", slug: "offer-letter", desc: "Create a job offer letter" },
    { title: "Employment Contract Generator", slug: "employment-contract", desc: "Draft an employment contract" },
    { title: "Company Profile Generator", slug: "company-profile", desc: "Showcase your company" },
  ],
  "company-profile": [
    { title: "Business Proposal Generator", slug: "business-proposal", desc: "Create a business proposal" },
    { title: "Press Release Generator", slug: "press-release", desc: "Announce company news" },
    { title: "Job Description Generator", slug: "job-description", desc: "Write a job description" },
  ],
  "scope-of-work": [
    { title: "Project Brief Generator", slug: "project-brief", desc: "Create a project overview" },
    { title: "Business Proposal Generator", slug: "business-proposal", desc: "Draft a business proposal" },
    { title: "Service Agreement Generator", slug: "service-agreement", desc: "Formalise the agreement" },
  ],
  "project-brief": [
    { title: "Scope of Work Generator", slug: "scope-of-work", desc: "Define detailed project scope" },
    { title: "Business Proposal Generator", slug: "business-proposal", desc: "Create a business proposal" },
    { title: "Meeting Minutes Generator", slug: "meeting-minutes", desc: "Record project meetings" },
  ],
  nda: [
    { title: "Employment Contract Generator", slug: "employment-contract", desc: "Create an employment contract" },
    { title: "Service Agreement Generator", slug: "service-agreement", desc: "Draft a service agreement" },
    { title: "Partnership Agreement Generator", slug: "partnership-agreement", desc: "Formalise a partnership" },
  ],
  "employment-contract": [
    { title: "Offer Letter Generator", slug: "offer-letter", desc: "Create a job offer letter" },
    { title: "NDA Generator", slug: "nda", desc: "Protect confidential information" },
    { title: "Job Description Generator", slug: "job-description", desc: "Define the job role" },
  ],
  "service-agreement": [
    { title: "Scope of Work Generator", slug: "scope-of-work", desc: "Define project deliverables" },
    { title: "NDA Generator", slug: "nda", desc: "Protect sensitive information" },
    { title: "Invoice Generator", slug: "invoice", desc: "Create invoices for services" },
  ],
  "rental-agreement": [
    { title: "Eviction Notice Generator", slug: "eviction-notice", desc: "Create a formal eviction notice" },
    { title: "Bill of Sale Generator", slug: "bill-of-sale", desc: "Document property transactions" },
    { title: "Receipt Generator", slug: "receipt", desc: "Issue rent receipts" },
  ],
  "loan-agreement": [
    { title: "Promissory Note Generator", slug: "promissory-note", desc: "Create a simpler debt document" },
    { title: "Bill of Sale Generator", slug: "bill-of-sale", desc: "Document sale transactions" },
    { title: "Demand Letter Generator", slug: "demand-letter", desc: "Request overdue payment" },
  ],
  "partnership-agreement": [
    { title: "NDA Generator", slug: "nda", desc: "Protect partnership information" },
    { title: "Business Proposal Generator", slug: "business-proposal", desc: "Propose a business venture" },
    { title: "Service Agreement Generator", slug: "service-agreement", desc: "Define service terms" },
  ],
  "bill-of-sale": [
    { title: "Receipt Generator", slug: "receipt", desc: "Issue a payment receipt" },
    { title: "Invoice Generator", slug: "invoice", desc: "Create a sales invoice" },
    { title: "Promissory Note Generator", slug: "promissory-note", desc: "Document payment terms" },
  ],
  "promissory-note": [
    { title: "Loan Agreement Generator", slug: "loan-agreement", desc: "Create a detailed loan agreement" },
    { title: "Demand Letter Generator", slug: "demand-letter", desc: "Request overdue payment" },
    { title: "Bill of Sale Generator", slug: "bill-of-sale", desc: "Document sale transactions" },
  ],
  "eviction-notice": [
    { title: "Rental Agreement Generator", slug: "rental-agreement", desc: "Create a rental agreement" },
    { title: "Demand Letter Generator", slug: "demand-letter", desc: "Request overdue rent payment" },
    { title: "Warning Letter Generator", slug: "warning-letter", desc: "Issue a formal warning" },
  ],
  "power-of-attorney": [
    { title: "Authorization Letter Generator", slug: "authorization-letter", desc: "Grant limited authority" },
    { title: "Affidavit Generator", slug: "affidavit", desc: "Create a sworn statement" },
    { title: "Consent Form Generator", slug: "consent-form", desc: "Document formal consent" },
  ],
  affidavit: [
    { title: "Power of Attorney Generator", slug: "power-of-attorney", desc: "Grant legal authority" },
    { title: "Consent Form Generator", slug: "consent-form", desc: "Create a consent form" },
    { title: "Authorization Letter Generator", slug: "authorization-letter", desc: "Authorise someone to act for you" },
  ],
  "consent-form": [
    { title: "Waiver Form Generator", slug: "waiver-form", desc: "Create a liability waiver" },
    { title: "Permission Letter Generator", slug: "permission-letter", desc: "Request formal permission" },
    { title: "Authorization Letter Generator", slug: "authorization-letter", desc: "Authorise someone to act for you" },
  ],
  "waiver-form": [
    { title: "Consent Form Generator", slug: "consent-form", desc: "Create an informed consent form" },
    { title: "Affidavit Generator", slug: "affidavit", desc: "Create a sworn statement" },
    { title: "Service Agreement Generator", slug: "service-agreement", desc: "Define service terms" },
  ],
  "pay-stub": [
    { title: "Employment Contract Generator", slug: "employment-contract", desc: "Create an employment contract" },
    { title: "Invoice Generator", slug: "invoice", desc: "Create a professional invoice" },
    { title: "Receipt Generator", slug: "receipt", desc: "Generate a payment receipt" },
  ],
  "experience-certificate": [
    { title: "Relieving Letter Generator", slug: "relieving-letter", desc: "Create a formal relieving letter" },
    { title: "Reference Letter Generator", slug: "reference-letter", desc: "Generate a reference letter" },
    { title: "Resume Generator", slug: "resume", desc: "Build a professional resume" },
  ],
  "internship-certificate": [
    { title: "Experience Certificate Generator", slug: "experience-certificate", desc: "Document work experience" },
    { title: "Certificate of Completion", slug: "certificate-of-completion", desc: "Issue a completion certificate" },
    { title: "Recommendation Letter Generator", slug: "recommendation-letter", desc: "Write a recommendation" },
  ],
  "leave-application": [
    { title: "Permission Letter Generator", slug: "permission-letter", desc: "Request formal permission" },
    { title: "Business Letter Generator", slug: "business-letter", desc: "Write a formal letter" },
    { title: "Memo Generator", slug: "memo", desc: "Create an internal memo" },
  ],
  "performance-review": [
    { title: "Warning Letter Generator", slug: "warning-letter", desc: "Issue a formal warning" },
    { title: "Award Certificate Generator", slug: "award-certificate", desc: "Recognise outstanding performance" },
    { title: "Employment Contract Generator", slug: "employment-contract", desc: "Review employment terms" },
  ],
  "joining-letter": [
    { title: "Offer Letter Generator", slug: "offer-letter", desc: "Create a job offer letter" },
    { title: "Employment Contract Generator", slug: "employment-contract", desc: "Draft employment terms" },
    { title: "Resume Generator", slug: "resume", desc: "Build a professional resume" },
  ],
  "relieving-letter": [
    { title: "Experience Certificate Generator", slug: "experience-certificate", desc: "Document work experience" },
    { title: "Resignation Letter Generator", slug: "resignation-letter", desc: "Create a resignation letter" },
    { title: "Reference Letter Generator", slug: "reference-letter", desc: "Generate a reference letter" },
  ],
  "certificate-of-completion": [
    { title: "Award Certificate Generator", slug: "award-certificate", desc: "Create an award certificate" },
    { title: "Internship Certificate Generator", slug: "internship-certificate", desc: "Issue an internship certificate" },
    { title: "Experience Certificate Generator", slug: "experience-certificate", desc: "Document professional experience" },
  ],
  "award-certificate": [
    { title: "Certificate of Completion", slug: "certificate-of-completion", desc: "Issue a completion certificate" },
    { title: "Performance Review Generator", slug: "performance-review", desc: "Create a performance review" },
    { title: "Internship Certificate Generator", slug: "internship-certificate", desc: "Generate an internship certificate" },
  ],
  merge: [
    { title: "Split PDF", slug: "/pdf-tools/split", desc: "Split a PDF into separate files" },
    { title: "Organize PDF", slug: "/pdf-tools/organize", desc: "Rearrange pages in your PDF" },
    { title: "Remove Pages", slug: "/pdf-tools/remove-pages", desc: "Delete unwanted pages from a PDF" },
  ],
  split: [
    { title: "Merge PDF", slug: "/pdf-tools/merge", desc: "Combine multiple PDFs into one" },
    { title: "Extract Pages", slug: "/pdf-tools/extract-pages", desc: "Extract specific pages from a PDF" },
    { title: "Remove Pages", slug: "/pdf-tools/remove-pages", desc: "Delete unwanted pages from a PDF" },
  ],
  rotate: [
    { title: "Organize PDF", slug: "/pdf-tools/organize", desc: "Rearrange and reorder PDF pages" },
    { title: "Add Page Numbers", slug: "/pdf-tools/add-page-numbers", desc: "Add page numbers to your PDF" },
    { title: "Merge PDF", slug: "/pdf-tools/merge", desc: "Combine multiple PDFs into one" },
  ],
  "remove-pages": [
    { title: "Extract Pages", slug: "/pdf-tools/extract-pages", desc: "Extract specific pages into a new PDF" },
    { title: "Split PDF", slug: "/pdf-tools/split", desc: "Split a PDF into separate files" },
    { title: "Organize PDF", slug: "/pdf-tools/organize", desc: "Rearrange pages in your PDF" },
  ],
  "extract-pages": [
    { title: "Split PDF", slug: "/pdf-tools/split", desc: "Split a PDF into sequential parts" },
    { title: "Remove Pages", slug: "/pdf-tools/remove-pages", desc: "Delete pages from a PDF" },
    { title: "Merge PDF", slug: "/pdf-tools/merge", desc: "Combine extracted pages with other PDFs" },
  ],
  organize: [
    { title: "Merge PDF", slug: "/pdf-tools/merge", desc: "Combine multiple PDFs into one" },
    { title: "Rotate PDF", slug: "/pdf-tools/rotate", desc: "Fix page orientation in your PDF" },
    { title: "Remove Pages", slug: "/pdf-tools/remove-pages", desc: "Delete unwanted pages from a PDF" },
  ],
  "jpg-to-pdf": [
    { title: "PDF to JPG", slug: "/pdf-tools/pdf-to-jpg", desc: "Convert PDF pages back to JPG images" },
    { title: "Merge PDF", slug: "/pdf-tools/merge", desc: "Combine multiple PDFs into one" },
    { title: "Add Page Numbers", slug: "/pdf-tools/add-page-numbers", desc: "Add page numbers to your PDF" },
  ],
  "pdf-to-jpg": [
    { title: "JPG to PDF", slug: "/pdf-tools/jpg-to-pdf", desc: "Convert JPG images to PDF" },
    { title: "Extract Pages", slug: "/pdf-tools/extract-pages", desc: "Extract specific pages from a PDF" },
    { title: "Split PDF", slug: "/pdf-tools/split", desc: "Split a PDF into separate files" },
  ],
  "add-page-numbers": [
    { title: "Add Watermark", slug: "/pdf-tools/add-watermark", desc: "Add a watermark to your PDF" },
    { title: "Organize PDF", slug: "/pdf-tools/organize", desc: "Rearrange pages before numbering" },
    { title: "Merge PDF", slug: "/pdf-tools/merge", desc: "Combine PDFs then add page numbers" },
  ],
  "add-watermark": [
    { title: "Protect PDF", slug: "/pdf-tools/protect-pdf", desc: "Password protect your PDF" },
    { title: "Add Page Numbers", slug: "/pdf-tools/add-page-numbers", desc: "Add page numbers to your PDF" },
    { title: "Sign PDF", slug: "/pdf-tools/sign-pdf", desc: "Add a signature to your PDF" },
  ],
  "protect-pdf": [
    { title: "Add Watermark", slug: "/pdf-tools/add-watermark", desc: "Add a watermark for extra protection" },
    { title: "Sign PDF", slug: "/pdf-tools/sign-pdf", desc: "Add a signature to your PDF" },
    { title: "Merge PDF", slug: "/pdf-tools/merge", desc: "Combine PDFs before protecting" },
  ],
  "sign-pdf": [
    { title: "Protect PDF", slug: "/pdf-tools/protect-pdf", desc: "Password protect your signed PDF" },
    { title: "Add Watermark", slug: "/pdf-tools/add-watermark", desc: "Add a watermark to your PDF" },
    { title: "Merge PDF", slug: "/pdf-tools/merge", desc: "Combine signed documents" },
  ],
  "profit-margin": [
    { title: "Invoice Generator", slug: "invoice", desc: "Create a professional invoice" },
    { title: "Quotation Generator", slug: "quotation", desc: "Send a price quotation to clients" },
    { title: "Receipt Generator", slug: "receipt", desc: "Generate a payment receipt" },
  ],
};

export function getToolSeoContent(slug: string): SeoContent {
  return (
    seoData[slug] ?? {
      heading: "About This Tool",
      content: "This free online tool helps you create professional documents instantly. No sign-up required.",
      faqs: [],
    }
  );
}

export function getRelatedTools(slug: string): RelatedTool[] {
  return relatedToolsMap[slug] ?? [];
}
