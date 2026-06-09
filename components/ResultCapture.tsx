// components/ResultCapture.tsx
// Result-moment audience capture. Renders AFTER a tool/calculator result is shown.
// Converts a one-and-done utility visit into an owned email contact by offering to
// email the user a copy of their result + occasional related tips.
//
// On submit it POSTs to a same-origin endpoint (default: /api/result-capture) that
// persists the email server-side (Netlify Function -> Netlify Blobs). The email is
// tagged with the source page/site so we know which tool/result drove the signup.
//
// Styling uses the base-site CSS variables so it inherits each site's brand.
"use client"

import { useState, type FormEvent } from "react"
import { trackEvent } from "../lib/analytics"

interface ResultCaptureProps {
  /** Which tool/result produced this (e.g. "tdee", "daily-steps"). Stored as a tag. */
  source: string
  /** Optional human label for the result, e.g. "your TDEE". */
  resultLabel?: string
  /** Headline. Sensible default keyed off resultLabel. */
  headline?: string
  /** Sub copy under the headline. */
  subcopy?: string
  /** CTA button label. */
  cta?: string
  /** API endpoint to POST { email, source, resultLabel, path } to. */
  endpoint?: string
}

type Status = "idle" | "loading" | "success" | "error"

export function ResultCapture({
  source,
  resultLabel,
  headline,
  subcopy,
  cta = "Email me my result",
  endpoint = "/api/result-capture",
}: ResultCaptureProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const resolvedHeadline =
    headline ?? `Save ${resultLabel ? resultLabel : "your result"} — get it by email`
  const resolvedSubcopy =
    subcopy ??
    "We'll send a copy you can reference later, plus the occasional related tip. No spam, unsubscribe anytime."

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.")
      setStatus("error")
      return
    }
    setStatus("loading")
    setErrorMsg("")
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          resultLabel: resultLabel ?? "",
          path: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      })
      if (res.ok) {
        setStatus("success")
        setEmail("")
        try {
          trackEvent("result_capture_submit", { capture_source: source })
        } catch {
          /* analytics is best-effort */
        }
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        setErrorMsg(data.error ?? "Something went wrong. Please try again.")
        setStatus("error")
      }
    } catch {
      setErrorMsg("Network error. Please try again.")
      setStatus("error")
    }
  }

  return (
    <section
      aria-label="Save your result by email"
      style={{
        marginTop: "1.25rem",
        padding: "1.1rem 1.25rem",
        borderRadius: 12,
        background: "var(--color-surface, #f8fafc)",
        border: "1px solid var(--color-border, #e2e8f0)",
      }}
    >
      {status === "success" ? (
        <div
          role="status"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            color: "var(--color-text, #1e293b)",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              borderRadius: 999,
              background: "var(--color-accent, #10b981)",
              color: "#fff",
              fontSize: "0.8rem",
              flexShrink: 0,
            }}
          >
            ✓
          </span>
          <span>Done — check your inbox. Your result is on its way.</span>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "0.75rem" }}>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "0.98rem",
                color: "var(--color-text, #1e293b)",
                lineHeight: 1.3,
              }}
            >
              {resolvedHeadline}
            </p>
            <p
              style={{
                margin: "0.3rem 0 0",
                fontSize: "0.82rem",
                color: "var(--color-text-muted, #64748b)",
                lineHeight: 1.45,
              }}
            >
              {resolvedSubcopy}
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <label htmlFor={`result-capture-email-${source}`} style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
              Email address
            </label>
            <input
              id={`result-capture-email-${source}`}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === "error") setStatus("idle")
              }}
              placeholder="you@example.com"
              required
              disabled={status === "loading"}
              style={{
                flex: "1 1 200px",
                minWidth: 0,
                padding: "0.7rem 0.9rem",
                borderRadius: 8,
                border: "1.5px solid var(--color-border, #e2e8f0)",
                fontSize: "0.95rem",
                color: "var(--color-text, #1e293b)",
                background: "#fff",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                flex: "0 0 auto",
                padding: "0.7rem 1.2rem",
                borderRadius: 8,
                background: "var(--color-secondary, var(--color-primary, #3b82f6))",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.92rem",
                border: "none",
                cursor: status === "loading" ? "wait" : "pointer",
                opacity: status === "loading" ? 0.7 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {status === "loading" ? "Sending…" : cta}
            </button>
          </form>
          {status === "error" && (
            <p
              role="alert"
              style={{
                margin: "0.5rem 0 0",
                color: "#ef4444",
                fontSize: "0.82rem",
              }}
            >
              {errorMsg}
            </p>
          )}
        </>
      )}
    </section>
  )
}
