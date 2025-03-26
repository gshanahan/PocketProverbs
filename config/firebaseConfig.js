// Import the necessary Firebase services
import firebase from 'firebase/app';
import 'firebase/auth';  // For authentication
import 'firebase/firestore';  // For Firestore

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

// Initialize Firebase only once
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = app.auth();
const db = app.firestore();

export { auth, db };
