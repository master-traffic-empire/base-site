// geo/robots.ts
// Shared robots.txt generator
// Sites use: import { createRobots } from '@base/geo/robots'

import type { MetadataRoute } from "next"
import type { SiteConfig } from "../types"

interface RobotsOptions {
  siteConfig: SiteConfig
  /** Additional disallowed paths */
  extraDisallow?: string[]
}

export function createRobots(options: RobotsOptions) {
  return function robots(): MetadataRoute.Robots {
    const { siteConfig, extraDisallow } = options

    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/", "/_next/", ...(extraDisallow ?? [])],
        },
        { userAgent: "GPTBot", allow: "/" },
        { userAgent: "ClaudeBot", allow: "/" },
        { userAgent: "PerplexityBot", allow: "/" },
        { userAgent: "Googlebot", allow: "/" },
      ],
      sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
      host: siteConfig.baseUrl,
    }
  }
}
