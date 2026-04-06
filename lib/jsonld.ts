// lib/jsonld.ts
// Helpers to generate JSON-LD structured data schemas

import type { SiteConfig, Tool, Article } from "../types"

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
 * Generate Article JSON-LD schema for blog posts.
 * Uses NewsArticle type which is preferred by Google Discover.
 */
export function generateArticleJsonLd(article: Article, config: SiteConfig) {
  const blogPath = config.blog?.basePath ?? "/blog"

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: [
      `${config.baseUrl}${article.image.url}`,
    ],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      ...(article.author.url ? { url: article.author.url } : {}),
      ...(article.author.image ? { image: article.author.image } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: config.name,
      url: config.baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${config.baseUrl}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${config.baseUrl}${blogPath}/${article.slug}`,
    },
    wordCount: article.content.split(/\s+/).length,
    articleSection: article.category,
    keywords: article.tags.join(", "),
  }
}

/**
 * Generate BreadcrumbList JSON-LD for article pages.
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
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
