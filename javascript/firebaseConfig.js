import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgX_PCrk4HNIJxo2y-PtTCZTwGbVO1nyI",
  authDomain: "vittodietetica.firebaseapp.com",
  projectId: "vittodietetica",
  storageBucket: "vittodietetica.firebasestorage.app",
  messagingSenderId: "30022786971",
  appId: "1:30022786971:web:f8f38bf661eece81248b3e",
  measurementId: "G-52C43KFHXF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };