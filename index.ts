// @traffic-empire/base-site
// Main barrel export

// Types
export type {
  Tool,
  Category,
  DirectoryData,
  SiteConfig,
  PricingType,
  Article,
} from "./types"

// Components
export { Analytics } from "./components/Analytics"
export { Header } from "./components/Header"
export { Footer } from "./components/Footer"
export { ToolCard } from "./components/ToolCard"
export { CategoryCard } from "./components/CategoryCard"
export { ArticleCard } from "./components/ArticleCard"
export { ArticlePage } from "./components/ArticlePage"
export { RecentlyUsed, addRecentPage, getRecentPages } from "./components/RecentlyUsed"
export { ShareButton } from "./components/ShareButton"
export { DarkModeToggle } from "./components/DarkModeToggle"
export { NewsletterSignup } from "./components/NewsletterSignup"
export { FeedbackCTA } from "./components/FeedbackCTA"

// Layout
export { RootLayout } from "./layouts/RootLayout"

// Lib
export {
  GA_MEASUREMENT_ID,
  pageview,
  event,
  trackEvent,
  trackCopy,
  trackOutboundLink,
  trackCrossSiteClick,
  trackToolUsed,
} from "./lib/analytics"
export { useScrollDepth, useTimeOnPage } from "./lib/hooks"
export {
  generateSiteMetadata,
  generateToolsPageMetadata,
  generateCategoriesPageMetadata,
  generateArticleMetadata,
  generateBlogPageMetadata,
} from "./lib/metadata"
export {
  generateWebSiteJsonLd,
  generateSoftwareApplicationJsonLd,
  generateFAQJsonLd,
  generateItemListJsonLd,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
} from "./lib/jsonld"

// Legal
export { CookieConsent } from "./components/CookieConsent"
export { PrivacyPolicy } from "./components/legal/PrivacyPolicy"
export { TermsOfService } from "./components/legal/TermsOfService"
export { About } from "./components/legal/About"
export { Disclaimer } from "./components/legal/Disclaimer"

// GEO route handlers
export { createLlmsTxtHandler } from "./geo/llms-txt"
export { createLlmsFullTxtHandler } from "./geo/llms-full-txt"
export { createLlmApiHandler } from "./geo/llm-api"
export { createSitemap } from "./geo/sitemap"
export { createRobots } from "./geo/robots"
export { createRssFeed, createAtomFeed } from "./geo/rss"
