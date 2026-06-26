import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const DUNGEON_CALENDAR_URL = "https://www.dungeoncalendar.com";

// Use the OAuth 2.0 WEB CLIENT ID from Firebase / Google Cloud, not the Android client ID.
const GOOGLE_WEB_CLIENT_ID = "1089961645011-3ts4dr2p473lnobgch0k5p7abk5rbeu9.apps.googleusercontent.com";

const firebaseConfig = {
  apiKey: "AIzaSyCRSwIQxC_gpic-Z4o0Rb6mPhkf1yBguGI",
  authDomain: "dungeon-calendar-app.firebaseapp.com",
  projectId: "dungeon-calendar-app",
  storageBucket: "dungeon-calendar-app.firebasestorage.app",
  messagingSenderId: "1089961645011",
  appId: "1:1089961645011:web:07da2f00587b54d41e5526",
  measurementId: "G-YRP7187GYT",
};

function buildFirebaseWebSignInScript(idToken) {
  const escapedToken = JSON.stringify(idToken);
  const escapedConfig = JSON.stringify(firebaseConfig);

  return `
    (async function dungeonCalendarMobileFirebaseSignIn() {
      try {
        if (window.__dungeonCalendarMobileGoogleInjected) return true;
        window.__dungeonCalendarMobileGoogleInjected = true;
        window.isDungeonCalendarMobileApp = true;
        window.ReactNativeWebViewApp = true;

        const firebaseConfig = ${escapedConfig};
        const idToken = ${escapedToken};

        const appModule = await import('https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js');
        const authModule = await import('https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js');

        const app = appModule.getApps().length ? appModule.getApp() : appModule.initializeApp(firebaseConfig);
        const auth = authModule.getAuth(app);
        await authModule.setPersistence(auth, authModule.browserLocalPersistence);
        const credential = authModule.GoogleAuthProvider.credential(idToken);
        await authModule.signInWithCredential(auth, credential);

        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'firebase-web-signin-success' }));
        true;
      } catch (error) {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'firebase-web-signin-error',
          message: error && error.message ? error.message : String(error)
        }));
        true;
      }
    })();
    true;
  `;
}

export default function App() {
  const webViewRef = useRef(null);
  const canGoBackRef = useRef(false);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWeb, setShowWeb] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
      forceCodeForRefreshToken: false,
    });
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return undefined;

    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (showWeb && canGoBackRef.current && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      if (showWeb) {
        setShowWeb(false);
        return true;
      }
      return false;
    });

    return () => subscription.remove();
  }, [showWeb]);

  const injectedSignInScript = useMemo(() => {
    return idToken ? buildFirebaseWebSignInScript(idToken) : "true;";
  }, [idToken]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      if (!GOOGLE_WEB_CLIENT_ID || GOOGLE_WEB_CLIENT_ID.includes("PASTE_YOUR")) {
        throw new Error("Missing Google Web Client ID in App.js.");
      }

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut().catch(() => {});
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      if (!tokens.idToken) {
        throw new Error("Google sign-in did not return an ID token.");
      }

      setIdToken(tokens.idToken);
      setShowWeb(true);
    } catch (err) {
      if (err && err.code === statusCodes.SIGN_IN_CANCELLED) {
        setError("Google sign-in was cancelled.");
      } else if (err && err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError("Google Play Services is not available or needs an update.");
      } else {
        setError(err && err.message ? err.message : "Google sign-in failed.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const continueWithoutNativeGoogle = useCallback(() => {
    setError("");
    setShowWeb(true);
  }, []);

  if (!showWeb) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.loginShell}>
          <Text style={styles.title}>Dungeon Calendar</Text>
          <Text style={styles.subtitle}>Plan campaigns, sessions, NPCs, maps, and adventures.</Text>

          <Pressable
            style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}
            onPress={signInWithGoogle}
            disabled={loading}
          >
            {loading ? <ActivityIndicator /> : <Text style={styles.googleText}>Sign in with Google</Text>}
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={continueWithoutNativeGoogle}>
            <Text style={styles.secondaryText}>Use email login instead</Text>
          </Pressable>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <Text style={styles.footerText}>Uses your same Dungeon Calendar web account.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <WebView
        ref={webViewRef}
        source={{ uri: DUNGEON_CALENDAR_URL }}
        style={styles.webview}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        cacheEnabled
        incognito={false}
        startInLoadingState
        javaScriptCanOpenWindowsAutomatically
        setSupportMultipleWindows={false}
        allowsBackForwardNavigationGestures
        mixedContentMode="compatibility"
        userAgent="Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 DungeonCalendarApp"
        injectedJavaScriptBeforeContentLoaded={`
          window.isDungeonCalendarMobileApp = true;
          window.ReactNativeWebViewApp = true;
          window.open = function(url) { if (url) window.location.href = url; return null; };
          true;
        `}
        injectedJavaScript={injectedSignInScript}
        onLoadEnd={() => {
          if (idToken && webViewRef.current) {
            webViewRef.current.injectJavaScript(injectedSignInScript);
          }
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "firebase-web-signin-error") {
              setError(data.message || "Could not pass Google login to the website.");
            }
          } catch (_) {}
        }}
        onShouldStartLoadWithRequest={() => true}
        onNavigationStateChange={(navState) => {
          canGoBackRef.current = navState.canGoBack;
        }}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  loginShell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#0f172a",
  },
  title: {
    color: "#f8fafc",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 28,
    maxWidth: 320,
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    minHeight: 52,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  googleText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    padding: 12,
  },
  secondaryText: {
    color: "#93c5fd",
    fontSize: 14,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.82,
  },
  errorText: {
    color: "#fecaca",
    marginTop: 14,
    maxWidth: 340,
    textAlign: "center",
  },
  footerText: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 28,
    textAlign: "center",
  },
  webview: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
  },
});
