import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, onSnapshot, collection, query, orderBy, limit, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { type ReadProgress } from '../utils/storage';

interface Manga {
    mal_id: number | string;
    title: string;
    images: {
        jpg: {
            large_image_url: string;
        };
    };
}

interface Chapter {
    id: string;
    chapter: string; // "1" or "10.5"
    title?: string;
}

export function useContinueReading() {
    const { user } = useAuth();
    const [continueReadingList, setContinueReadingList] = useState<ReadProgress[]>([]);

    // Subscribe to Firestore updates
    useEffect(() => {
        if (!user) {
            setContinueReadingList([]);
            return;
        }

        const q = query(
            collection(db, 'users', user.uid, 'continueReading'),
            orderBy('lastRead', 'desc'),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => doc.data() as ReadProgress);
            setContinueReadingList(data);
        }, (error) => {
            console.error("Failed to subscribe to continue reading:", error);
        });

        return () => unsubscribe();
    }, [user]);

    const saveProgress = useCallback(async (manga: Manga, chapter: Chapter) => {
        if (!user) return; // Only save if logged in

        const progress: ReadProgress = {
            mangaId: manga.mal_id.toString(),
            chapterId: chapter.id,
            chapterNumber: chapter.chapter,
            timestamp: Date.now(),
            lastRead: Date.now(),
            mangaTitle: manga.title,
            mangaImage: manga.images.jpg.large_image_url
        };

        try {
            // Check for potential duplicates with different IDs but same title
            // This happens when switching between AniList ID and Scraper ID
            const q = query(
                collection(db, 'users', user.uid, 'continueReading'),
                where('mangaTitle', '==', manga.title)
            );

            const querySnapshot = await getDocs(q);

            // Delete any existing entries that have a different ID (duplicates)
            const deletePromises = querySnapshot.docs
                .filter(doc => doc.id !== manga.mal_id.toString())
                .map(doc => deleteDoc(doc.ref));

            if (deletePromises.length > 0) {
                await Promise.all(deletePromises);
                console.log(`[useContinueReading] Removed ${deletePromises.length} duplicate entries for "${manga.title}"`);
            }

            await setDoc(doc(db, 'users', user.uid, 'continueReading', manga.mal_id.toString()), progress);
        } catch (error) {
            console.error("Failed to save progress to Firestore:", error);
        }
    }, [user]);

    const removeFromHistory = useCallback(async (mangaId: string) => {
        if (!user) return;

        try {
            await deleteDoc(doc(db, 'users', user.uid, 'continueReading', mangaId.toString()));
        } catch (error) {
            console.error("Failed to remove from history:", error);
        }
    }, [user]);

    return {
        continueReadingList,
        saveProgress,
        removeFromHistory
    };
}
