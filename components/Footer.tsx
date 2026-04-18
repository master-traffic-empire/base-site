// components/Footer.tsx
// Shared footer component with cross-site network links

import Link from "next/link"
import type { SiteConfig } from "../types"
import { getRelatedSites } from "../lib/cross-links"

interface FooterProps {
  siteConfig: SiteConfig
  /** Additional nav links beyond the defaults */
  extraLinks?: Array<{ href: string; label: string }>
}

export function Footer({ siteConfig, extraLinks }: FooterProps) {
  const relatedSites = getRelatedSites(siteConfig.slug)

  return (
    <footer className="footer">
      {/* Cross-site network section */}
      {relatedSites.length > 0 && (
        <div
          className="container"
          style={{
            paddingTop: "1.5rem",
            paddingBottom: "1rem",
            borderTop: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,.4)",
              marginBottom: "0.75rem",
            }}
          >
            More free tools from Thicket
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {relatedSites.map((site) => (
              <a
                key={site.slug}
                href={site.url}
                title={site.tagline}
                className="footer-network-pill"
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,.65)",
                  textDecoration: "none",
                  padding: "0.25rem 0.625rem",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: "999px",
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                {site.name}
              </a>
            ))}
            <a
              href="https://thicket.sh"
              title="All free tools on Thicket"
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,.4)",
                textDecoration: "none",
                padding: "0.25rem 0.625rem",
                transition: "color 0.15s",
              }}
            >
              All 25 tools →
            </a>
          </div>
        </div>
      )}

      <div className="container footer-inner">
        <span>
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </span>
        <nav className="header-nav">
          <Link href="/tools">Tools</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/llms.txt">llms.txt</Link>
          {extraLinks?.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/about">About</Link>
          <a href="https://bsky.app/profile/thicket06.bsky.social" target="_blank" rel="noopener noreferrer">Feedback</a>
        </nav>
      </div>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", paddingTop: "0.75rem", paddingBottom: "0.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,.5)" }}>
        <span>Part of the <a href="https://thicket.sh" style={{ color: "rgba(255,255,255,.65)", textDecoration: "none" }}>Thicket network</a></span>
        <a href="https://bsky.app/profile/thicket06.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Bluesky" style={{ color: "rgba(255,255,255,.6)" }} title="Bluesky">
          <svg width="18" height="18" viewBox="0 0 600 530" fill="currentColor"><path d="M135.72 44.03C202.216 93.951 273.74 195.401 300 249.281c26.26-53.88 97.784-155.33 164.28-205.251C512.26 8.009 590-19.862 590 68.825c0 17.746-10.2 149.055-16.18 170.3-20.782 73.894-96.678 92.722-163.756 81.294 117.329 19.964 147.063 86.092 82.63 152.213C402.15 563.398 302.203 464.461 300 417.78c-2.203 46.681-102.15 145.618-192.694 54.852-64.433-66.12-34.7-132.249 82.63-152.213-67.078 11.428-142.974-7.4-163.756-81.294C20.2 217.88 10 86.57 10 68.825 10-19.862 87.74 8.01 135.72 44.03Z"/></svg>
        </a>
        <a href="https://mastodon.social/@thicket06" target="_blank" rel="noopener noreferrer me" aria-label="Mastodon" style={{ color: "rgba(255,255,255,.6)" }} title="Mastodon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.327 8.566c0-4.339-2.843-5.61-2.843-5.61-1.433-.658-3.894-.935-6.451-.956h-.063c-2.557.021-5.016.298-6.45.956 0 0-2.843 1.272-2.843 5.61 0 .993-.019 2.181.012 3.441.103 4.243.778 8.425 4.701 9.463 1.809.479 3.362.579 4.612.51 2.268-.126 3.541-.809 3.541-.809l-.075-1.646s-1.621.511-3.441.449c-1.804-.062-3.707-.194-3.999-2.409a4.523 4.523 0 0 1-.04-.621s1.77.432 4.014.535c1.372.063 2.658-.08 3.965-.236 2.506-.299 4.688-1.843 4.962-3.254.433-2.223.397-5.424.397-5.424zm-3.353 5.59h-2.081V9.057c0-1.075-.452-1.62-1.357-1.62-1 0-1.501.647-1.501 1.927v2.791h-2.069V9.364c0-1.28-.501-1.927-1.502-1.927-.904 0-1.357.546-1.357 1.62v5.099H6.026V8.903c0-1.074.273-1.927.823-2.558.566-.631 1.307-.955 2.228-.955 1.065 0 1.872.41 2.405 1.228l.518.869.519-.869c.533-.818 1.34-1.228 2.405-1.228.92 0 1.662.324 2.228.955.549.631.822 1.484.822 2.558v5.253z"/></svg>
        </a>
        <a href="https://github.com/master-traffic-empire" target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ color: "rgba(255,255,255,.6)" }} title="GitHub">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </a>
        <a href="https://discord.gg/thicket" target="_blank" rel="noopener noreferrer" aria-label="Discord" style={{ color: "rgba(255,255,255,.6)" }} title="Discord">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
        </a>
      </div>
    </footer>
  )
}
