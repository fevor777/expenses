# Keep Google Sign-In classes
-keep class com.google.android.gms.auth.api.signin.** { *; }
-keep class com.google.android.gms.common.api.** { *; }
-keepclassmembers class * extends java.security.Provider { *; }

# Keep JS interface methods
-keepclassmembers class com.example.expenseswrapper.MainActivity$NativeAuthInterface { *; }
# Keep WebView JS interfaces if you add any later
