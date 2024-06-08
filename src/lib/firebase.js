// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = { 
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "chat-585e7.firebaseapp.com",
    projectId: "chat-585e7",
    storageBucket: "chat-585e7.appspot.com",
    messagingSenderId: "105337395972",
    appId: "1:105337395972:web:07c810c21fc2fcd758ce51",
    measurementId: "G-8JS4R3CGMB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);//might do later after knowing what it does
console.log("Firebase initialized");

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);