import { db } from './config';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from './config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Structure de l'objet utilisateur
const createUserObject = (data) => {
    return {
        // Informations de base
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        
        // Informations personnelles
        birthDate: data.birthDate || '',
        gender: data.gender || '',
        
        // Mensurations (optionnelles)
        measurements: {
            weight: data.weight || null,
            height: data.height || null,
            measurementSystem: data.measurementSystem || 'metric'
        },
        
        // Métadonnées
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isGoogleUser: data.isGoogleUser || false,
        
        // Préférences utilisateur (à étendre selon les besoins)
        preferences: {
            notifications: true,
            language: 'fr'
        },
        
        // Statut du compte
        accountStatus: 'active',
        profileCompleted: false
    };
};

// Ajouter un nouvel utilisateur
export const createUser = async (userData) => {
    try {
        const userObject = createUserObject(userData);
        const usersRef = collection(db, 'users');
        const docRef = await addDoc(usersRef, userObject);
        return { id: docRef.id, ...userObject };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Mettre à jour un utilisateur existant
export const updateUser = async (userId, userData) => {
    try {
        const userRef = doc(db, 'users', userId);
        const updatedData = {
            ...userData,
            updatedAt: new Date().toISOString()
        };
        await setDoc(userRef, updatedData, { merge: true });
        return { id: userId, ...updatedData };
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Récupérer un utilisateur par son ID
export const getUserById = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            return { id: userId, ...userSnap.data() };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Se connecter avec Google
export const signInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
            // Create new user document if it doesn't exist
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                isGoogleUser: true
            });
        }
        
        return user;
    } catch (error) {
        throw error;
    }
};
