
// TODO: Replace with your actual Firebase project configuration
// Go to your Firebase project console: Project settings > General > Your apps > Web app
// Copy the firebaseConfig object and paste it here.

import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Changed back from "@firebase/auth"
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAX4sVZuMuPvXqUiOvRbpH5dIpCq8MxB6A",
  authDomain: "logbook-loan-compass.firebaseapp.com",
  projectId: "logbook-loan-compass",
  storageBucket: "logbook-loan-compass.firebasestorage.app",
  messagingSenderId: "758673212870",
  appId: "1:758673212870:web:da5e4e85dd052800239ec7"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

export { app, auth /*, db, storage */ };
