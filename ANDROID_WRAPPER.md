# Android WebView Wrapper (Option 3)

This implements the "Point 3" approach: a **very lightweight Android wrapper** that ships your existing Angular build (in `docs/`) inside a native WebView. No Capacitor plugins or PWA requirements—just a container.

## When to use
Use this if you only need a Play Store presence and basic WebView hosting (no deep native integrations, push, background sync, etc.). If later you need native APIs, migrate to Capacitor (Option 1).

---
## Project Layout (proposed)
```
android-webview/
  settings.gradle.kts
  build.gradle.kts            (root build script)
  gradle.properties
  /app
    /src/main
      AndroidManifest.xml
      /java/com/example/expenseswrapper/MainActivity.kt
      /res/layout/activity_main.xml
      /assets/www/            <-- copy your built web app here
        index.html
        main-*.js
        styles-*.css
        ... (all files from /docs after ng build)
```

You can keep this outside the Angular `src/` tree to avoid polluting the web app.

---
## 1. Generate / Update Web Build
Your Angular build output already goes to `docs/`. Ensure a fresh production build:
```
npm run build
```
This updates all hashed assets in `docs/`.

---
## 2. Create Android Wrapper
Create a new folder `android-webview` at the repo root (NOT inside `src/`). Below are the minimal files.

### settings.gradle.kts
```kotlin
rootProject.name = "ExpensesWrapper"
include(":app")
```

### build.gradle.kts (root)
```kotlin
plugins {
    id("com.android.application") version "8.2.2" apply false
    kotlin("android") version "1.9.10" apply false
}
```

### gradle.properties
```properties
org.gradle.jvmargs=-Xmx2g -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
```

### /app/build.gradle.kts
```kotlin
plugins {
    id("com.android.application")
    kotlin("android")
}

android {
    namespace = "com.example.expenseswrapper"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.expenseswrapper"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
}
```

### /app/src/main/AndroidManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <application
      android:allowBackup="false"
      android:label="Expenses"
      android:usesCleartextTraffic="false"
      android:theme="@style/Theme.AppCompat.Light.NoActionBar">
      <activity android:name=".MainActivity"
          android:exported="true"
          android:configChanges="keyboardHidden|orientation|screenSize"
          android:screenOrientation="portrait">
          <intent-filter>
              <action android:name="android.intent.action.MAIN" />
              <category android:name="android.intent.category.LAUNCHER" />
          </intent-filter>
      </activity>
  </application>
</manifest>
```

### /app/src/main/res/layout/activity_main.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</FrameLayout>
```

### /app/src/main/java/com/example/expenseswrapper/MainActivity.kt
```kotlin
package com.example.expenseswrapper

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val webView = findViewById<WebView>(R.id.webview)
        with(webView.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
        }
        webView.webViewClient = object : WebViewClient() {}
        webView.webChromeClient = WebChromeClient()
        // Load local bundled assets (after copying /docs -> /assets/www)
        webView.loadUrl("file:///android_asset/www/index.html")
    }

    override fun onBackPressed() {
        val webView = findViewById<WebView>(R.id.webview)
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }
}
```

### proguard-rules.pro (optional)
```pro
# Keep WebView JS interfaces if you add any later
```

---
## 3. Copy Web Assets
After each web build:
```
rm -rf android-webview/app/src/main/assets/www
mkdir -p android-webview/app/src/main/assets/www
cp -R docs/* android-webview/app/src/main/assets/www/
```
(Adjust path if you rename the folder.)

---
## 4. Run / Build
Open `android-webview` in Android Studio, let Gradle sync, then Run.

Release build: Build > Generate Signed Bundle / APK (AAB recommended for Play Store).

---
## 5. Handling Routing
Because Angular uses PathLocationStrategy, relative asset loads should resolve. If you see 404 inside WebView after navigation/deep linking, you can force hash routing or intercept shouldOverrideUrlLoading to map routes back to index.html:
```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
  // ... existing setup
  webView.webViewClient = object : WebViewClient() {
    override fun shouldOverrideUrlLoading(v: WebView, req: android.webkit.WebResourceRequest): Boolean {
      v.loadUrl(req.url.toString())
      return false
    }
  }
}
```
If still problematic, switch Angular to hash strategy:
```ts
providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
```
(Do this only for the WebView build, if desired.)

---
## 6. Splash / Icon
Replace default app icon under `app/src/main/res/mipmap-*`. For a splash, create a normal Android launch theme or show a simple layout first while WebView loads.

---
## 7. Offline & Caching
WebView will load local `file:///` content instantly. If you want remote updates without shipping a new APK, consider:
1. Host the app at a URL and load that URL instead of local file.
2. Implement update check + asset download (more complex).

---
## 8. Security Notes
- Avoid enabling `setAllowFileAccessFromFileURLs` if not required (remove if no dynamic local file access needed).
- Disable remote debugging for release: `WebView.setWebContentsDebuggingEnabled(false)`.
- Consider CSP meta tags in `index.html` for tighter security.

---
## 9. Optional: Environment Toggle
Add a simple build flag to switch between local bundle and remote URL:
```kotlin
val useRemote = false
val remoteUrl = "https://fevor777.github.io/expenses/"
if (useRemote) webView.loadUrl(remoteUrl) else webView.loadUrl("file:///android_asset/www/index.html")
```

---
## 10. Summary
You now have a minimal Android container for the existing Angular app without pulling in Capacitor. Migrate to Capacitor later if you need native APIs beyond WebView.

Let me know if you want this scaffold auto-generated into the repo or prefer a script to sync assets.
