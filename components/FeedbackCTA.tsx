// components/FeedbackCTA.tsx
// Feedback CTA + social links — shown on all tool pages.
// Two variants: "inline" (below results) and "floating" (bottom-right)
"use client"

import { useState } from "react"

const SOCIAL_LINKS = [
  { name: "Bluesky", url: "https://bsky.app/profile/thicket06.bsky.social", color: "#0085ff", icon: <svg width="16" height="16" viewBox="0 0 600 530" fill="currentColor"><path d="M135.72 44.03C202.216 93.951 273.74 195.401 300 249.281c26.26-53.88 97.784-155.33 164.28-205.251C512.26 8.009 590-19.862 590 68.825c0 17.746-10.2 149.055-16.18 170.3-20.782 73.894-96.678 92.722-163.756 81.294 117.329 19.964 147.063 86.092 82.63 152.213C402.15 563.398 302.203 464.461 300 417.78c-2.203 46.681-102.15 145.618-192.694 54.852-64.433-66.12-34.7-132.249 82.63-152.213-67.078 11.428-142.974-7.4-163.756-81.294C20.2 217.88 10 86.57 10 68.825 10-19.862 87.74 8.01 135.72 44.03Z"/></svg> },
  { name: "LinkedIn", url: "https://linkedin.com/company/thicket-team", color: "#0A66C2", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { name: "Facebook", url: "https://facebook.com/profile.php?id=61574304050649", color: "#1877F2", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { name: "GitHub", url: "https://github.com/master-traffic-empire", color: "#6e7681", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
  { name: "Discord", url: "https://discord.gg/thicket", color: "#5865F2", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg> },
]

interface FeedbackCTAProps {
  variant?: "inline" | "floating"
  prompt?: string
}

export function FeedbackCTA({
  variant = "inline",
  prompt = "Found a bug or have feedback?",
}: FeedbackCTAProps) {
  const [open, setOpen] = useState(false)

  if (variant === "floating") {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.5rem",
        }}
      >
        {open && (
          <div
            style={{
              background: "var(--color-white, #fff)",
              border: "1px solid var(--color-border, #e2e8f0)",
              borderRadius: 12,
              boxShadow: "0 10px 25px rgba(0,0,0,.12)",
              padding: "1rem 1.25rem",
              maxWidth: 260,
              fontSize: "0.875rem",
              color: "var(--color-text, #1e293b)",
              lineHeight: 1.5,
            }}
          >
            <p style={{ marginBottom: "0.5rem", fontWeight: 600 }}>
              {prompt}
            </p>
            <p style={{ marginBottom: "0.75rem", fontSize: "0.8rem", color: "#64748b" }}>
              Reach us on any platform:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.4rem 0.75rem",
                    borderRadius: 6,
                    background: s.color,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    textDecoration: "none",
                    transition: "opacity 150ms",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {s.icon} {s.name}
                </a>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close feedback panel" : "Share feedback"}
          aria-expanded={open}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.55rem 1rem",
            borderRadius: 999,
            background: "var(--color-primary, #0f172a)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.825rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,.15)",
            transition: "opacity 150ms",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {open ? "Close" : "Feedback"}
        </button>
      </div>
    )
  }

  // Inline variant — social links bar
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginTop: "1.25rem",
        padding: "0.65rem 1rem",
        borderRadius: 8,
        background: "var(--color-surface, #f8fafc)",
        border: "1px solid var(--color-border, #e2e8f0)",
        fontSize: "0.825rem",
        color: "var(--color-text-muted, #64748b)",
      }}
      role="complementary"
      aria-label="Feedback and social links"
    >
      <span>{prompt}</span>
      <span style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
        {SOCIAL_LINKS.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            title={s.name}
            style={{ color: s.color, display: "inline-flex", transition: "opacity 150ms" }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {s.icon}
          </a>
        ))}
      </span>
    </div>
  )
}
