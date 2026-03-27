"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import Link from "next/link"

const STORAGE_KEY = "thicket-recently-used"
const MAX_ITEMS = 5

interface RecentItem {
  path: string
  title: string
  timestamp: number
}

/**
 * Reads and writes recently visited tool pages to localStorage.
 * Call addRecentPage() from tool pages to record visits.
 */
export function getRecentPages(): RecentItem[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

export function addRecentPage(path: string, title: string) {
  if (typeof window === "undefined") return
  try {
    const items = getRecentPages().filter((i) => i.path !== path)
    items.unshift({ path, title, timestamp: Date.now() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)))
  } catch {
    // localStorage not available
  }
}

/**
 * RecentlyUsed — Shows last 5 visited tool pages as a horizontal strip.
 * Renders nothing if no recent pages exist.
 */
export function RecentlyUsed() {
  const [items, setItems] = useState<RecentItem[]>([])

  useEffect(() => {
    setItems(getRecentPages())
  }, [])

  if (items.length === 0) return null

  return (
    <div style={{
      padding: "1rem 0",
      marginBottom: "1rem",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.75rem",
        fontSize: "0.85rem",
        color: "var(--color-text-muted)",
        fontWeight: 500,
      }}>
        <Clock size={14} />
        Recently used
      </div>
      <div style={{
        display: "flex",
        gap: "0.5rem",
        overflowX: "auto",
        paddingBottom: "0.25rem",
      }}>
        {items.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            style={{
              display: "inline-block",
              padding: "0.4rem 0.85rem",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "999px",
              fontSize: "0.82rem",
              fontWeight: 500,
              color: "var(--color-text)",
              whiteSpace: "nowrap",
              textDecoration: "none",
              transition: "border-color 200ms ease",
            }}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
