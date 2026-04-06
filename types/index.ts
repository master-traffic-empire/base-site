// types/index.ts
// Shared types for all Traffic Empire directory sites

export type PricingType = "free" | "freemium" | "paid" | "open-source"

export interface Tool {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  longDescription?: string
  category: string
  subcategory?: string
  url: string
  screenshotUrl?: string
  logoUrl?: string
  pricing: PricingType
  pricingDetails: string
  tags: string[]
  pros: string[]
  cons: string[]
  bestFor: string
  lastVerified: string
  rating: number
  featured: boolean
  verified: boolean
  addedAt: string
  updatedAt: string
}

export interface Category {
  slug: string
  name: string
  description: string
  icon: string
  toolCount: number
  featured: boolean
}

export interface Article {
  slug: string
  title: string
  description: string
  content: string
  author: {
    name: string
    url?: string
    image?: string
  }
  publishedAt: string
  updatedAt: string
  image: {
    url: string
    alt: string
    width: number
    height: number
  }
  category: string
  tags: string[]
  readingTime: number
  featured: boolean
}

export interface DirectoryData {
  tools: Tool[]
  categories: Category[]
  lastUpdated: string
  totalTools: number
}

export interface SiteConfig {
  // Identity
  slug: string
  name: string
  tagline: string
  description: string
  domain: string
  baseUrl: string
  category: string

  // SEO
  primaryKeyword: string
  targetKeywords: string[]
  twitterHandle: string

  // Design tokens
  colors: {
    primary: string
    secondary: string
    accent: string
    surface: string
    surfaceDark: string
    text: string
    textMuted: string
    border: string
  }

  fonts: {
    display: string
    body: string
    mono: string
  }

  // Analytics
  gaMeasurementId: string

  // Content
  itemsPerPage: number
  featuredCount: number

  // GEO / LLM visibility
  geo: {
    llmsTxtEnabled: boolean
    llmsFullTxtEnabled: boolean
    mdRoutesEnabled: boolean
    structuredApiEnabled: boolean
  }

  // Blog / Google Discover
  blog: {
    enabled: boolean
    /** Path prefix for blog routes (default: "/blog") */
    basePath: string
    /** RSS feed title override (defaults to site name) */
    feedTitle?: string
    /** RSS feed description override */
    feedDescription?: string
  }

  // Monetization
  monetization: {
    adsenseEnabled: boolean
    adsenseClientId: string
    affiliateEnabled: boolean
  }
}
