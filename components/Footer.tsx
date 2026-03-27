// components/Footer.tsx
// Shared footer component

import Link from "next/link"
import type { SiteConfig } from "../types"

interface FooterProps {
  siteConfig: SiteConfig
  /** Additional nav links beyond the defaults */
  extraLinks?: Array<{ href: string; label: string }>
}

export function Footer({ siteConfig, extraLinks }: FooterProps) {
  return (
    <footer className="footer">
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
        </nav>
      </div>
    </footer>
  )
}
