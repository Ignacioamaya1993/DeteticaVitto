// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgX_PCrk4HNIJxo2y-PtTCZTwGbVO1nyI",
  authDomain: "vittodietetica.firebaseapp.com",
  projectId: "vittodietetica",
  storageBucket: "vittodietetica.firebasestorage.app",
  messagingSenderId: "30022786971",
  appId: "1:30022786971:web:f8f38bf661eece81248b3e",
  measurementId: "G-52C43KFHXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);