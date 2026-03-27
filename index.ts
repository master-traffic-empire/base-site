// @traffic-empire/base-site
// Main barrel export

// Types
export type {
  Tool,
  Category,
  DirectoryData,
  SiteConfig,
  PricingType,
} from "./types"

// Components
export { Analytics } from "./components/Analytics"
export { Header } from "./components/Header"
export { Footer } from "./components/Footer"
export { ToolCard } from "./components/ToolCard"
export { CategoryCard } from "./components/CategoryCard"
export { RecentlyUsed, addRecentPage, getRecentPages } from "./components/RecentlyUsed"
export { ShareButton } from "./components/ShareButton"
export { DarkModeToggle } from "./components/DarkModeToggle"

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
} from "./lib/metadata"
export {
  generateWebSiteJsonLd,
  generateSoftwareApplicationJsonLd,
  generateFAQJsonLd,
  generateItemListJsonLd,
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
