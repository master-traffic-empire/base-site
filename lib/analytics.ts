// lib/analytics.ts
// GA4 analytics — shared across all Traffic Empire sites

export const GA_MEASUREMENT_ID = "G-E0CF8H2DGH"

// Disable GA4 for internal traffic (agents, scripts, manual testing, bots)
// Three suppression paths:
//   1. ?_internal=1 query param (manual testing, scripts that opt in)
//   2. Bot/headless User-Agent signatures (Googlebot, Lighthouse, Puppeteer, etc.)
//   3. Headless Chrome navigator.webdriver flag
// Diagnosed 2026-05-06: ~71% of GA4 sessions were (direct)/(none) with 13s avg
// duration / 93% bounce — classic bot signature poisoning the engagement metrics.
const BOT_UA_PATTERN =
  /headless|lighthouse|bot|crawler|spider|preview|fetcher|puppeteer|playwright|webdriver|chrome-lighthouse|google-inspectiontool|axios|node-fetch|curl|wget|python-requests/i

if (typeof window !== "undefined") {
  const params = new URLSearchParams(window.location.search)
  const ua = navigator.userAgent || ""
  const isInternal = params.has("_internal")
  const isBot = BOT_UA_PATTERN.test(ua)
  const isWebDriver = (navigator as Navigator & { webdriver?: boolean }).webdriver === true
  if (isInternal || isBot || isWebDriver) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true
  }
}

// Extend Window for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void
    dataLayer: Record<string, unknown>[]
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export function pageview(url: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function event(
  action: string,
  params: {
    category?: string
    label?: string
    value?: number
    [key: string]: string | number | undefined
  } = {}
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: params.category,
      event_label: params.label,
      value: params.value,
      ...params,
    })
  }
}

/**
 * trackEvent — Enhanced event tracking with automatic context enrichment.
 * All events include site_slug, page_path, and timestamp.
 */
export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean | undefined> = {}
) {
  if (typeof window === "undefined" || !window.gtag) return

  // Auto-enrich with context
  const siteSlug = document.querySelector('meta[name="site-slug"]')?.getAttribute("content") || ""
  const pagePath = window.location.pathname

  window.gtag("event", name, {
    site_slug: siteSlug,
    page_path: pagePath,
    timestamp: new Date().toISOString(),
    ...params,
  })
}

/**
 * Track copy-to-clipboard events
 */
export function trackCopy(contentType: string, contentPreview?: string) {
  trackEvent("copy_to_clipboard", {
    content_type: contentType,
    content_preview: contentPreview?.slice(0, 100),
  })
}

/**
 * Track outbound link clicks
 */
export function trackOutboundLink(url: string) {
  trackEvent("external_link", {
    link_url: url,
    link_domain: new URL(url).hostname,
  })
}

/**
 * Track cross-site navigation (to other Thicket sites)
 */
export function trackCrossSiteClick(targetSite: string, targetUrl: string) {
  trackEvent("cross_site_click", {
    target_site: targetSite,
    target_url: targetUrl,
  })
}

/**
 * Track tool usage
 */
export function trackToolUsed(toolName: string, action?: string) {
  trackEvent("tool_used", {
    tool_name: toolName,
    tool_action: action,
  })
}
