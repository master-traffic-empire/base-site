#!/usr/bin/env bash
# generate-article-image.sh — Generate a Discover-optimized hero image for a blog article
# Uses nano-banana (Gemini) for generation and sharp for optimization.
#
# Usage:
#   ./generate-article-image.sh <site-dir> <article-slug> "<prompt>"
#
# Requirements:
#   - GEMINI_API_KEY environment variable
#   - npx available (nano-banana + sharp-cli auto-install)
#
# Output:
#   - <site-dir>/public/images/blog/<article-slug>.webp (1200x675, <150KB)
#   - <site-dir>/public/images/blog/<article-slug>.png  (original, for OG fallback)

set -euo pipefail

SITE_DIR="${1:?Usage: generate-article-image.sh <site-dir> <article-slug> \"<prompt>\"}"
SLUG="${2:?Missing article slug}"
PROMPT="${3:?Missing image prompt}"

# Ensure output directory exists
OUTDIR="$SITE_DIR/public/images/blog"
mkdir -p "$OUTDIR"

PNG_PATH="$OUTDIR/$SLUG.png"
WEBP_PATH="$OUTDIR/$SLUG.webp"

echo "Generating hero image for article: $SLUG"
echo "Prompt: $PROMPT"

# Generate with nano-banana (1200x675 landscape for Discover)
GEMINI_API_KEY="${GEMINI_API_KEY:?Set GEMINI_API_KEY}" \
  npx @the-focus-ai/nano-banana \
  "$PROMPT. Wide landscape format, 16:9 aspect ratio, modern editorial illustration style, vibrant, high contrast, no text." \
  --output "$PNG_PATH"

echo "Generated: $PNG_PATH"

# Optimize: resize to 1200x675 and convert to WebP
npx sharp-cli \
  --input "$PNG_PATH" \
  --output "$WEBP_PATH" \
  --resize 1200 675 \
  --format webp \
  --quality 82

echo "Optimized: $WEBP_PATH"

# Also resize the PNG for OG image fallback
npx sharp-cli \
  --input "$PNG_PATH" \
  --output "$PNG_PATH" \
  --resize 1200 675 \
  --quality 85

# Report file sizes
echo ""
echo "Results:"
ls -lh "$PNG_PATH" "$WEBP_PATH" 2>/dev/null | awk '{print "  " $NF ": " $5}'
echo ""
echo "Use in article frontmatter:"
echo "  image:"
echo "    url: /images/blog/$SLUG.webp"
echo "    alt: <describe the image>"
echo "    width: 1200"
echo "    height: 675"
