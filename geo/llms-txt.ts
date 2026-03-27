// geo/llms-txt.ts
// Shared route handler for /llms.txt
// Sites re-export: export { GET } from '@base/geo/llms-txt'

import type { SiteConfig, Tool, Category, DirectoryData } from "../types"

interface LlmsTxtOptions {
  siteConfig: SiteConfig
  getData: () => Promise<DirectoryData>
  getAllTools: () => Promise<Tool[]>
  getAllCategories: () => Promise<Category[]>
}

export function createLlmsTxtHandler(options: LlmsTxtOptions) {
  return async function GET() {
    const { siteConfig, getAllTools, getAllCategories, getData } = options
    const data = await getData()
    const tools = await getAllTools()
    const categories = await getAllCategories()

    const toolsByCategory = categories.map((cat) => ({
      category: cat,
      tools: tools.filter((t) => t.category === cat.slug),
    }))

    const sections = toolsByCategory
      .filter((tc) => tc.tools.length > 0)
      .map(
        (tc) =>
          `## ${tc.category.name}\n` +
          tc.tools
            .map(
              (t) =>
                `- [${t.name}](https://${siteConfig.domain}/tools/${t.slug}.md): ${t.tagline}`
            )
            .join("\n")
      )
      .join("\n\n")

    const content = `# ${siteConfig.name}
> ${siteConfig.tagline}

${siteConfig.description}

Last updated: ${data.lastUpdated}
Total tools indexed: ${data.totalTools}

${sections}

## Optional
- [About](https://${siteConfig.domain}/about.md): About this directory
- [Submit a Tool](https://${siteConfig.domain}/submit.md): Add your tool to the directory
`

    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    })
  }
}
