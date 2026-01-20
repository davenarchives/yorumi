export interface WatchProgress {
    animeId: string;
    episodeId: string;
    episodeNumber: number;
    timestamp: number;
    lastWatched: number;
    animeTitle: string;
    animeImage: string;
}

export interface ReadProgress {
    mangaId: string;
    chapterId: string;
    chapterNumber: string; // Chapters can be 10.5
    timestamp: number;
    lastRead: number;
    mangaTitle: string;
    mangaImage: string;
}

export interface WatchListItem {
    id: string;
    title: string;
    image: string;
    addedAt: number;
    status: 'watching' | 'completed' | 'plan_to_watch';
    score?: number;
    currentProgress?: number;
    totalCount?: number; // Episodes
    type?: string;
    genres?: string[];
    mediaStatus?: string;
    synopsis?: string;
}

export interface ReadListItem {
    id: string;
    title: string;
    image: string;
    addedAt: number;
    status: 'reading' | 'completed' | 'plan_to_read';
    score?: number;
    currentProgress?: number;
    totalCount?: number; // Chapters
    type?: string;
    genres?: string[];
    mediaStatus?: string;
    synopsis?: string;
}

const STORAGE_KEYS = {
    CONTINUE_WATCHING: 'yorumi_continue_watching',
    WATCH_LIST: 'yorumi_watch_list',
    READ_LIST: 'yorumi_read_list',
    EPISODE_HISTORY: 'yorumi_episode_history',
    CHAPTER_HISTORY: 'yorumi_chapter_history'
};

export const storage = {
    // Continue Watching
    saveProgress: (progress: Omit<WatchProgress, 'lastWatched'>) => {
        try {
            const current = storage.getContinueWatching();
            const updated = [
                { ...progress, lastWatched: Date.now() },
                ...current.filter(item => item.animeId !== progress.animeId)
            ].slice(0, 20); // Keep last 20

            localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to save progress:', error);
        }
    },

    getContinueWatching: (): WatchProgress[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CONTINUE_WATCHING);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to get continue watching:', error);
            return [];
        }
    },

    // Watch List
    addToWatchList: (item: Omit<WatchListItem, 'addedAt' | 'status'>, status: WatchListItem['status'] = 'watching') => {
        try {
            const current = storage.getWatchList();
            if (current.some(i => i.id === item.id)) return; // Already in list

            const updated = [
                { ...item, status, addedAt: Date.now() },
                ...current
            ];

            localStorage.setItem(STORAGE_KEYS.WATCH_LIST, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to add to watch list:', error);
        }
    },

    removeFromWatchList: (animeId: string) => {
        try {
            const current = storage.getWatchList();
            const updated = current.filter(item => item.id !== animeId);
            localStorage.setItem(STORAGE_KEYS.WATCH_LIST, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to remove from watch list:', error);
        }
    },

    getWatchList: (): WatchListItem[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.WATCH_LIST);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to get watch list:', error);
            return [];
        }
    },

    isInWatchList: (animeId: string): boolean => {
        const list = storage.getWatchList();
        return list.some(item => item.id === animeId);
    },

    // Read List
    addToReadList: (item: Omit<ReadListItem, 'addedAt' | 'status'>, status: ReadListItem['status'] = 'reading') => {
        try {
            const current = storage.getReadList();
            if (current.some(i => i.id === item.id)) return;

            const updated = [
                { ...item, status, addedAt: Date.now() },
                ...current
            ];

            localStorage.setItem(STORAGE_KEYS.READ_LIST, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to add to read list:', error);
        }
    },

    removeFromReadList: (mangaId: string) => {
        try {
            const current = storage.getReadList();
            const updated = current.filter(item => item.id !== mangaId);
            localStorage.setItem(STORAGE_KEYS.READ_LIST, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to remove from read list:', error);
        }
    },

    getReadList: (): ReadListItem[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.READ_LIST);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to get read list:', error);
            return [];
        }
    },

    isInReadList: (mangaId: string): boolean => {
        const list = storage.getReadList();
        return list.some(item => item.id === mangaId);
    },

    // Episode History (Watched Episodes)
    markEpisodeAsWatched: (animeId: string, episodeNumber: number) => {
        try {
            const history = storage.getEpisodeHistory();
            if (!history[animeId]) history[animeId] = [];
            if (!history[animeId].includes(episodeNumber)) {
                history[animeId].push(episodeNumber);
                localStorage.setItem(STORAGE_KEYS.EPISODE_HISTORY, JSON.stringify(history));
            }
        } catch (error) {
            console.error('Failed to mark episode as watched:', error);
        }
    },

    getEpisodeHistory: (): Record<string, number[]> => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.EPISODE_HISTORY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            return {};
        }
    },

    getWatchedEpisodes: (animeId: string): number[] => {
        const history = storage.getEpisodeHistory();
        return history[animeId] || [];
    },

    // Chapter History (Read Chapters)
    markChapterAsRead: (mangaId: string, chapterId: string) => {
        try {
            const history = storage.getChapterHistory();
            if (!history[mangaId]) history[mangaId] = [];
            if (!history[mangaId].includes(chapterId)) {
                history[mangaId].push(chapterId);
                localStorage.setItem(STORAGE_KEYS.CHAPTER_HISTORY, JSON.stringify(history));
            }
        } catch (error) {
            console.error('Failed to mark chapter as read:', error);
        }
    },

    getChapterHistory: (): Record<string, string[]> => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CHAPTER_HISTORY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            return {};
        }
    },

    getReadChapters: (mangaId: string): string[] => {
        const history = storage.getChapterHistory();
        return history[mangaId] || [];
    }
};

