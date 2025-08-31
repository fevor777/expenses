# Android WebView Wrapper

This module wraps the existing Angular Expenses web app inside a native Android WebView.

## Project Layout
```
android-webview/
  app/
    src/main/assets/www  <-- place built Angular assets here (index.html, js, css, assets...)
```

## 1. Build Angular App
From repo root (adjust base-href if different):
```
npm run build -- --output-path docs --base-href /expenses/
```
Ensure `docs/index.html` is produced and references relative resources.

## 2. Copy Assets Into Wrapper
From repo root:
```
rm -rf android-webview/app/src/main/assets/www
mkdir -p android-webview/app/src/main/assets/www
cp -R docs/* android-webview/app/src/main/assets/www/
```

## 3. Open Android Project in Android Studio (optional)
Or build via CLI:
```
cd android-webview
./gradlew assembleDebug
```
APK will be at:
```
android-webview/app/build/outputs/apk/debug/app-debug.apk
```

## 4. Release Build (Optional)
Configure signing in `android-webview/app/build.gradle.kts` (create a signing config) then:
```
./gradlew assembleRelease
```

## 5. Routing Notes
If Angular uses PathLocationStrategy you may need `<base href="/">` and ensure asset paths resolve. Hash routing is simplest; otherwise keep existing base-href.

## 6. Debugging Tips
- Enable remote debugging: In Chrome, open `chrome://inspect` with device connected.
- Use `adb logcat` to view console logs (WebView logs may appear with tag `chromium`).

## 7. Updating App
Repeat steps 1 & 2 then rebuild the APK.

## 7.1 Gradle Wrapper Jar
If `gradle/wrapper/gradle-wrapper.jar` is missing, regenerate wrapper using a local Gradle install or download the jar matching Gradle 8.5. (Wrapper jar excluded here to keep repo lean.)

## 8. Back Button
Native back delegates to WebView history first.

## 9. Caching
Currently default cache. You can force re-load by clearing app storage or adjust `cacheMode` in `MainActivity.kt`.

## 10. Splash / Offline (Future Work)
Add a splash screen or Service Worker for offline support if needed.
