#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="$ROOT_DIR/android-webview"
WEB_DIR="$ROOT_DIR/docs"
APK_DIR="$APP_DIR/app/build/outputs/apk/release"
KS_FILE="${APP_KEYSTORE:-}"
KS_PASS="${APP_KEYSTORE_PASSWORD:-}"
KS_ALIAS="${APP_KEY_ALIAS:-}"
KS_KEY_PASS="${APP_KEY_PASSWORD:-}" 

if [ ! -d "$WEB_DIR" ]; then
  echo "Web build dir missing. Run: npm run build -- --base-href ./ --output-path docs" >&2
  exit 1
fi

# Copy web assets
bash "$APP_DIR/copy-web.sh"

# Build release (may be unsigned if no env vars)
cd "$APP_DIR"
./gradlew assembleRelease --quiet

APK_UNSIGNED="$APK_DIR/app-release-unsigned.apk"
if [ ! -f "$APK_UNSIGNED" ]; then
  echo "Unsigned release APK not found at $APK_UNSIGNED" >&2
  exit 1
fi

# Sign if keystore provided, else sign with debug keystore for convenience
SIGNED_APK="$APK_DIR/app-release-signed.apk"
BT_DIR=$(ls -d "$HOME/Library/Android/sdk/build-tools"/* | sort -V | tail -n 1)
APK_SIGNER="$BT_DIR/apksigner"

if [ -n "$KS_FILE" ] && [ -f "$KS_FILE" ] && [ -n "$KS_PASS" ] && [ -n "$KS_ALIAS" ] && [ -n "$KS_KEY_PASS" ]; then
  echo "Signing with provided release keystore $KS_FILE"
  "$APK_SIGNER" sign \
    --ks "$KS_FILE" \
    --ks-pass pass:"$KS_PASS" \
    --ks-key-alias "$KS_ALIAS" \
    --key-pass pass:"$KS_KEY_PASS" \
    --out "$SIGNED_APK" \
    "$APK_UNSIGNED"
else
  DEBUG_KS="$HOME/.android/debug.keystore"
  if [ -f "$DEBUG_KS" ]; then
    echo "Release keystore not provided; signing with debug keystore (NOT for production)."
    "$APK_SIGNER" sign \
      --ks "$DEBUG_KS" \
      --ks-key-alias androiddebugkey \
      --ks-pass pass:android \
      --key-pass pass:android \
      --out "$SIGNED_APK" \
      "$APK_UNSIGNED"
  else
    echo "No keystore available; leaving unsigned." >&2
    SIGNED_APK="$APK_UNSIGNED"
  fi
fi

"$APK_SIGNER" verify --verbose "$SIGNED_APK" || true

echo "Final APK: $SIGNED_APK"
