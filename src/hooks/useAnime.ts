import { useState, useEffect, useRef } from 'react';
import type { Anime, Episode } from '../types/anime';
import { animeService } from '../services/animeService';

export function useAnime() {
    const [topAnime, setTopAnime] = useState<Anime[]>([]);
    const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
    const [showAnimeDetails, setShowAnimeDetails] = useState(false);
    const [showWatchModal, setShowWatchModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastVisiblePage, setLastVisiblePage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [scraperSession, setScraperSession] = useState<string | null>(null);
    const [epLoading, setEpLoading] = useState(false);
    const [episodeSearchQuery, setEpisodeSearchQuery] = useState('');

    const scraperSessionCache = useRef(new Map<number, string>());
    const episodesCache = useRef(new Map<string, Episode[]>());

    // Fetch top anime
    useEffect(() => {
        const fetchTopAnime = async () => {
            setLoading(true);
            try {
                const data = await animeService.getTopAnime(currentPage);
                if (data?.data) {
                    setTopAnime(data.data);
                    setLastVisiblePage(data.pagination?.last_visible_page || 1);
                }
            } catch (err) {
                console.error('Error fetching anime:', err);
                setError('Failed to load anime');
            } finally {
                setLoading(false);
            }
        };
        fetchTopAnime();
    }, [currentPage]);

    const handleAnimeClick = async (anime: Anime) => {
        setSelectedAnime(anime);
        setShowAnimeDetails(true);

        try {
            const data = await animeService.getAnimeDetails(anime.mal_id);
            if (data?.data) {
                setSelectedAnime(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch anime details', err);
        }
    };

    const startWatching = async () => {
        if (!selectedAnime) return;

        setShowAnimeDetails(false);
        setShowWatchModal(true);
        setEpLoading(true);
        setEpisodes([]);
        setScraperSession(null);

        try {
            const resolveScraperSession = async () => {
                if (scraperSessionCache.current.has(selectedAnime.mal_id)) {
                    return scraperSessionCache.current.get(selectedAnime.mal_id)!;
                }
                const searchData = await animeService.searchScraper(selectedAnime.title);
                if (searchData?.length > 0) {
                    const session = searchData[0].session;
                    scraperSessionCache.current.set(selectedAnime.mal_id, session);
                    return session;
                }
                return null;
            };

            const session = await resolveScraperSession();
            if (session) {
                setScraperSession(session);
                if (episodesCache.current.has(session)) {
                    setEpisodes(episodesCache.current.get(session)!);
                } else {
                    const epData = await animeService.getEpisodes(session);
                    const newEpisodes = epData?.episodes || epData?.ep_details || (Array.isArray(epData) ? epData : []);
                    if (newEpisodes.length > 0) {
                        episodesCache.current.set(session, newEpisodes);
                        setEpisodes(newEpisodes);
                    }
                }
            }
        } catch (e) {
            console.error('Failed to load episodes', e);
        } finally {
            setEpLoading(false);
        }
    };

    const closeDetails = () => {
        setShowAnimeDetails(false);
        setSelectedAnime(null);
    };

    const closeWatch = () => {
        setShowWatchModal(false);
        setEpisodes([]);
        setEpisodeSearchQuery('');
    };

    const changePage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
        // State
        topAnime,
        selectedAnime,
        showAnimeDetails,
        showWatchModal,
        episodes,
        scraperSession,
        epLoading,
        episodeSearchQuery,
        loading,
        currentPage,
        lastVisiblePage,
        error,

        // Actions
        setEpisodeSearchQuery,
        handleAnimeClick,
        startWatching,
        closeDetails,
        closeWatch,
        changePage,
    };
}
