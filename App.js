import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const DUNGEON_CALENDAR_URL = "https://www.dungeoncalendar.com";

export default function App() {
  const webViewRef = useRef(null);
  const canGoBackRef = useRef(false);
  const [loadError, setLoadError] = useState(false);

  React.useEffect(() => {
    if (Platform.OS !== "android") return undefined;

    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBackRef.current && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });

    return () => subscription.remove();
  }, []);

  if (loadError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.fallback}>
          <Text style={styles.title}>Dungeon Calendar</Text>
          <Text style={styles.message}>
            The app could not load the Dungeon Calendar website. Check your connection and try again.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setLoadError(false)}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => Linking.openURL(DUNGEON_CALENDAR_URL)}
          >
            <Text style={styles.secondaryButtonText}>Open in Browser</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
          window.open = function(url) {
            if (url) window.location.href = url;
            return null;
          };
          true;
        `}
        onShouldStartLoadWithRequest={(request) => {
          const url = request?.url || "";

          // Google blocks embedded WebView OAuth. Open Google auth in the device browser
          // instead of crashing or showing disallowed_useragent inside the app.
          if (url.includes("accounts.google.com")) {
            Linking.openURL(url);
            return false;
          }

          return true;
        }}
        onNavigationStateChange={(navState) => {
          canGoBackRef.current = navState.canGoBack;
        }}
        onError={() => setLoadError(true)}
        onHttpError={(syntheticEvent) => {
          const statusCode = syntheticEvent?.nativeEvent?.statusCode;
          if (statusCode && statusCode >= 500) setLoadError(true);
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
    backgroundColor: "#080604",
  },
  webview: {
    flex: 1,
    backgroundColor: "#080604",
  },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#080604",
  },
  fallback: {
    flex: 1,
    backgroundColor: "#080604",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#facc15",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    color: "#e5e7eb",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#991b1b",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    borderColor: "#52525b",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: "#e5e7eb",
    fontWeight: "600",
    fontSize: 15,
  },
});
