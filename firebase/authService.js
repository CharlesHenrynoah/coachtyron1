import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { 
    collection, 
    query, 
    where, 
    getDocs,
    getFirestore,
    doc,
    setDoc
} from 'firebase/firestore';
import { app } from './config';

const auth = getAuth();
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

const normalizeEmail = (email) => {
    if (!email) return '';
    return email.toLowerCase().trim();
};

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

export const createUserProfile = async (userId, userData) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const userRef = doc(db, 'users', userId);
        const normalizedData = {
            ...userData,
            email: userData?.email ? normalizeEmail(userData.email) : '',
            createdAt: userData?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await setDoc(userRef, normalizedData);
        return true;
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

export const checkIfUserExists = async (email) => {
    try {
        const normalizedEmail = normalizeEmail(email);
        if (!validateEmail(normalizedEmail)) {
            throw new Error('Invalid email format');
        }

        const userRef = collection(db, 'users');
        const q = query(userRef, where('email', '==', normalizedEmail));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error('Error checking if user exists:', error);
        throw error;
    }
};

export const registerUser = async (email, password) => {
    try {
        const normalizedEmail = normalizeEmail(email);
        if (!validateEmail(normalizedEmail)) {
            throw new Error('Invalid email format');
        }

        const userExists = await checkIfUserExists(normalizedEmail);
        if (userExists) {
            throw new Error('Email already registered');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error in registerUser:', error);
        throw error;
    }
};

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        if (!result || !result.user) {
            throw new Error('Failed to get user data from Google sign-in');
        }

        const normalizedEmail = normalizeEmail(result.user.email);
        const userExists = await checkIfUserExists(normalizedEmail);
        
        if (userExists) {
            const error = new Error('Email already registered');
            error.code = 'auth/email-already-exists';
            throw error;
        }

        return result.user;
    } catch (error) {
        console.error('Error in signInWithGoogle:', error);
        // Si l'erreur vient de Firebase, la transmettre telle quelle
        if (error.code && error.code.startsWith('auth/')) {
            throw error;
        }
        // Sinon, transmettre notre erreur personnalisée
        throw new Error(error.message || 'Failed to sign in with Google');
    }
};

export const loginUser = async (email, password) => {
    try {
        const normalizedEmail = normalizeEmail(email);
        if (!validateEmail(normalizedEmail)) {
            throw new Error('Invalid email format');
        }

        const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};
