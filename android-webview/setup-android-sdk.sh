#!/usr/bin/env bash
set -euo pipefail

# Configuration
SDK_ROOT="$HOME/Library/Android/sdk"
CASK_NAME="android-commandlinetools"

echo "[1] Ensuring base SDK directory: $SDK_ROOT"
mkdir -p "$SDK_ROOT/cmdline-tools"

if ! brew list --cask | grep -q "^${CASK_NAME}$"; then
  echo "[2] Installing command line tools via Homebrew cask..."
  brew install --cask ${CASK_NAME}
else
  echo "[2] Command line tools cask already installed."
fi

# Locate latest downloaded command line tools (Homebrew keeps versions under Caskroom)
CASK_DIR="/opt/homebrew/Caskroom/${CASK_NAME}"
LATEST_DIR=$(ls -1d "$CASK_DIR"/*/ 2>/dev/null | sort -V | tail -n1 || true)
if [ -z "$LATEST_DIR" ]; then
  echo "Could not locate installed command line tools in $CASK_DIR" >&2
  exit 1
fi

# Copy only once if 'latest' not populated with bin
if [ ! -x "$SDK_ROOT/cmdline-tools/latest/bin/sdkmanager" ]; then
  echo "[3] Populating cmdline-tools/latest from $LATEST_DIR"
  mkdir -p "$SDK_ROOT/cmdline-tools/latest"
  cp -R "$LATEST_DIR"/* "$SDK_ROOT/cmdline-tools/latest/"
else
  echo "[3] cmdline-tools/latest already present."
fi

SDKMANAGER="$SDK_ROOT/cmdline-tools/latest/bin/sdkmanager"
if [ ! -x "$SDKMANAGER" ]; then
  # Homebrew copy ended up nested (latest/cmdline-tools/bin)
  if [ -x "$SDK_ROOT/cmdline-tools/latest/cmdline-tools/bin/sdkmanager" ]; then
    SDKMANAGER="$SDK_ROOT/cmdline-tools/latest/cmdline-tools/bin/sdkmanager"
  fi
fi
if [ ! -x "$SDKMANAGER" ]; then
  echo "sdkmanager not found (checked $SDK_ROOT/cmdline-tools/latest[/cmdline-tools]/bin)" >&2
  exit 1
fi

echo "[4] Accepting licenses..."
yes | "$SDKMANAGER" --licenses > /dev/null || true

echo "[5] Installing required platform + build tools..."
"$SDKMANAGER" \
  "platform-tools" \
  "platforms;android-34" \
  "build-tools;34.0.0" \
  "sources;android-34"

echo "[6] Writing local.properties..."
cat > local.properties <<EOF
sdk.dir=$SDK_ROOT
EOF

echo "[7] Done. Now you can run: ./gradlew assembleDebug"
