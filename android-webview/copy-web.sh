#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT_DIR/docs"
ASSETS_DIR="$ROOT_DIR/android-webview/app/src/main/assets/www"

if [ ! -d "$WEB_DIR" ]; then
  echo "Web build directory '$WEB_DIR' not found. Run Angular build first." >&2
  exit 1
fi

rm -rf "$ASSETS_DIR"
mkdir -p "$ASSETS_DIR"
cp -R "$WEB_DIR"/* "$ASSETS_DIR"/

# If Angular output nested into browser/ move its contents up so index.html at root
if [ -d "$ASSETS_DIR/browser" ]; then
  shopt -s dotglob nullglob
  mv "$ASSETS_DIR/browser"/* "$ASSETS_DIR"/
  rmdir "$ASSETS_DIR/browser"
  shopt -u dotglob nullglob
fi

echo "Copied web assets to $ASSETS_DIR (index at $( [ -f "$ASSETS_DIR/index.html" ] && echo ok || echo MISSING ))"

# Force relative base href for WebView (in case build used production baseHref)
if grep -q '<base href="/expenses/"' "$ASSETS_DIR/index.html"; then
  sed -i '' 's|<base href="/expenses/"|<base href="./"|' "$ASSETS_DIR/index.html" || true
  echo "Rewrote base href to ./ for WebView"
fi
