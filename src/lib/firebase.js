// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./firebase.config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);//might do later after knowing what it does
console.log("Firebase initialized");

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);