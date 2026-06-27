# Dungeon Calendar Mobile App - Clean Native Google Sign-In Build

This build keeps the Dungeon Calendar website look and features by loading `https://www.dungeoncalendar.com` in WebView, but it does **not** use Google OAuth inside the WebView.

It adds a native Google sign-in screen first, then passes the Google ID token into the WebView and signs Firebase into the website origin.

## Before building

Open `App.js` and replace:

```js
PASTE\_YOUR\_GOOGLE\_WEB\_CLIENT\_ID\_HERE
```

with your Firebase/Google Cloud **Web application OAuth Client ID**.

Do not use the Android client ID.

## Install dependencies

From the project root:

```powershell
npm install --legacy-peer-deps
```

## Build

```powershell
cd android
.\\gradlew.bat bundleRelease
```

Upload:

```text
android\\app\\build\\outputs\\bundle\\release\\app-release.aab
```

## Version

This package is set to Android `versionCode 11` and `versionName 1.0.11`.

If Google Play says version code was already used, increase both `app.json` and `android/app/build.gradle` to the next number.

