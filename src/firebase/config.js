import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyAyTMjZchxr4sxxj4Y59Bw-FMiR7GYVW9U",
    authDomain: "coachtyron-1c0f4.firebaseapp.com",
    projectId: "coachtyron-1c0f4",
    storageBucket: "coachtyron-1c0f4.appspot.com",
    messagingSenderId: "471602084239",
    appId: "1:471602084239:web:2798baed67c1f55ecb33fa",
    measurementId: "G-9YD10YLX25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only if supported
let analytics = null;
isSupported().then(yes => yes && (analytics = getAnalytics(app)))
    .catch(err => console.log('Analytics not supported or blocked by CSP'));

export { analytics };
