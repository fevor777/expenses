#!/usr/bin/env bash
# Sets Android signing environment variables for the wrapper app.
# Usage: source ./scripts/set-signing-env.sh
# NOTE: Storing real passwords in a committed script is insecure. Consider:
#   1. Copying this file to set-signing-env.local.sh (git-ignored) and edit there.
#   2. Or removing the hard‑coded passwords and prompting instead.

# --- Configuration (edit as needed) ---
export APP_KEYSTORE="${APP_KEYSTORE:-$HOME/keys/expenses-release.keystore}"
export APP_KEYSTORE_PASSWORD="${APP_KEYSTORE_PASSWORD:-123456}"
export APP_KEY_ALIAS="${APP_KEY_ALIAS:-expenses}"
export APP_KEY_PASSWORD="${APP_KEY_PASSWORD:-123456}"

echo "APP_KEYSTORE=$APP_KEYSTORE"
echo "APP_KEY_ALIAS=$APP_KEY_ALIAS"

if [ ! -f "$APP_KEYSTORE" ]; then
  echo "Keystore file not found: $APP_KEYSTORE" >&2
  echo "Create one with: keytool -genkeypair -v -storetype PKCS12 -keystore $APP_KEYSTORE -alias $APP_KEY_ALIAS -keyalg RSA -keysize 4096 -validity 3650" >&2
else
  ls -l "$APP_KEYSTORE"
fi

echo "Signing environment variables exported. Remember to run:  ./gradlew :app:assembleRelease"