// Cloud Sync Helper
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const getUserRef = () => {
    const user = auth.currentUser;
    if (!user) return null;
    return doc(db, 'users', user.uid);
};

export const syncStorage = {
    // Sync Local -> Cloud
    pushToCloud: async () => {
        const userRef = getUserRef();
        if (!userRef) return;

        const watchList = storage.getWatchList();
        const readList = storage.getReadList();
        const continueWatching = storage.getContinueWatching();
        const episodeHistory = storage.getEpisodeHistory();
        const chapterHistory = storage.getChapterHistory();

        try {
            await setDoc(userRef, {
                watchList,
                readList,
                continueWatching,
                episodeHistory,
                chapterHistory,
                lastSynced: Date.now()
            }, { merge: true });
        } catch (error) {
            console.error('Failed to push to cloud:', error);
        }
    },

    // Sync Cloud -> Local (Merge)
    pullFromCloud: async () => {
        const userRef = getUserRef();
        if (!userRef) return;

        try {
            const snap = await getDoc(userRef);
            if (snap.exists()) {
                const data = snap.data();

                // Merge logic could be more complex, but for now we'll prefer Cloud if it exists, 
                // or simpler: just overwrite Local if Cloud has data, 
                // OR better: Merge sets based on IDs.

                // Simple merge for lists (Union by ID)
                if (data.watchList) {
                    const local = storage.getWatchList();
                    const merged = [...local];
                    data.watchList.forEach((cloudItem: WatchListItem) => {
                        if (!merged.some(i => i.id === cloudItem.id)) {
                            merged.push(cloudItem);
                        }
                    });
                    localStorage.setItem(STORAGE_KEYS.WATCH_LIST, JSON.stringify(merged));
                }

                if (data.readList) {
                    const local = storage.getReadList();
                    const merged = [...local];
                    data.readList.forEach((cloudItem: ReadListItem) => {
                        if (!merged.some(i => i.id === cloudItem.id)) {
                            merged.push(cloudItem);
                        }
                    });
                    localStorage.setItem(STORAGE_KEYS.READ_LIST, JSON.stringify(merged));
                }

                if (data.continueWatching) {
                    // Start simplified: Overwrite local with cloud if cloud is newer? 
                    // Let's just merge and slice.
                    const local = storage.getContinueWatching();
                    const merged = [...data.continueWatching, ...local]
                        .filter((v, i, a) => a.findIndex(t => t.animeId === v.animeId) === i) // Unique by ID
                        .slice(0, 20);
                    localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify(merged));
                }

                // Merge Episode History
                if (data.episodeHistory) {
                    const local = storage.getEpisodeHistory();
                    const merged: Record<string, number[]> = { ...local };
                    Object.entries(data.episodeHistory as Record<string, number[]>).forEach(([animeId, episodes]) => {
                        if (!merged[animeId]) merged[animeId] = [];
                        episodes.forEach(ep => {
                            if (!merged[animeId].includes(ep)) merged[animeId].push(ep);
                        });
                    });
                    localStorage.setItem(STORAGE_KEYS.EPISODE_HISTORY, JSON.stringify(merged));
                }

                // Merge Chapter History
                if (data.chapterHistory) {
                    const local = storage.getChapterHistory();
                    const merged: Record<string, string[]> = { ...local };
                    Object.entries(data.chapterHistory as Record<string, string[]>).forEach(([mangaId, chapters]) => {
                        if (!merged[mangaId]) merged[mangaId] = [];
                        chapters.forEach(ch => {
                            if (!merged[mangaId].includes(ch)) merged[mangaId].push(ch);
                        });
                    });
                    localStorage.setItem(STORAGE_KEYS.CHAPTER_HISTORY, JSON.stringify(merged));
                }
            }
        } catch (error) {
            console.error('Failed to pull from cloud:', error);
        }
    }
};

// Hook into storage methods to auto-sync
const originalSaveProgress = storage.saveProgress;
storage.saveProgress = (progress) => {
    originalSaveProgress(progress);
    if (auth.currentUser) syncStorage.pushToCloud();
};

const originalAddToWatchList = storage.addToWatchList;
storage.addToWatchList = (item, status) => {
    originalAddToWatchList(item, status);
    if (auth.currentUser) syncStorage.pushToCloud();
};

const originalRemoveFromWatchList = storage.removeFromWatchList;
storage.removeFromWatchList = (id) => {
    originalRemoveFromWatchList(id);
    if (auth.currentUser) syncStorage.pushToCloud();
};

const originalAddToReadList = storage.addToReadList;
storage.addToReadList = (item, status) => {
    originalAddToReadList(item, status);
    if (auth.currentUser) syncStorage.pushToCloud();
};

const originalRemoveFromReadList = storage.removeFromReadList;
storage.removeFromReadList = (id) => {
    originalRemoveFromReadList(id);
    if (auth.currentUser) syncStorage.pushToCloud();
};

const originalMarkEpisodeAsWatched = storage.markEpisodeAsWatched;
storage.markEpisodeAsWatched = (animeId, episodeNumber) => {
    originalMarkEpisodeAsWatched(animeId, episodeNumber);
    if (auth.currentUser) syncStorage.pushToCloud();
};

const originalMarkChapterAsRead = storage.markChapterAsRead;
storage.markChapterAsRead = (mangaId, chapterId) => {
    originalMarkChapterAsRead(mangaId, chapterId);
    if (auth.currentUser) syncStorage.pushToCloud();
};
