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
          // ALLOW THE STATIC SUBTREE (2026-10-15). A crawler obeys only its most
          // specific matching group, so Googlebot was never affected by the line
          // below -- it has its own permissive group. Bingbot does not: it falls
          // under "*", and `Disallow: /_next/` hid every page's stylesheets and JS
          // chunks from it, so Bing rendered our pages unstyled and could judge
          // them thin or not mobile-friendly. Bing is our LARGER search channel
          // (169 sessions vs 63 google-organic, 28d to 2026-10-14). Allow wins over
          // Disallow on a longer path match, which is why the order here is safe.
          userAgent: "*",
          allow: ["/", "/_next/static/", "/_next/image"],
          disallow: ["/api/", "/_next/", ...(extraDisallow ?? [])],
        },
        { userAgent: "GPTBot", allow: "/" },
        { userAgent: "ClaudeBot", allow: "/" },
        { userAgent: "PerplexityBot", allow: "/" },
        { userAgent: "Googlebot", allow: "/" },
      ],
      sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
    }
  }
}
