// lib/analytics.ts
// GA4 analytics — shared across all Traffic Empire sites

export const GA_MEASUREMENT_ID = "G-E0CF8H2DGH"

// Suppression paths (we set window['ga-disable-G-...'] = true to block firing):
//   1. ?_internal=1 query param (manual testing, scripts that opt in)
//   2. Bot/headless User-Agent signatures (catches non-stealth bots)
//   3. navigator.webdriver flag (catches old WebDriver-driven sessions)
//   4. **Interaction gate** (NEW 2026-05-11): GA4 is disabled by default and
//      only re-enabled after a real user signal (scroll, mousemove, click,
//      touchstart, keydown, or visibilitychange-to-visible after dwell > 3s).
//
// Why (4): 2026-05-08 deploy added UA+webdriver gates and worked for 2 days,
// but a stealth-UA datacenter bot fleet (Singapore Chrome-on-Windows, sub-1s
// dwell, 0% engagement) flooded direct/none to 88% by 2026-05-10 — the regex
// can't see them because they spoof a clean UA and patch navigator.webdriver.
// An interaction gate catches them because they never scroll or move a mouse.
// Real users always trigger one of these signals within a few seconds.
const BOT_UA_PATTERN =
  /headless|lighthouse|bot|crawler|spider|preview|fetcher|puppeteer|playwright|webdriver|chrome-lighthouse|google-inspectiontool|axios|node-fetch|curl|wget|python-requests|monitor|uptimerobot|pingdom|datadog|gpt|claude|anthropic|openai/i

// Module-level so external code (gtag stub etc.) can check.
export let gaEnabled = false

if (typeof window !== "undefined") {
  const params = new URLSearchParams(window.location.search)
  const ua = navigator.userAgent || ""
  const isInternal = params.has("_internal")
  const isBot = BOT_UA_PATTERN.test(ua)
  const isWebDriver = (navigator as Navigator & { webdriver?: boolean }).webdriver === true
  const hardBlock = isInternal || isBot || isWebDriver

  const disableKey = `ga-disable-${GA_MEASUREMENT_ID}`
  const win = window as unknown as Record<string, unknown>

  // Start disabled by default. Real-user signals flip it on.
  win[disableKey] = true

  if (!hardBlock) {
    let armed = false
    const enable = () => {
      if (armed) return
      armed = true
      gaEnabled = true
      win[disableKey] = false
      // Replay a pageview now that GA is unlocked (gtag in layout fires at load
      // when disable=true → ignored; we re-emit so the real session is counted).
      const gtag = (win as { gtag?: (...a: unknown[]) => void }).gtag
      if (typeof gtag === "function") {
        gtag("config", GA_MEASUREMENT_ID, { page_path: window.location.pathname })
      }
      cleanup()
    }
    const onScrollOrMove = () => enable()
    const onClickOrKey = () => enable()
    const onTouch = () => enable()
    // Dwell fallback: if the tab is visible and the user stays > 8s, count it
    // as engaged even without interaction (someone reading a long article).
    let dwellTimer: ReturnType<typeof setTimeout> | null = null
    const startDwell = () => {
      if (dwellTimer) return
      dwellTimer = setTimeout(enable, 8000)
    }
    const stopDwell = () => {
      if (dwellTimer) {
        clearTimeout(dwellTimer)
        dwellTimer = null
      }
    }
    const onVisibility = () => {
      if (document.visibilityState === "visible") startDwell()
      else stopDwell()
    }
    const cleanup = () => {
      window.removeEventListener("scroll", onScrollOrMove, true)
      window.removeEventListener("mousemove", onScrollOrMove, true)
      window.removeEventListener("click", onClickOrKey, true)
      window.removeEventListener("keydown", onClickOrKey, true)
      window.removeEventListener("touchstart", onTouch, true)
      document.removeEventListener("visibilitychange", onVisibility)
      stopDwell()
    }
    window.addEventListener("scroll", onScrollOrMove, { capture: true, passive: true })
    window.addEventListener("mousemove", onScrollOrMove, { capture: true, passive: true })
    window.addEventListener("click", onClickOrKey, true)
    window.addEventListener("keydown", onClickOrKey, true)
    window.addEventListener("touchstart", onTouch, { capture: true, passive: true })
    document.addEventListener("visibilitychange", onVisibility)
    if (document.visibilityState === "visible") startDwell()
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
