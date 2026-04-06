// geo/rss.ts
// RSS 2.0 + Atom feed generator for Google Discover eligibility
// Includes WebSub hub links for automatic aggregator notification
// Sites use: import { createRssFeed, createAtomFeed } from '@base/geo/rss'

import type { SiteConfig, Article } from "../types"

interface FeedOptions {
  siteConfig: SiteConfig
  getArticles: () => Promise<Article[]>
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function toRfc822(date: string): string {
  return new Date(date).toUTCString()
}

function toIso8601(date: string): string {
  return new Date(date).toISOString()
}

// Google's free WebSub hub — Feedly, Flipboard, etc. subscribe via this
const WEBSUB_HUB = "https://pubsubhubbub.appspot.com"

/**
 * Create an RSS 2.0 feed route handler.
 * Use in app/rss.xml/route.ts or app/feed.xml/route.ts
 */
export function createRssFeed(options: FeedOptions) {
  return async function GET() {
    const { siteConfig, getArticles } = options
    const articles = await getArticles()
    const blogPath = siteConfig.blog?.basePath ?? "/blog"
    const feedTitle = siteConfig.blog?.feedTitle ?? siteConfig.name
    const feedDescription =
      siteConfig.blog?.feedDescription ?? siteConfig.description

    const items = articles
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, 50)
      .map(
        (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteConfig.baseUrl}${blogPath}/${article.slug}</link>
      <guid isPermaLink="true">${siteConfig.baseUrl}${blogPath}/${article.slug}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${toRfc822(article.publishedAt)}</pubDate>
      <author>${escapeXml(article.author.name)}</author>
      <category>${escapeXml(article.category)}</category>
      <enclosure url="${siteConfig.baseUrl}${article.image.url}" type="image/webp" length="0" />
    </item>`
      )
      .join("\n")

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${siteConfig.baseUrl}</link>
    <description>${escapeXml(feedDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${toRfc822(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${siteConfig.baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <atom:link href="${WEBSUB_HUB}" rel="hub" />
    <image>
      <url>${siteConfig.baseUrl}/og-image.png</url>
      <title>${escapeXml(feedTitle)}</title>
      <link>${siteConfig.baseUrl}</link>
    </image>
${items}
  </channel>
</rss>`

    return new Response(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  }
}

/**
 * Create an Atom feed route handler.
 * Use in app/atom.xml/route.ts
 */
export function createAtomFeed(options: FeedOptions) {
  return async function GET() {
    const { siteConfig, getArticles } = options
    const articles = await getArticles()
    const blogPath = siteConfig.blog?.basePath ?? "/blog"
    const feedTitle = siteConfig.blog?.feedTitle ?? siteConfig.name
    const feedDescription =
      siteConfig.blog?.feedDescription ?? siteConfig.description

    const sorted = articles
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, 50)

    const lastUpdated = sorted[0]
      ? toIso8601(sorted[0].updatedAt)
      : toIso8601(new Date().toISOString())

    const entries = sorted
      .map(
        (article) => `  <entry>
    <title>${escapeXml(article.title)}</title>
    <link href="${siteConfig.baseUrl}${blogPath}/${article.slug}" />
    <id>${siteConfig.baseUrl}${blogPath}/${article.slug}</id>
    <updated>${toIso8601(article.updatedAt)}</updated>
    <published>${toIso8601(article.publishedAt)}</published>
    <summary>${escapeXml(article.description)}</summary>
    <author>
      <name>${escapeXml(article.author.name)}</name>
    </author>
    <category term="${escapeXml(article.category)}" />
  </entry>`
      )
      .join("\n")

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(feedTitle)}</title>
  <subtitle>${escapeXml(feedDescription)}</subtitle>
  <link href="${siteConfig.baseUrl}/atom.xml" rel="self" />
  <link href="${siteConfig.baseUrl}" />
  <link href="${WEBSUB_HUB}" rel="hub" />
  <id>${siteConfig.baseUrl}/</id>
  <updated>${lastUpdated}</updated>
${entries}
</feed>`

    return new Response(xml, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  }
}
