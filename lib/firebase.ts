import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window === "undefined" && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  // Mock for server-side build without keys
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
} else if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn("Firebase API Key is missing. Please check your .env.local file.");
  // Provide empty/mock objects to avoid crashing at initialization, 
  // though Firebase features will fail when used.
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
} else {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
