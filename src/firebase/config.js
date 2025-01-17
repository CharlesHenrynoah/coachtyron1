import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Disable analytics for now due to third-party cookie restrictions
export const analytics = null;

// Optional: Initialize analytics only if explicitly needed in the future
export const initializeAnalytics = async () => {
    if (typeof window !== 'undefined' && process.env.REACT_APP_ENABLE_ANALYTICS === 'true') {
        try {
            const { getAnalytics, isSupported } = await import('firebase/analytics');
            const analyticsSupported = await isSupported();
            
            if (analyticsSupported) {
                return getAnalytics(app);
            }
        } catch (error) {
            console.warn('Analytics initialization skipped:', error.message);
        }
    }
    return null;
};
