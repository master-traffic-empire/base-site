"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"
import { trackEvent } from "../lib/analytics"

interface ShareButtonProps {
  className?: string
  label?: string
}

/**
 * ShareButton — Copies current URL (including query params) to clipboard.
 * Useful for sharing calculator results or tool configurations.
 */
export function ShareButton({ className, label = "Share" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url })
      } else {
        await navigator.clipboard.writeText(url)
      }
      setCopied(true)
      trackEvent("share_result", { share_url: url })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // User cancelled share dialog or clipboard failed
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        trackEvent("share_result", { share_url: url })
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // No clipboard access
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className={className || "btn btn-outline"}
      aria-label="Share this page"
      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? "Copied!" : label}
    </button>
  )
}
