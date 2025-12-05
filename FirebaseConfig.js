import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMmGLikCmoDRgxGBBa0T4Hbs-veRNY8zg",
  authDomain: "unplug-11ff2.firebaseapp.com",
  projectId: "unplug-11ff2",
  storageBucket: "unplug-11ff2.firebasestorage.app",
  messagingSenderId: "460589991119",
  appId: "1:460589991119:web:01ba9a175b27a936d763ba",
  measurementId: "G-NVSSGM5N26"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// This ensures the user stays logged in across page reloads
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase auth persistence set to local");
  })
  .catch((error) => {
    console.error("Failed to set persistence", error);
  });

export const db = getFirestore(app);
