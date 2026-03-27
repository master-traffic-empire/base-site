"use client"

import { useState, useEffect } from "react"
import { GA_MEASUREMENT_ID } from "../lib/analytics"

const CONSENT_KEY = "thicket-cookie-consent"

type ConsentState = "accepted" | "declined" | null

function getStoredConsent(): ConsentState {
  if (typeof window === "undefined") return null
  return localStorage.getItem(CONSENT_KEY) as ConsentState
}

function disableGA() {
  if (typeof window !== "undefined") {
    ;(window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = getStoredConsent()
    if (consent === null) {
      setVisible(true)
    } else if (consent === "declined") {
      disableGA()
    }
  }, [])

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "accepted")
    setVisible(false)
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, "declined")
    disableGA()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "var(--color-surface, #fff)",
        borderTop: "1px solid var(--color-border, #e5e7eb)",
        padding: "1rem",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text, #333)" }}>
          We use cookies and similar technologies for analytics to improve your experience.
          By clicking &ldquo;Accept&rdquo;, you consent to the use of cookies.
          See our <a href="/privacy" style={{ textDecoration: "underline" }}>Privacy Policy</a> for details.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          <button
            onClick={handleDecline}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              border: "1px solid var(--color-border, #e5e7eb)",
              borderRadius: "6px",
              background: "transparent",
              cursor: "pointer",
              color: "var(--color-text-muted, #666)",
            }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              border: "none",
              borderRadius: "6px",
              background: "var(--color-primary, #2563eb)",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
