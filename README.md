# Dungeon Calendar Mobile V12 Fresh

Fresh mobile-only React Native / Expo project for Dungeon Calendar.

## Important

- Package: `com.anonymous.dungeoncalendar`
- Version: `1.0.12`
- Android versionCode: `12`
- Firebase project: `dungeon-calendar-app`
- Google Web Client ID is already set in `App.js` from the current `google-services.json` client_type 3 entry.
- Main web app files were intentionally removed.
- Login/auth settings were preserved as native Google Sign-In + Firebase Auth.

## Build

From the project root:

```powershell
npm install --legacy-peer-deps
cd android
.\gradlew.bat bundleRelease
```

Upload:

```text
android\app\build\outputs\bundle\release\app-release.aab
```

## Notes

The native screens match the provided dark red/black Dungeon Calendar style. WebView fallback buttons are included so existing web app functions remain reachable while native screens are expanded.
