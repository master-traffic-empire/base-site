// geo/robots.ts
// Shared robots.txt generator
// Sites use: import { createRobots } from '@base/geo/robots'

import type { MetadataRoute } from "next"
import type { SiteConfig } from "../types"

interface RobotsOptions {
  siteConfig: SiteConfig
  /** Additional disallowed paths */
  extraDisallow?: string[]
  /** Additional user-agent rules */
  extraRules?: MetadataRoute.Robots["rules"]
}

export function createRobots(options: RobotsOptions) {
  return function robots(): MetadataRoute.Robots {
    const { siteConfig, extraDisallow, extraRules } = options

    const defaultRules: MetadataRoute.Robots["rules"] = [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", ...(extraDisallow ?? [])],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
    ]

    const rules = extraRules
      ? [...defaultRules, ...(Array.isArray(extraRules) ? extraRules : [extraRules])]
      : defaultRules

    return {
      rules,
      sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
      host: siteConfig.baseUrl,
    }
  }
}
