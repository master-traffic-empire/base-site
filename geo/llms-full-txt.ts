// geo/llms-full-txt.ts
// Shared route handler for /llms-full.txt
// Sites re-export: export { GET } from '@base/geo/llms-full-txt'

import type { SiteConfig, Tool } from "../types"

interface LlmsFullTxtOptions {
  siteConfig: SiteConfig
  getAllTools: () => Promise<Tool[]>
}

function toolToMarkdown(tool: Tool): string {
  return `# ${tool.name}

> ${tool.tagline}

${tool.description}${tool.longDescription ? "\n\n" + tool.longDescription : ""}

## Details

- **Category**: ${tool.category}
- **Pricing**: ${tool.pricing} — ${tool.pricingDetails}
- **URL**: ${tool.url}
- **Rating**: ${tool.rating}/5
- **Last verified**: ${tool.lastVerified}

## Pros
${tool.pros.map((p) => `- ${p}`).join("\n")}

## Cons
${tool.cons.map((c) => `- ${c}`).join("\n")}

## Best for
${tool.bestFor}
`
}

export function createLlmsFullTxtHandler(options: LlmsFullTxtOptions) {
  return async function GET() {
    const { siteConfig, getAllTools } = options
    const tools = await getAllTools()
    const sections = tools.map(toolToMarkdown)

    const content = `# ${siteConfig.name} — Complete Directory\n\n${sections.join("\n\n---\n\n")}`

    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    })
  }
}
