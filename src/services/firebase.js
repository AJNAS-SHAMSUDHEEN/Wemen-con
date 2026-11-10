import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyBliUoGf_DFpox-r1GmAvmWzUNwFHxwu7A",
  authDomain: "womwns-con-reg.firebaseapp.com",
  projectId: "womwns-con-reg",
  storageBucket: "womwns-con-reg.firebasestorage.app",
  messagingSenderId: "947609924712",
  appId: "1:947609924712:web:68c6f77cfcf29e15adf7dd",
  measurementId: "G-ZP8HMEZW58"
};

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics support check
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics optional fallback
  });
}
