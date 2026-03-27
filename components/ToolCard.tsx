// components/ToolCard.tsx
// Reusable tool card component

import Link from "next/link"
import type { Tool } from "../types"

interface ToolCardProps {
  tool: Tool
  /** Show category badge (default: false) */
  showCategory?: boolean
}

export function ToolCard({ tool, showCategory = false }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`} className="card">
      <h3 className="card-title">{tool.name}</h3>
      <p className="card-description">{tool.tagline}</p>
      <div className="card-meta">
        <span className="badge">{tool.pricing}</span>
        {showCategory && <span className="badge">{tool.category}</span>}
        <span className="rating">{tool.rating}/5</span>
      </div>
    </Link>
  )
}
