"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

const STORAGE_KEY = "thicket-dark-mode"

/**
 * DarkModeToggle — Respects prefers-color-scheme, stores preference in
 * localStorage, and toggles the "dark" class on the html element.
 */
export function DarkModeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      setDark(stored === "true")
    } else {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem(STORAGE_KEY, String(dark))
  }, [dark, mounted])

  if (!mounted) return null

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        background: "none",
        border: "none",
        color: "inherit",
        cursor: "pointer",
        padding: "0.25rem",
        display: "flex",
        alignItems: "center",
      }}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
