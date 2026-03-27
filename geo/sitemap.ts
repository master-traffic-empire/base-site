// geo/sitemap.ts
// Shared sitemap generator
// Sites use: import { createSitemap } from '@base/geo/sitemap'

import type { MetadataRoute } from "next"
import type { SiteConfig, Tool, Category } from "../types"

interface SitemapOptions {
  siteConfig: SiteConfig
  getAllTools: () => Promise<Tool[]>
  getAllCategories: () => Promise<Category[]>
  /** Additional static routes beyond /, /tools, /categories */
  extraRoutes?: MetadataRoute.Sitemap
}

export function createSitemap(options: SitemapOptions) {
  return async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { siteConfig, getAllTools, getAllCategories, extraRoutes } = options
    const tools = await getAllTools()
    const categories = await getAllCategories()
    const now = new Date()

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: siteConfig.baseUrl,
        lastModified: now,
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${siteConfig.baseUrl}/tools`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${siteConfig.baseUrl}/categories`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ]

    const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
      url: `${siteConfig.baseUrl}/tools/${tool.slug}`,
      lastModified: new Date(tool.updatedAt),
      changeFrequency: "weekly" as const,
      priority: tool.featured ? 0.9 : 0.7,
    }))

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${siteConfig.baseUrl}/categories/${cat.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))

    return [
      ...staticRoutes,
      ...toolRoutes,
      ...categoryRoutes,
      ...(extraRoutes ?? []),
    ]
  }
}
