// lib/hooks.ts
// Client-side tracking hooks for GA4 engagement events

"use client"

import { useEffect, useRef } from "react"
import { trackEvent } from "./analytics"

/**
 * useScrollDepth — Fires GA4 events at 25%, 50%, 75%, 100% scroll depth.
 * Each threshold fires only once per page load.
 */
export function useScrollDepth() {
  const firedRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const thresholds = [25, 50, 75, 100]

    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const percent = Math.round((scrollTop / docHeight) * 100)

      for (const t of thresholds) {
        if (percent >= t && !firedRef.current.has(t)) {
          firedRef.current.add(t)
          trackEvent("scroll_depth", { depth_percent: t })
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
}

/**
 * useTimeOnPage — Fires GA4 events at 15s, 30s, and 60s thresholds.
 * Each threshold fires only once per page load.
 */
export function useTimeOnPage() {
  useEffect(() => {
    const thresholds = [15, 30, 60]
    const timers: ReturnType<typeof setTimeout>[] = []

    for (const seconds of thresholds) {
      timers.push(
        setTimeout(() => {
          trackEvent("time_on_page", { seconds_elapsed: seconds })
        }, seconds * 1000)
      )
    }

    return () => timers.forEach(clearTimeout)
  }, [])
}
