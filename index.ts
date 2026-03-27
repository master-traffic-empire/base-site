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

// Layout
export { RootLayout } from "./layouts/RootLayout"

// Lib
export { GA_MEASUREMENT_ID, pageview, event } from "./lib/analytics"
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

// GEO route handlers
export { createLlmsTxtHandler } from "./geo/llms-txt"
export { createLlmsFullTxtHandler } from "./geo/llms-full-txt"
export { createLlmApiHandler } from "./geo/llm-api"
export { createSitemap } from "./geo/sitemap"
export { createRobots } from "./geo/robots"
