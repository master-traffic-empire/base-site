// components/ArticlePage.tsx
// Full article page layout — Google Discover optimized
// Large hero image, structured data, author info, reading time

import Image from "next/image"
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateFAQJsonLd } from "../lib/jsonld"
import type { Article, SiteConfig } from "../types"

interface ArticlePageProps {
  article: Article
  siteConfig: SiteConfig
  /** Rendered article HTML content */
  contentHtml: string
}

export function ArticlePage({
  article,
  siteConfig,
  contentHtml,
}: ArticlePageProps) {
  const blogPath = siteConfig.blog?.basePath ?? "/blog"
  const articleJsonLd = generateArticleJsonLd(article, siteConfig)
  const faqJsonLd = article.faq && article.faq.length > 0
    ? generateFAQJsonLd(article.faq)
    : null
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: siteConfig.baseUrl },
    { name: "Blog", url: `${siteConfig.baseUrl}${blogPath}` },
    {
      name: article.title,
      url: `${siteConfig.baseUrl}${blogPath}/${article.slug}`,
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <article className="article">
        <header className="article-header">
          <nav className="article-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <a href={blogPath}>Blog</a>
            <span aria-hidden="true">/</span>
            <span>{article.category}</span>
          </nav>

          <h1 className="article-title">{article.title}</h1>
          <p className="article-subtitle">{article.description}</p>

          <div className="article-meta">
            <div className="article-author">
              {article.author.image && (
                <Image
                  src={article.author.image}
                  alt={article.author.name}
                  width={40}
                  height={40}
                  className="article-author-avatar"
                />
              )}
              <div>
                <span className="article-author-name">
                  {article.author.url ? (
                    <a href={article.author.url}>{article.author.name}</a>
                  ) : (
                    article.author.name
                  )}
                </span>
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>
            <span className="article-reading-time">
              {article.readingTime} min read
            </span>
          </div>
        </header>

        {/* Hero image — must be ≥1200px wide for Google Discover */}
        <figure className="article-hero">
          <Image
            src={article.image.url}
            alt={article.image.alt}
            width={article.image.width}
            height={article.image.height}
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="article-hero-image"
          />
        </figure>

        <div
          className="article-body prose"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {article.faq && article.faq.length > 0 && (
          <section className="article-faq" aria-labelledby="article-faq-heading">
            <h2 id="article-faq-heading">Frequently Asked Questions</h2>
            {article.faq.map((item, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-question">{item.question}</summary>
                <p className="faq-answer">{item.answer}</p>
              </details>
            ))}
          </section>
        )}

        <footer className="article-footer">
          <div className="article-tags">
            {article.tags.map((tag) => (
              <span key={tag} className="badge">
                {tag}
              </span>
            ))}
          </div>
        </footer>
      </article>
    </>
  )
}
