import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAyTMjZchxr4sxxj4Y59Bw-FMiR7GYVW9U",
  authDomain: "ctyron-4f61b.firebaseapp.com",
  projectId: "ctyron-4f61b",
  storageBucket: "ctyron-4f61b.firebasestorage.app",
  messagingSenderId: "471602084239",
  appId: "1:471602084239:web:2798baed67c1f55ecb33fa",
  measurementId: "G-9YD10YLX25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, db, auth, analytics };
