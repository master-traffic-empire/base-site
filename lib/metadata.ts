// lib/metadata.ts
// Helper to generate Next.js Metadata from siteConfig

import type { Metadata } from "next"
import type { SiteConfig } from "../types"

/**
 * Generate base metadata for the site's root layout.
 * Sites call this in their layout.tsx or page.tsx.
 */
export function generateSiteMetadata(config: SiteConfig): Metadata {
  return {
    title: {
      default: `${config.name} — ${config.tagline}`,
      template: `%s | ${config.name}`,
    },
    description: config.description,
    keywords: [config.primaryKeyword, ...config.targetKeywords],
    metadataBase: new URL(config.baseUrl),
    icons: {
      icon: "/favicon.svg",
      apple: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: config.baseUrl,
      siteName: config.name,
      title: `${config.name} — ${config.tagline}`,
      description: config.description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: config.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.name} — ${config.tagline}`,
      description: config.description,
      ...(config.twitterHandle
        ? { creator: config.twitterHandle }
        : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: config.baseUrl,
    },
  }
}

/**
 * Generate metadata for a tools listing page.
 */
export function generateToolsPageMetadata(
  config: SiteConfig,
  toolCount?: number
): Metadata {
  const description = toolCount
    ? `Browse all ${toolCount} tools in the ${config.name} directory. ${config.description}`
    : `Browse all tools in the ${config.name} directory. ${config.description}`

  return {
    title: "All Tools",
    description,
    openGraph: {
      title: `All Tools — ${config.name}`,
      description,
      url: `${config.baseUrl}/tools`,
    },
  }
}

/**
 * Generate metadata for a categories listing page.
 */
export function generateCategoriesPageMetadata(config: SiteConfig): Metadata {
  return {
    title: "Categories",
    description: `Browse all categories in ${config.name}. Find the right tools organized by use case.`,
    openGraph: {
      title: `Categories — ${config.name}`,
      description: `Browse all categories in ${config.name}. Find the right tools organized by use case.`,
      url: `${config.baseUrl}/categories`,
    },
  }
}
