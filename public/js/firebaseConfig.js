// Import necessary Firebase modules (DO NOT use 'default')
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Your Firebase configuration from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBYQYnIn4bG5JngjIOCH--DOvVB2tOka_4",
    authDomain: "pocketproverbs-443e6.firebaseapp.com",
    projectId: "pocketproverbs-443e6",
    storageBucket: "pocketproverbs-443e6.firebasestorage.app",
    messagingSenderId: "826760888192",
    appId: "1:826760888192:web:2833a42f016dad421dcb65",
    measurementId: "G-Y9C73KBP77"
  };

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase instances (named exports)
export { app, auth, db };
