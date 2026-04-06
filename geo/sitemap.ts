// geo/sitemap.ts
// Shared sitemap generator
// Sites use: import { createSitemap } from '@base/geo/sitemap'

import type { MetadataRoute } from "next"
import type { SiteConfig, Tool, Category, Article } from "../types"

interface SitemapOptions {
  siteConfig: SiteConfig
  getAllTools: () => Promise<Tool[]>
  getAllCategories: () => Promise<Category[]>
  /** Blog articles for sitemap inclusion */
  getAllArticles?: () => Promise<Article[]>
  /** Additional static routes beyond /, /tools, /categories */
  extraRoutes?: MetadataRoute.Sitemap
}

export function createSitemap(options: SitemapOptions) {
  return async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { siteConfig, getAllTools, getAllCategories, getAllArticles, extraRoutes } = options
    const tools = await getAllTools()
    const categories = await getAllCategories()
    const articles = getAllArticles ? await getAllArticles() : []
    const now = new Date()
    const blogPath = siteConfig.blog?.basePath ?? "/blog"

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

    // Blog routes
    const blogRoutes: MetadataRoute.Sitemap = []
    if (siteConfig.blog?.enabled && articles.length > 0) {
      blogRoutes.push({
        url: `${siteConfig.baseUrl}${blogPath}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9,
      })
      for (const article of articles) {
        blogRoutes.push({
          url: `${siteConfig.baseUrl}${blogPath}/${article.slug}`,
          lastModified: new Date(article.updatedAt),
          changeFrequency: "weekly",
          priority: 0.8,
        })
      }
    }

    return [
      ...staticRoutes,
      ...toolRoutes,
      ...categoryRoutes,
      ...blogRoutes,
      ...(extraRoutes ?? []),
    ]
  }
}
