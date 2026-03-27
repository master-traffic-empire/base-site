// components/Header.tsx
// Shared header/nav — reads siteConfig for name and links

import Link from "next/link"
import type { SiteConfig } from "../types"

interface HeaderProps {
  siteConfig: SiteConfig
  /** Additional nav links beyond the defaults */
  extraLinks?: Array<{ href: string; label: string }>
}

export function Header({ siteConfig, extraLinks }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="header-logo">
          {siteConfig.name}
        </Link>
        <nav className="header-nav">
          <Link href="/tools">Tools</Link>
          <Link href="/categories">Categories</Link>
          {extraLinks?.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
