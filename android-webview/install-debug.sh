#!/usr/bin/env bash
set -euo pipefail
SDK_ROOT="${SDK_ROOT:-$HOME/Library/Android/sdk}"
ADB="$SDK_ROOT/platform-tools/adb"
if [ ! -x "$ADB" ]; then
  echo "adb not found at $ADB" >&2
  echo "Add platform-tools: export PATH=\"$SDK_ROOT/platform-tools:$PATH\"" >&2
  exit 1
fi
APK=app/build/outputs/apk/debug/app-debug.apk
if [ ! -f "$APK" ]; then
  echo "APK $APK not found. Building..."
  ./gradlew assembleDebug >/dev/null
fi
"$ADB" install -r "$APK"
