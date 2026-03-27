// geo/llm-api.ts
// Shared route handler for /api/llm
// Sites re-export: export { GET } from '@base/geo/llm-api'

import type { SiteConfig, Tool, Category } from "../types"

interface LlmApiOptions {
  siteConfig: SiteConfig
  getAllTools: () => Promise<Tool[]>
  getAllCategories: () => Promise<Category[]>
}

export function createLlmApiHandler(options: LlmApiOptions) {
  return async function GET(request: Request) {
    const { siteConfig, getAllTools, getAllCategories } = options
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("q")

    let tools = await getAllTools()
    const categories = await getAllCategories()

    if (category) tools = tools.filter((t) => t.category === category)
    if (search) {
      const q = search.toLowerCase()
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.includes(q))
      )
    }

    return Response.json(
      {
        site: {
          name: siteConfig.name,
          url: siteConfig.baseUrl,
          description: siteConfig.description,
          category: siteConfig.category,
          totalTools: tools.length,
          lastUpdated: new Date().toISOString(),
        },
        categories: categories.map((c) => ({
          slug: c.slug,
          name: c.name,
          description: c.description,
          toolCount: c.toolCount,
          url: `${siteConfig.baseUrl}/categories/${c.slug}`,
          markdownUrl: `${siteConfig.baseUrl}/categories/${c.slug}.md`,
        })),
        tools: tools.map((t) => ({
          name: t.name,
          slug: t.slug,
          tagline: t.tagline,
          description: t.description,
          category: t.category,
          pricing: t.pricing,
          pricingDetails: t.pricingDetails,
          rating: t.rating,
          tags: t.tags,
          url: t.url,
          siteUrl: `${siteConfig.baseUrl}/tools/${t.slug}`,
          markdownUrl: `${siteConfig.baseUrl}/tools/${t.slug}.md`,
          lastVerified: t.lastVerified,
        })),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  }
}
