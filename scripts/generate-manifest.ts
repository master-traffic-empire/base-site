#!/usr/bin/env npx tsx
/**
 * generate-manifest.ts
 * Reads registry/registry.json and outputs sites-manifest.json
 * with all live sites for cross-site discovery and auto-population.
 *
 * Usage: npx tsx packages/base-site/scripts/generate-manifest.ts
 * Output: packages/base-site/sites-manifest.json
 */

import * as fs from "fs"
import * as path from "path"

interface RegistrySite {
  slug: string
  name: string
  description: string
  subdomain: string
  category: string
  status: string
  repo: string
  netlify_site_id: string
  geo?: {
    llms_txt?: boolean
    structured_api?: boolean
  }
}

interface Registry {
  sites: RegistrySite[]
}

interface ManifestSite {
  slug: string
  name: string
  description: string
  subdomain: string
  url: string
  category: string
  llmsTxt: string | null
  apiEndpoint: string | null
}

interface SitesManifest {
  generatedAt: string
  totalSites: number
  sites: ManifestSite[]
}

const registryPath = path.resolve(__dirname, "../../../registry/registry.json")
const outputPath = path.resolve(__dirname, "../sites-manifest.json")

function main() {
  if (!fs.existsSync(registryPath)) {
    console.error(`Registry not found at ${registryPath}`)
    process.exit(1)
  }

  const registry: Registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"))

  const liveSites = registry.sites.filter((s) => s.status === "live")

  const manifest: SitesManifest = {
    generatedAt: new Date().toISOString(),
    totalSites: liveSites.length,
    sites: liveSites.map((site) => ({
      slug: site.slug,
      name: site.name,
      description: site.description,
      subdomain: site.subdomain,
      url: `https://${site.subdomain}`,
      category: site.category,
      llmsTxt: site.geo?.llms_txt ? `https://${site.subdomain}/llms.txt` : null,
      apiEndpoint: site.geo?.structured_api ? `https://${site.subdomain}/api/llm` : null,
    })),
  }

  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + "\n")
  console.log(`Generated sites-manifest.json with ${manifest.totalSites} live sites`)
}

main()
