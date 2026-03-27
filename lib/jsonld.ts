// lib/jsonld.ts
// Helpers to generate JSON-LD structured data schemas

import type { SiteConfig, Tool } from "../types"

/**
 * Generate WebSite JSON-LD schema for the homepage.
 */
export function generateWebSiteJsonLd(config: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.name,
    url: config.baseUrl,
    description: config.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${config.baseUrl}/tools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

/**
 * Generate SoftwareApplication JSON-LD schema for a tool detail page.
 */
export function generateSoftwareApplicationJsonLd(
  tool: Tool,
  config: SiteConfig
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: tool.category,
    offers: {
      "@type": "Offer",
      price:
        tool.pricing === "free" || tool.pricing === "open-source"
          ? "0"
          : undefined,
      priceCurrency: "USD",
      description: tool.pricingDetails,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.rating,
      bestRating: 5,
      worstRating: 0,
    },
  }
}

/**
 * Generate FAQPage JSON-LD schema.
 * Pass an array of { question, answer } pairs.
 */
export function generateFAQJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
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
  }
}

/**
 * Generate ItemList JSON-LD schema for tool listing pages.
 */
export function generateItemListJsonLd(
  tools: Tool[],
  config: SiteConfig,
  listName: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${config.baseUrl}/tools/${tool.slug}`,
      name: tool.name,
    })),
  }
}
