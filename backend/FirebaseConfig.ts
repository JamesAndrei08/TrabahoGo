import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbsksUB5BXdekrnHQVqtYZa3IXkh7iYLc",
  authDomain: "trabahogo.firebaseapp.com",
  projectId: "trabahogo",
  storageBucket: "trabahogo.firebasestorage.app",
  messagingSenderId: "238489466969",
  appId: "1:238489466969:web:40c6a0fd89267ec54a1948",
  measurementId: "G-PV806M7KEN"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);