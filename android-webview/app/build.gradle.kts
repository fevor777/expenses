plugins {
	id("com.android.application")
	kotlin("android")
}

import java.util.Properties

android {
	namespace = "com.example.expenseswrapper"
	compileSdk = 34

	defaultConfig {
		applicationId = "com.example.expenseswrapper"
		minSdk = 24
		targetSdk = 34
		versionCode = 2
		versionName = "1.1"
	}
	signingConfigs {
		create("release") {
			println("[signing] Evaluating release signing config...")
			// Allow configuration via environment variables OR signing.properties file (not committed)
			val envKeystorePath: String? = System.getenv("APP_KEYSTORE")?.trim()
			val envKeystorePassword: String? = System.getenv("APP_KEYSTORE_PASSWORD")?.trim()
			val envKeyAlias: String? = System.getenv("APP_KEY_ALIAS")?.trim()
			val envKeyPassword: String? = System.getenv("APP_KEY_PASSWORD")?.trim()

			var resolvedKeystorePath = envKeystorePath
			var resolvedStorePassword = envKeystorePassword
			var resolvedKeyAlias = envKeyAlias
			var resolvedKeyPassword = envKeyPassword

			// Fallback: signing.properties (keys: storeFile, storePassword, keyAlias, keyPassword)
			if (resolvedKeystorePath.isNullOrBlank() || resolvedStorePassword.isNullOrBlank() ||
				resolvedKeyAlias.isNullOrBlank() || resolvedKeyPassword.isNullOrBlank()) {
				val propsFile = rootProject.file("signing.properties").let { f -> if (f.exists()) f else rootProject.file("android-webview/signing.properties") }
				println("[signing] Looking for signing.properties at: ${'$'}{propsFile.path}")
				if (propsFile.exists()) {
					val sp = Properties()
					propsFile.inputStream().use { sp.load(it) }
					resolvedKeystorePath = (resolvedKeystorePath ?: sp.getProperty("storeFile"))?.trim()
					resolvedStorePassword = (resolvedStorePassword ?: sp.getProperty("storePassword"))?.trim()
					resolvedKeyAlias = (resolvedKeyAlias ?: sp.getProperty("keyAlias"))?.trim()
					resolvedKeyPassword = (resolvedKeyPassword ?: sp.getProperty("keyPassword"))?.trim()
				}
			}

			var ksFile: java.io.File? = null
			if (!resolvedKeystorePath.isNullOrBlank()) {
				val candidates = mutableListOf<String>()
				candidates += resolvedKeystorePath
				// If path starts with project directory name (android-webview/), add stripped version
				if (resolvedKeystorePath.startsWith("android-webview/")) {
					candidates += resolvedKeystorePath.removePrefix("android-webview/")
				}
				println("[signing] Keystore path candidates: ${'$'}candidates")
				candidates.forEach { rel ->
					if (ksFile == null) {
						val moduleRel = file(rel)
						val rootRel = rootProject.file(rel)
						ksFile = when {
							moduleRel.exists() -> moduleRel
							rootRel.exists() -> rootRel
							else -> null
						}
					}
				}
			}

			val finalKs = ksFile
			if (finalKs != null &&
				!resolvedStorePassword.isNullOrBlank() &&
				!resolvedKeyAlias.isNullOrBlank() &&
				!resolvedKeyPassword.isNullOrBlank()
			) {
				storeFile = finalKs
				storePassword = resolvedStorePassword
				this.keyAlias = resolvedKeyAlias
				this.keyPassword = resolvedKeyPassword
				println("[signing] Release build will be signed with keystore at ${finalKs.path} (alias=$resolvedKeyAlias)")
			} else {
				println("[signing] No valid signing credentials found; release APK will be unsigned. (Tried path='${resolvedKeystorePath}')")
			}
		}
	}
	buildTypes {
		release {
			isMinifyEnabled = true
			isShrinkResources = true
			val sc = signingConfigs.findByName("release")
			if (sc?.storeFile != null) {
				signingConfig = sc
			}
			proguardFiles(
				getDefaultProguardFile("proguard-android-optimize.txt"),
				"proguard-rules.pro"
			)
		}
		debug { }
	}
	compileOptions {
		sourceCompatibility = JavaVersion.VERSION_17
		targetCompatibility = JavaVersion.VERSION_17
	}
	kotlinOptions {
		jvmTarget = "17"
	}
	buildFeatures {
		buildConfig = true
	}
}

dependencies {
	implementation("androidx.core:core-ktx:1.13.1")
	implementation("androidx.appcompat:appcompat:1.7.0")
	implementation("com.google.android.material:material:1.12.0")
	// Google Sign-In for native auth bridge
	implementation("com.google.android.gms:play-services-auth:21.2.0")
}

// Expose WEB_CLIENT_ID (Firebase Web client ID) to code; provide via env WEB_CLIENT_ID or replace placeholder later
android {
	defaultConfig {
		// Load from local.properties (developer convenience) first, then env var, else placeholder
		val localProps = rootProject.file("local.properties")
		val props = Properties()
		if (localProps.exists()) {
			localProps.inputStream().use { props.load(it) }
		}
		val rawWebClientId = (props.getProperty("WEB_CLIENT_ID")
			?: System.getenv("WEB_CLIENT_ID")
			?: (project.findProperty("WEB_CLIENT_ID") as String?)
			?: "REPLACE_WITH_WEB_CLIENT_ID")
		val cleaned = rawWebClientId
			.trim()
			.removePrefix("\"").removeSuffix("\"")
			.replace("\r", " ")
			.replace("\n", " ")
			.substringBefore('#')
			.trim()
		val webClientId = cleaned
		if (webClientId.isBlank() ||
			webClientId.contains("YOUR_WEB_CLIENT_ID") ||
			webClientId.equals("REPLACE_WITH_WEB_CLIENT_ID", ignoreCase = true) ||
			!webClientId.endsWith(".apps.googleusercontent.com")) {
			throw GradleException("WEB_CLIENT_ID is not set to a valid Firebase Web Client ID. Edit local.properties: WEB_CLIENT_ID=<your_web_client_id>.apps.googleusercontent.com")
		}
		buildConfigField("String", "WEB_CLIENT_ID", "\"$webClientId\"")
	}
}
