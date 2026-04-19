#!/usr/bin/env bash
# generate-article-image.sh — Generate a Discover-optimized hero image for a blog article
# Uses nano-banana (Gemini) for generation and cwebp for WebP conversion.
#
# Usage:
#   ./generate-article-image.sh <site-dir> <article-slug> "<prompt>"
#
# Requirements:
#   - GEMINI_API_KEY environment variable
#   - npx available (nano-banana auto-installs via npx)
#   - cwebp available (brew install webp)
#
# Output:
#   - <site-dir>/public/images/blog/<article-slug>.webp (1200x675, ~80KB)
#
# Project rule: WebP-only. No PNG/JPEG is kept — all intermediates are deleted.

set -euo pipefail

SITE_DIR="${1:?Usage: generate-article-image.sh <site-dir> <article-slug> \"<prompt>\"}"
SLUG="${2:?Missing article slug}"
PROMPT="${3:?Missing image prompt}"

OUTDIR="$SITE_DIR/public/images/blog"
mkdir -p "$OUTDIR"

TMP_PNG="$(mktemp -t article-image.XXXXXX.png)"
WEBP_PATH="$OUTDIR/$SLUG.webp"

cleanup() { rm -f "$TMP_PNG"; }
trap cleanup EXIT

echo "Generating hero image for article: $SLUG"
echo "Prompt: $PROMPT"

GEMINI_API_KEY="${GEMINI_API_KEY:?Set GEMINI_API_KEY}" \
  npx @the-focus-ai/nano-banana \
  "$PROMPT. Wide landscape format, 16:9 aspect ratio, modern editorial illustration style, vibrant, high contrast, no text." \
  --output "$TMP_PNG"

echo "Generated PNG: $TMP_PNG"

# Convert + resize to WebP in one step via cwebp (the tool agents already use).
cwebp -q 82 -resize 1200 675 "$TMP_PNG" -o "$WEBP_PATH" >/dev/null 2>&1

echo ""
echo "Result:"
ls -lh "$WEBP_PATH" | awk '{print "  " $NF ": " $5}'
echo ""
echo "Use in article frontmatter:"
echo "  image:"
echo "    url: /images/blog/$SLUG.webp"
echo "    alt: <describe the image>"
echo "    width: 1200"
echo "    height: 675"
