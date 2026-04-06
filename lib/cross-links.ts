// lib/cross-links.ts
// Topic cluster map for cross-site contextual linking
// Used by the Footer to show related Thicket tools

export interface NetworkSite {
  slug: string
  name: string
  url: string
  tagline: string
  cluster: string
}

// All sites in the Thicket network
export const THICKET_NETWORK: NetworkSite[] = [
  // Finance cluster
  { slug: "finance-calc", name: "MoneyLens", url: "https://money.thicket.sh", tagline: "Financial calculators", cluster: "finance" },
  { slug: "paycheck-calc", name: "PayScale Pro", url: "https://pay.thicket.sh", tagline: "Paycheck & salary calculators", cluster: "finance" },
  { slug: "crypto-tools", name: "StackSats", url: "https://crypto.thicket.sh", tagline: "Crypto calculators & tools", cluster: "finance" },
  { slug: "etf-comparison", name: "FundDuel", url: "https://etf.thicket.sh", tagline: "ETF & fund comparison", cluster: "finance" },
  { slug: "loan-calc", name: "LoanWise", url: "https://loan.thicket.sh", tagline: "Loan payment calculator", cluster: "finance" },
  { slug: "mortgage-calc", name: "KeyRate", url: "https://mortgage.thicket.sh", tagline: "Mortgage calculator", cluster: "finance" },
  { slug: "percentage-calc", name: "QuickPercent", url: "https://percent.thicket.sh", tagline: "Percentage calculator", cluster: "finance" },
  // Health cluster
  { slug: "fitness-calc", name: "CalcFit", url: "https://fit.thicket.sh", tagline: "Fitness & health calculators", cluster: "health" },
  { slug: "pregnancy-calc", name: "NestCalc", url: "https://baby.thicket.sh", tagline: "Pregnancy & due date tools", cluster: "health" },
  { slug: "age-calc", name: "TimeSnap", url: "https://age.thicket.sh", tagline: "Age & date calculators", cluster: "health" },
  // Text & Productivity cluster
  { slug: "text-tools", name: "TextKit", url: "https://text.thicket.sh", tagline: "Text manipulation tools", cluster: "text" },
  { slug: "pdf-tools", name: "DocForge", url: "https://pdf.thicket.sh", tagline: "PDF tools & conversion", cluster: "text" },
  { slug: "typing-test", name: "KeyRush", url: "https://type.thicket.sh", tagline: "Typing speed test", cluster: "text" },
  { slug: "social-text", name: "FormatPad", url: "https://social.thicket.sh", tagline: "Social media text formatter", cluster: "text" },
  { slug: "yt-transcript", name: "CaptionSnag", url: "https://yt.thicket.sh", tagline: "YouTube transcript extractor", cluster: "text" },
  // Visual & Media cluster
  { slug: "image-tools", name: "Pixelry", url: "https://img.thicket.sh", tagline: "Image compress, resize, convert", cluster: "visual" },
  { slug: "color-tools", name: "Chromatic", url: "https://colors.thicket.sh", tagline: "Design-grade color tools", cluster: "visual" },
  { slug: "qr-tools", name: "QRForge", url: "https://qr.thicket.sh", tagline: "QR code generator", cluster: "visual" },
  { slug: "web-capture-tools", name: "CaptureKit", url: "https://capture.thicket.sh", tagline: "Web capture & screenshot", cluster: "visual" },
  // Security cluster
  { slug: "password-gen", name: "KeyForge", url: "https://password.thicket.sh", tagline: "Secure password generator", cluster: "security" },
  { slug: "vpn-compare", name: "ShieldVPN", url: "https://vpn.thicket.sh", tagline: "VPN comparison & reviews", cluster: "security" },
  // Discovery cluster
  { slug: "ai-directory", name: "ToolPilot", url: "https://ai.thicket.sh", tagline: "AI tools directory", cluster: "discovery" },
  { slug: "trend-explainer", name: "TrendWatch", url: "https://trends.thicket.sh", tagline: "Trending topics explained", cluster: "discovery" },
  { slug: "quiz-hub", name: "Quizzly", url: "https://quiz.thicket.sh", tagline: "Personality & knowledge quizzes", cluster: "discovery" },
]

// Adjacent clusters for cross-cluster links
const CLUSTER_ADJACENCY: Record<string, string[]> = {
  finance: ["health", "text"],
  health: ["finance", "discovery"],
  text: ["visual", "security"],
  visual: ["text", "discovery"],
  security: ["text", "visual"],
  discovery: ["health", "finance"],
}

/**
 * Get related sites for a given site slug.
 * Returns up to 5 sites: 3 from the same cluster + 2 from adjacent clusters.
 * Excludes the current site.
 */
export function getRelatedSites(currentSlug: string): NetworkSite[] {
  const current = THICKET_NETWORK.find((s) => s.slug === currentSlug)
  if (!current) {
    // Return a default set (top sites across clusters)
    return THICKET_NETWORK.filter((s) =>
      ["finance-calc", "text-tools", "image-tools", "ai-directory", "fitness-calc"].includes(s.slug)
    )
  }

  const sameCluster = THICKET_NETWORK.filter(
    (s) => s.cluster === current.cluster && s.slug !== currentSlug
  ).slice(0, 3)

  const adjacentClusters = CLUSTER_ADJACENCY[current.cluster] ?? []
  const adjacentSites = THICKET_NETWORK.filter(
    (s) => adjacentClusters.includes(s.cluster) && s.slug !== currentSlug
  )

  // Pick 1 from each adjacent cluster
  const adjacent: NetworkSite[] = []
  for (const clusterName of adjacentClusters) {
    const pick = adjacentSites.find((s) => s.cluster === clusterName)
    if (pick) adjacent.push(pick)
  }

  return [...sameCluster, ...adjacent].slice(0, 5)
}

/**
 * Get all sites in a cluster, excluding the current site.
 */
export function getClusterSites(clusterName: string, excludeSlug?: string): NetworkSite[] {
  return THICKET_NETWORK.filter(
    (s) => s.cluster === clusterName && s.slug !== excludeSlug
  )
}
