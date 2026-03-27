// layouts/RootLayout.tsx
// Shared root layout with fonts, metadata, JSON-LD, and analytics

import { Inter, Syne, DM_Sans, JetBrains_Mono } from "next/font/google"
import { Analytics } from "../components/Analytics"
import { generateWebSiteJsonLd } from "../lib/jsonld"
import type { SiteConfig } from "../types"
import React from "react"

// Preload common fonts — sites override via CSS custom properties
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

interface RootLayoutProps {
  children: React.ReactNode
  siteConfig: SiteConfig
  /** Extra CSS class names for the body element */
  bodyClassName?: string
  /** Override the default font CSS variables */
  fontVariables?: string
}

export function RootLayout({
  children,
  siteConfig,
  bodyClassName,
  fontVariables,
}: RootLayoutProps) {
  const jsonLd = generateWebSiteJsonLd(siteConfig)
  const fontClasses =
    fontVariables ?? `${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-primary: ${siteConfig.colors.primary};
                --color-secondary: ${siteConfig.colors.secondary};
                --color-accent: ${siteConfig.colors.accent};
                --color-surface: ${siteConfig.colors.surface};
                --color-surface-dark: ${siteConfig.colors.surfaceDark};
                --color-text: ${siteConfig.colors.text};
                --color-text-muted: ${siteConfig.colors.textMuted};
                --color-border: ${siteConfig.colors.border};
              }
            `,
          }}
        />
      </head>
      <body className={`${fontClasses} ${bodyClassName ?? ""}`.trim()}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
