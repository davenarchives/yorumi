import { useState } from 'react';
import type { Anime } from '../types/anime';
import type { Manga } from '../types/manga';
import { animeService } from '../services/animeService';
import { mangaService } from '../services/mangaService';

export function useSearch(activeTab: 'anime' | 'manga') {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<(Anime | Manga)[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearchLoading(true);
        setIsSearching(true);

        try {
            if (activeTab === 'anime') {
                const data = await animeService.searchAnime(searchQuery);
                setSearchResults(data?.data || []);
            } else {
                const data = await mangaService.searchManga(searchQuery);
                setSearchResults(data?.data || []);
            }
        } catch (err) {
            console.error('Search failed:', err);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearching(false);
    };

    return {
        searchQuery,
        searchResults,
        isSearching,
        searchLoading,
        setSearchQuery,
        handleSearch,
        clearSearch,
    };
}
