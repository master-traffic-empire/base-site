// components/ArticleCard.tsx
// Card component for blog listing pages — optimized for Discover click-through

import Link from "next/link"
import Image from "next/image"
import type { Article } from "../types"

interface ArticleCardProps {
  article: Article
  blogPath?: string
}

export function ArticleCard({ article, blogPath = "/blog" }: ArticleCardProps) {
  return (
    <Link
      href={`${blogPath}/${article.slug}`}
      className="article-card"
    >
      <div className="article-card-image">
        <Image
          src={article.image.url}
          alt={article.image.alt}
          width={article.image.width}
          height={article.image.height}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="article-card-content">
        <span className="article-card-category">{article.category}</span>
        <h3 className="article-card-title">{article.title}</h3>
        <p className="article-card-description">{article.description}</p>
        <div className="article-card-meta">
          <span>{article.author.name}</span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <span>{article.readingTime} min read</span>
        </div>
      </div>
    </Link>
  )
}
