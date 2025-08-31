# Release Build Guide

## 1. Generate a Keystore
Choose a secure password and alias (example uses `expenses`):
```
keytool -genkeypair -v \
  -keystore release.keystore \
  -alias expenses \
  -keyalg RSA -keysize 2048 -validity 3650
```
Move the file somewhere **outside** the repo or keep it untracked.

## 2. Export Environment Variables (recommended)
```
export APP_KEYSTORE=/absolute/path/to/release.keystore
export APP_KEYSTORE_PASSWORD=yourKeystorePass
export APP_KEY_ALIAS=expenses
export APP_KEY_PASSWORD=yourKeyPass
```
Add those to your shell profile for reuse.

## 3. Build Release APK
```
cd android-webview
./gradlew assembleRelease
```
Output: `app/build/outputs/apk/release/app-release.apk`

## 4. Build App Bundle (Play Store)
```
./gradlew bundleRelease
```
Output: `app/build/outputs/bundle/release/app-release.aab`

## 5. Verify Signature
```
jarsigner -verify -verbose -certs app/build/outputs/apk/release/app-release.apk
```

## 6. Align & Sign (Gradle already signs if env vars provided)
If unsigned: use `zipalign` and `apksigner` from build-tools.

## 7. Increment Version
Edit `versionCode` / `versionName` in `app/build.gradle.kts` for each release.

## 8. Testing Checklist
- Launch cold / warm
- WebView content loads offline
- Back button works
- No cleartext HTTP unless allowed

## 9. Troubleshooting
If signingConfig is null, ensure env variables point to existing keystore path.
