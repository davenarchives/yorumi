import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, signInWithPopup, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../services/firebase';
import { getDeterministicAvatar } from '../utils/avatars';
import { syncStorage } from '../utils/storage';

interface AuthContextType {
    user: User | null;
    avatar: string | null;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    updateName: (name: string) => Promise<void>;
    updateAvatar: (path: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserAvatar = async (uid: string) => {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data().avatar as string;
            }
        } catch (error) {
            console.error('Failed to fetch user avatar from Firestore:', error);
        }
        return null;
    };

    const saveUserAvatar = async (uid: string, newAvatar: string) => {
        try {
            const docRef = doc(db, 'users', uid);
            await setDoc(docRef, { avatar: newAvatar }, { merge: true });
        } catch (error) {
            console.error('Failed to save user avatar to Firestore:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Sync data from cloud
                try {
                    await syncStorage.pullFromCloud();
                } catch (e) {
                    console.error("Failed to sync on login", e);
                }

                // 1. Optimistically load from LocalStorage for instant UI (No "D" flash)
                const storedAvatar = localStorage.getItem(`avatar_${currentUser.uid}`);
                if (storedAvatar) {
                    setAvatar(storedAvatar);
                }

                // 2. Fetch from Backend (Source of Truth - Firestore) and update if different
                const dbAvatar = await fetchUserAvatar(currentUser.uid);

                if (dbAvatar) {
                    if (dbAvatar !== storedAvatar) {
                        setAvatar(dbAvatar);
                        localStorage.setItem(`avatar_${currentUser.uid}`, dbAvatar);
                    }
                } else {
                    // 3. If no DB avatar but we have local, sync local to DB
                    if (storedAvatar) {
                        saveUserAvatar(currentUser.uid, storedAvatar);
                    } else {
                        // 4. If neither, generate new random (deterministic based on UID)
                        const newAvatar = getDeterministicAvatar(currentUser.uid);
                        setAvatar(newAvatar);
                        saveUserAvatar(currentUser.uid, newAvatar);
                        localStorage.setItem(`avatar_${currentUser.uid}`, newAvatar);
                    }
                }
            } else {
                setAvatar(null);
            }

            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setAvatar(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const updateName = async (name: string) => {
        if (auth.currentUser) {
            try {
                await updateProfile(auth.currentUser, { displayName: name });
                setUser({ ...auth.currentUser, displayName: name });
            } catch (error) {
                console.error("Failed to update name", error);
                throw error;
            }
        }
    };

    const updateAvatar = async (newAvatarPath: string) => {
        setAvatar(newAvatarPath);

        if (auth.currentUser) {
            // Save to DB
            await saveUserAvatar(auth.currentUser.uid, newAvatarPath);
            // Keep legacy sync for now
            localStorage.setItem(`avatar_${auth.currentUser.uid}`, newAvatarPath);
        }
    };

    return (
        <AuthContext.Provider value={{ user, avatar, isLoading, login, logout, updateName, updateAvatar }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
