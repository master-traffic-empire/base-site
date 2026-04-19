#!/usr/bin/env bash
# ping-feed-hubs.sh — Notify WebSub hubs and aggregators of new feed content
# Run this after every deploy that includes new blog articles.
#
# Usage:
#   ./ping-feed-hubs.sh <site-base-url>
#   ./ping-feed-hubs.sh https://fit.thicket.sh
#
# What it does:
#   1. Pings Google's WebSub hub — Feedly, Flipboard, NewsBlur auto-subscribe
#   2. Pings IndexNow (Bing/Yandex) for the RSS feed URL (if key is published)
#
# Google's legacy /ping?sitemap= endpoint was deprecated in 2023 and is NOT called.

set -euo pipefail

SITE_URL="${1:?Usage: ping-feed-hubs.sh <site-base-url>}"
SITE_URL="${SITE_URL%/}"

RSS_URL="$SITE_URL/rss.xml"
ATOM_URL="$SITE_URL/atom.xml"
WEBSUB_HUB="https://pubsubhubbub.appspot.com"

echo "=== Feed Hub Pinger ==="
echo "Site: $SITE_URL"
echo ""

# 1. WebSub / PubSubHubbub — notifies Feedly, Flipboard, NewsBlur subscribers.
echo "1. Pinging WebSub hub (Google PubSubHubbub)..."

RSS_HUB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$WEBSUB_HUB" \
  -d "hub.mode=publish" \
  -d "hub.url=$RSS_URL" \
  --max-time 10 2>/dev/null || echo "FAIL")
echo "   RSS ($RSS_URL): $RSS_HUB_STATUS"

ATOM_HUB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$WEBSUB_HUB" \
  -d "hub.mode=publish" \
  -d "hub.url=$ATOM_URL" \
  --max-time 10 2>/dev/null || echo "FAIL")
echo "   Atom ($ATOM_URL): $ATOM_HUB_STATUS"

# 2. IndexNow (Bing/Yandex). Looks for a key file at the site root.
echo ""
echo "2. Checking IndexNow..."

INDEXNOW_KEY=""
if curl -s --max-time 5 "$SITE_URL/indexnow-key.txt" | grep -qE '^[a-f0-9]{32}$'; then
  INDEXNOW_KEY=$(curl -s --max-time 5 "$SITE_URL/indexnow-key.txt")
fi

if [ -n "$INDEXNOW_KEY" ]; then
  INDEXNOW_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    "https://api.indexnow.org/indexnow?url=${RSS_URL}&key=${INDEXNOW_KEY}" \
    --max-time 10 2>/dev/null || echo "FAIL")
  echo "   IndexNow ping: $INDEXNOW_STATUS"
else
  echo "   No IndexNow key found at $SITE_URL/indexnow-key.txt — skipping"
fi

echo ""
echo "=== Done ==="
echo "WebSub hub will notify all subscribers (Feedly, Flipboard, etc.)"
echo "New content should appear in aggregators within minutes."
