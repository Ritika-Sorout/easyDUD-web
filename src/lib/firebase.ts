import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFunctions, type Functions, connectFunctionsEmulator } from "firebase/functions";

/**
 * Firebase client (browser) configuration.
 * Values come from VITE_* env vars (safe to expose — these are public client
 * keys). The RAZORPAY_KEY_SECRET is NEVER read here; it lives only inside the
 * Firebase Functions runtime via defineSecret().
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

/** True only when the minimum required client config is present. */
export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

const NOT_CONFIGURED_MESSAGE =
  "Firebase is not configured. Add the VITE_FIREBASE_* environment variables (see .env.example) and restart the dev server.";

let cachedApp: FirebaseApp | undefined;

/** Lazily initialise the Firebase app — only when actually needed (in handlers). */
export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(NOT_CONFIGURED_MESSAGE);
  }
  if (!cachedApp) {
    cachedApp = getApps().length
      ? getApp()
      : initializeApp(firebaseConfig as Record<string, string>);
  }
  return cachedApp;
}

export function getDb(): Firestore {
  const db = getFirestore(getFirebaseApp());
  // Connect to emulator in development only
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === "true") {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
  return db;
}

export function getBucket(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}

export function getFns(): Functions {
  const functions = getFunctions(getFirebaseApp());
  // Connect to emulator in development only
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === "true") {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  }
  return functions;
}
