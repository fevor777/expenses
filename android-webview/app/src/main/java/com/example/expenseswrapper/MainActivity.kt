package com.example.expenseswrapper

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.ConsoleMessage
import android.content.pm.PackageManager
import java.security.MessageDigest
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task

class MainActivity : AppCompatActivity() {
    companion object {
        private const val RC_SIGN_IN = 9001
    }
    private lateinit var webView: WebView
    private lateinit var googleClient: GoogleSignInClient

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    Log.d("WEBVIEW", "MainActivity start")
        setContentView(R.layout.activity_main)
        webView = findViewById(R.id.webview)
    WebView.setWebContentsDebuggingEnabled(true)
    val settings = webView.settings
    with(settings) {
        javaScriptEnabled = true
        domStorageEnabled = true
        cacheMode = WebSettings.LOAD_DEFAULT
        allowFileAccessFromFileURLs = true
        allowUniversalAccessFromFileURLs = true
        databaseEnabled = true
    }
    Log.d("WEBVIEW", "UserAgent=" + settings.userAgentString)
    webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                Log.d("WEBVIEW", "Loaded: $url")
            }
            override fun onReceivedError(
                view: WebView?, request: WebResourceRequest?, error: WebResourceError?
            ) {
                val urlStr = request?.url?.toString()
                Log.e("WEBVIEW", "Error: ${error?.description} url=$urlStr")
                if (urlStr != null && urlStr.startsWith("file:///android_asset/www/#/")) {
                    val hash = urlStr.substringAfter("www/") // starts with #/...
                    val fixed = "file:///android_asset/www/index.html" + hash
                    Log.d("WEBVIEW", "Recover 404 hash -> $fixed")
                    view?.post { view.loadUrl(fixed) }
                } else if (urlStr != null && urlStr == "file:///android_asset/www/#") {
                    // Bare hash (#) -> index.html
                    val fixed = "file:///android_asset/www/index.html#"
                    Log.d("WEBVIEW", "Recover bare hash -> $fixed")
                    view?.post { view.loadUrl(fixed) }
                }
            }
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val u = request?.url?.toString() ?: return false
                Log.d("WEBVIEW", "Intercept nav: $u")
                if (u.startsWith("file:///android_asset/www/#")) {
                    val fragment = u.substringAfter('#')
                    val js = if (fragment.isNotEmpty()) {
                        "(function(){ if(window.location.hash!== '#$fragment'){ window.location.hash ='#$fragment'; } })();"
                    } else {
                        "(function(){ if(window.location.hash!== '#'){ window.location.hash ='#'; } })();"
                    }
                    view?.evaluateJavascript(js, null)
                    Log.d("WEBVIEW", "Update hash -> #$fragment")
                    return true // Prevent file load
                }
                return false
            }
        }
        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                // Forward JS console messages to logcat so you can see them while debugging
                val level = consoleMessage.messageLevel()
                val tag = "JS" // separate tag for filtering
                val msg = "${'$'}level ${consoleMessage.sourceId()}:${consoleMessage.lineNumber()} ${consoleMessage.message()}"
                when (level) {
                    ConsoleMessage.MessageLevel.ERROR -> Log.e(tag, msg)
                    ConsoleMessage.MessageLevel.WARNING -> Log.w(tag, msg)
                    else -> Log.d(tag, msg)
                }
                return super.onConsoleMessage(consoleMessage)
            }
        }
        // Load local bundled assets (after copying /docs -> /assets/www)
    // Add native auth JS interface
    webView.addJavascriptInterface(NativeAuthInterface(), "NativeAuth")

    initGoogleClient()

    Log.d("WEBVIEW", "Load index.html")
    webView.loadUrl("file:///android_asset/www/index.html")
    }

    override fun onBackPressed() {
        val wv = webView
        if (wv.canGoBack()) wv.goBack() else super.onBackPressed()
    }

    private fun initGoogleClient() {
        val clientId = BuildConfig.WEB_CLIENT_ID
        Log.d("WEBVIEW", "Init Google client with WEB_CLIENT_ID=$clientId")
    logSigningSha1()
        val gsoBuilder = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
        if (clientId != "REPLACE_WITH_WEB_CLIENT_ID") {
            gsoBuilder.requestIdToken(clientId)
        } else {
            Log.w("WEBVIEW", "WEB_CLIENT_ID not set; idToken will not be requested")
        }
        googleClient = GoogleSignIn.getClient(this, gsoBuilder.build())
        // Attempt silent sign-in first to reuse existing session
        googleClient.silentSignIn().addOnCompleteListener { task ->
            if (task.isSuccessful) {
                val acct = task.result
                val idToken = acct?.idToken
                Log.d("WEBVIEW", "Silent sign-in success token=${idToken?.take(10)}...")
                if (idToken != null) {
                    val safe = idToken.replace("'", "\\'")
                    val js = "window.onNativeGoogleIdToken && window.onNativeGoogleIdToken('" + safe + "');"
                    webView.post { webView.evaluateJavascript(js, null) }
                }
            } else {
                val ex = task.exception
                if (ex != null) Log.d("WEBVIEW", "Silent sign-in not available: ${'$'}{ex.message}")
            }
        }
    }

    private fun logSigningSha1() {
        try {
            val pm = packageManager
            val pkgInfo = pm.getPackageInfo(packageName, PackageManager.GET_SIGNING_CERTIFICATES)
            val signers = pkgInfo.signingInfo.apkContentsSigners
            val md = MessageDigest.getInstance("SHA1")
            signers.forEach { sig ->
                val sha1 = md.digest(sig.toByteArray()).joinToString(":") { b -> "%02X".format(b) }
                Log.d("WEBVIEW", "App signing cert SHA1=$sha1 (compare to one configured in Google Cloud)")
            }
        } catch (e: Exception) {
            Log.w("WEBVIEW", "Unable to compute signing SHA1: ${e.message}")
        }
    }

    inner class NativeAuthInterface {
        @JavascriptInterface
        fun requestGoogleSignIn() {
            runOnUiThread {
                val intent = googleClient.signInIntent
                startActivityForResult(intent, RC_SIGN_IN)
            }
        }
        @JavascriptInterface
        fun signOut() {
            googleClient.signOut()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == RC_SIGN_IN) {
            val task: Task<GoogleSignInAccount> = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(ApiException::class.java)
                val idToken = account.idToken
                Log.d("WEBVIEW", "Google sign-in success; token=" + (idToken?.take(10) ?: "<null>") + "...")
                if (idToken != null) {
                    val safe = idToken.replace("'", "\\'")
                    val js = "window.onNativeGoogleIdToken && window.onNativeGoogleIdToken('" + safe + "');"
                    webView.post { webView.evaluateJavascript(js, null) }
                } else {
                    Log.w("WEBVIEW", "Google account returned null idToken. Ensure WEB_CLIENT_ID is the Firebase Web client ID (OAuth 2.0 client) and not commented.")
                }
            } catch (e: ApiException) {
                Log.e("WEBVIEW", "Google sign-in failed code=${e.statusCode} msg=${e.message}", e)
                if (e.statusCode == 10) {
                    Log.e("WEBVIEW", "DEVELOPER_ERROR (10). Check: 1) WEB_CLIENT_ID actual value='" + BuildConfig.WEB_CLIENT_ID + "' 2) Android SHA-1 added to Firebase project & Google Cloud OAuth client 3) Using debug keystore SHA-1 if this is a debug build 4) No comments in WEB_CLIENT_ID line in local.properties.")
                }
            }
        }
    }
}
