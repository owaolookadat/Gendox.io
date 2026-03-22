export function getToolJsonLd(
  slug: string,
  title: string,
  description: string,
  path?: string
): Record<string, unknown> {
  // Strip "| gendox" suffix from the title
  const cleanTitle = title.replace(/\s*[|—]\s*.*$/, "");
  const url = path
    ? `https://gendox.io${path}`
    : `https://gendox.io/generators/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: cleanTitle,
    description,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "gendox",
      url: "https://gendox.io",
    },
  };
}

export function getFaqJsonLd(faqs: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getHomePageJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "gendox",
    url: "https://gendox.io",
    description:
      "Free online document generators. Create professional documents instantly, no sign-up required.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://gendox.io/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}
