// lib/metadata.ts
// Helper to generate Next.js Metadata from siteConfig

import type { Metadata } from "next"
import type { SiteConfig, Article } from "../types"

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
      ...(config.blog?.enabled
        ? {
            types: {
              "application/rss+xml": `${config.baseUrl}/rss.xml`,
              "application/atom+xml": `${config.baseUrl}/atom.xml`,
            },
          }
        : {}),
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
 * Generate metadata for a blog article page.
 * Optimized for Google Discover with large image preview and article meta.
 */
export function generateArticleMetadata(
  article: Article,
  config: SiteConfig
): Metadata {
  const blogPath = config.blog?.basePath ?? "/blog"
  const articleUrl = `${config.baseUrl}${blogPath}/${article.slug}`

  return {
    title: article.title,
    description: article.description,
    authors: [{ name: article.author.name, url: article.author.url }],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: articleUrl,
      siteName: config.name,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      section: article.category,
      tags: article.tags,
      images: [
        {
          url: `${config.baseUrl}${article.image.url}`,
          width: article.image.width,
          height: article.image.height,
          alt: article.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [`${config.baseUrl}${article.image.url}`],
    },
    alternates: {
      canonical: articleUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
  }
}

/**
 * Generate metadata for the blog listing page.
 */
export function generateBlogPageMetadata(config: SiteConfig): Metadata {
  const blogPath = config.blog?.basePath ?? "/blog"
  const title = `Blog — ${config.name}`
  const description = `Latest articles, guides, and insights from ${config.name}.`

  return {
    title: "Blog",
    description,
    openGraph: {
      title,
      description,
      url: `${config.baseUrl}${blogPath}`,
    },
    alternates: {
      types: {
        "application/rss+xml": `${config.baseUrl}/rss.xml`,
        "application/atom+xml": `${config.baseUrl}/atom.xml`,
      },
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
