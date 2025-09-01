#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <keystore-file> [alias]" >&2
  exit 1
fi

KS_FILE="$1"
ALIAS="${2:-expenses}"

if [ -f "$KS_FILE" ]; then
  echo "File $KS_FILE already exists" >&2
  exit 1
fi

read -r -p "Store password: " STORE_PW
read -r -p "Key password (enter to reuse store password): " KEY_PW || true
KEY_PW=${KEY_PW:-$STORE_PW}

keytool -genkeypair -v -keystore "$KS_FILE" -alias "$ALIAS" -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass "$STORE_PW" -keypass "$KEY_PW" \
  -dname "CN=Expenses, OU=Dev, O=Expenses, L=City, S=State, C=US"

echo "Keystore created: $KS_FILE (alias=$ALIAS)"
cat > android-webview/signing.properties <<EOF
storeFile=$KS_FILE
storePassword=$STORE_PW
keyAlias=$ALIAS
keyPassword=$KEY_PW
EOF

echo "Created signing.properties (NOT committed)."
