// lib/result-capture.ts
// Server-side handler factory for result-moment email capture.
//
// Persists submissions to Netlify Blobs — no external/paid service required.
// Netlify Blobs is automatically available to functions on any Netlify deploy
// (the @netlify/plugin-nextjs runtime injects the credentials), so a Next.js
// Route Handler running on Netlify can call getStore() with zero config.
//
// Each submission is stored as its own JSON blob keyed by timestamp+email so
// nothing is ever overwritten, and a per-email record is kept for de-dup/lookup.
//
// Usage in a site repo (app/api/result-capture/route.ts):
//   import { createResultCaptureHandler } from "@base/lib/result-capture"
//   export const POST = createResultCaptureHandler({ site: "fitness-calc" })
//   export const runtime = "nodejs"

import { getStore } from "@netlify/blobs"

interface CapturePayload {
  email?: unknown
  source?: unknown
  resultLabel?: unknown
  path?: unknown
}

export interface ResultCaptureRecord {
  email: string
  site: string
  source: string
  resultLabel: string
  path: string
  ts: string
  userAgent: string
  referer: string
}

export interface ResultCaptureOptions {
  /** Site slug, stored on every record + used as a tag. */
  site: string
  /** Netlify Blobs store name. Default "result-captures". */
  storeName?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export function createResultCaptureHandler(options: ResultCaptureOptions) {
  const { site, storeName = "result-captures" } = options

  return async function POST(request: Request): Promise<Response> {
    let payload: CapturePayload
    try {
      payload = (await request.json()) as CapturePayload
    } catch {
      return json({ error: "Invalid request body" }, 400)
    }

    const email =
      typeof payload.email === "string" ? payload.email.trim().toLowerCase() : ""
    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return json({ error: "Valid email required" }, 400)
    }

    const record: ResultCaptureRecord = {
      email,
      site,
      source: typeof payload.source === "string" ? payload.source.slice(0, 80) : "",
      resultLabel:
        typeof payload.resultLabel === "string"
          ? payload.resultLabel.slice(0, 120)
          : "",
      path: typeof payload.path === "string" ? payload.path.slice(0, 200) : "",
      ts: new Date().toISOString(),
      userAgent: (request.headers.get("user-agent") ?? "").slice(0, 300),
      referer: (request.headers.get("referer") ?? "").slice(0, 300),
    }

    try {
      const store = getStore({ name: storeName, consistency: "strong" })

      // 1) Append-only event log: one blob per submission, never overwritten.
      const eventKey = `events/${site}/${record.ts}-${Buffer.from(email)
        .toString("base64url")
        .slice(0, 16)}`
      await store.setJSON(eventKey, record)

      // 2) Per-email latest record (idempotent de-dup / quick lookup).
      const emailKey = `emails/${Buffer.from(email).toString("base64url")}`
      await store.setJSON(emailKey, record)

      return json({ ok: true })
    } catch (err) {
      console.error("result-capture: failed to persist", err)
      return json({ error: "Could not save right now. Please try again." }, 500)
    }
  }
}

/**
 * Reads back all stored capture events for verification/export.
 * Returns the parsed records (most recent first is not guaranteed — caller sorts).
 */
export async function listResultCaptures(
  storeName = "result-captures"
): Promise<ResultCaptureRecord[]> {
  const store = getStore({ name: storeName, consistency: "strong" })
  const { blobs } = await store.list({ prefix: "events/" })
  const records: ResultCaptureRecord[] = []
  for (const b of blobs) {
    const rec = (await store.get(b.key, { type: "json" })) as ResultCaptureRecord | null
    if (rec) records.push(rec)
  }
  return records
}
