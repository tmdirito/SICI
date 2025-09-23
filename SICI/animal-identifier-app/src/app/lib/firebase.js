// src/app/lib/firebase.js

import { initializeApp, getApps } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Get references to the services
const functions = getFunctions(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

// This is the crucial part!
// It checks if you're running the app locally.
if (process.env.NODE_ENV === 'development') {
  console.log("Development mode: Connecting to emulators.");
  // Point the SDKs to the local emulators.
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
}

// Export the initialized services
export { app, functions, storage, firestore };