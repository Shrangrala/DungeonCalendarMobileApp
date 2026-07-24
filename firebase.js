import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyCRSwIQxC_gpic-Z4o0Rb6mPhkf1yBguGI',
  authDomain: 'dungeon-calendar-app.firebaseapp.com',
  projectId: 'dungeon-calendar-app',
  storageBucket: 'dungeon-calendar-app.firebasestorage.app',
  messagingSenderId: '1089961645011',
  appId: '1:1089961645011:web:07da2f00587b54d41e5526',
  measurementId: 'G-YRP7187GYT'
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance;
if (Platform.OS === 'web') {
  authInstance = getAuth(app);
} else {
  try {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // Auth may already be initialized during Fast Refresh.
    authInstance = getAuth(app);
  }
}

export const auth = authInstance;
export const db = getFirestore(app);
export const storage = getStorage(app);
export { onAuthStateChanged };

export async function signInToFirebaseWithGoogleIdToken(idToken) {
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

export async function signInToFirebaseWithGooglePopup() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider);
}


export async function signInWithEmailPassword(email, password) {
  return signInWithEmailAndPassword(auth, String(email || '').trim().toLowerCase(), password);
}

export async function createAccountWithEmailPassword(email, password) {
  return createUserWithEmailAndPassword(auth, String(email || '').trim().toLowerCase(), password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export default app;
