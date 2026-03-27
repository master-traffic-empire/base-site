// components/CategoryCard.tsx
// Reusable category card component

import Link from "next/link"
import type { Category } from "../types"
import { CategoryIcon } from "../../app/components/CategoryIcon"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="card">
      <div className="category-icon"><CategoryIcon name={category.icon} size={32} /></div>
      <h3 className="card-title">{category.name}</h3>
      <p className="card-description">{category.description}</p>
      <div className="card-meta">
        <span className="badge">{category.toolCount} tools</span>
      </div>
    </Link>
  )
}
