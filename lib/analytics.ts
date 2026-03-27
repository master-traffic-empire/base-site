// lib/analytics.ts
// GA4 analytics — shared across all Traffic Empire sites

export const GA_MEASUREMENT_ID = "G-E0CF8H2DGH"

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
