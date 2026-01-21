import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAnime } from '../../../hooks/useAnime';
import { useStreams } from '../../../hooks/useStreams';
import type { Anime, Episode } from '../../../types/anime';

export function usePlayer(animeId: string | undefined) {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    // 1. Anime Data
    const animeHook = useAnime();
    const {
        selectedAnime,
        episodes,
        epLoading,
        scraperSession,
        error,
        saveProgress,
        watchedEpisodes,
        markEpisodeComplete,
        handleAnimeClick
    } = animeHook;

    // 2. Stream Data
    const streamsHook = useStreams(scraperSession);
    const {
        currentStream,
        streamLoading,
        currentEpisode,
        streams,
        isAutoQuality,
        selectedStreamIndex,
        showQualityMenu,
        setShowQualityMenu,
        handleQualityChange,
        setAutoQuality,
        clearStreams,
        loadStream
    } = streamsHook;

    // 3. UI State
    const [isExpanded, setIsExpanded] = useState(false);
    const epNumParam = searchParams.get('ep') || '1';

    // --- Effects ---

    // Clear streams on mount/id change
    useEffect(() => {
        clearStreams();
    }, [animeId]);

    // Fetch Anime if missing
    useEffect(() => {
        // Prevent re-fetching if we already have the correct anime loaded
        if (selectedAnime && (String(selectedAnime.id) === String(animeId) || String(selectedAnime.mal_id) === String(animeId))) {
            return;
        }

        if (location.state?.anime) {
            handleAnimeClick(location.state.anime);
        } else if (animeId) {
            const ids = isNaN(Number(animeId)) ? animeId : parseInt(animeId);
            handleAnimeClick({ mal_id: ids } as Anime);
        }
    }, [animeId, location.state, selectedAnime]);

    // Auto-load Episode
    useEffect(() => {
        if (episodes.length > 0 && !currentStream && !streamLoading) {
            const targetEp = episodes.find(e => e.episodeNumber == epNumParam) || episodes[0];
            if (targetEp) {
                // Update URL if we defaulted to a different episode
                if (String(targetEp.episodeNumber) !== epNumParam) {
                    setSearchParams({ ep: String(targetEp.episodeNumber) }, { replace: true });
                }
                loadStream(targetEp);
            }
        }
    }, [episodes, epNumParam]);

    // Save Progress
    useEffect(() => {
        if (selectedAnime && currentEpisode) {
            saveProgress(selectedAnime, currentEpisode);
            markEpisodeComplete(parseFloat(currentEpisode.episodeNumber));
        }
    }, [selectedAnime, currentEpisode]);

    // --- Actions ---

    const handleEpisodeClick = (ep: Episode) => {
        setSearchParams({ ep: String(ep.episodeNumber) });
        loadStream(ep);
    };

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const reloadPlayer = () => {
        if (currentEpisode) {
            loadStream(currentEpisode);
        }
    };

    const handlePrevEp = () => {
        const targetNum = parseInt(epNumParam) - 1;
        const target = episodes.find(e => parseInt(e.episodeNumber) === targetNum);
        if (target) handleEpisodeClick(target);
    };

    const handleNextEp = () => {
        const targetNum = parseInt(epNumParam) + 1;
        const target = episodes.find(e => parseInt(e.episodeNumber) === targetNum);
        if (target) handleEpisodeClick(target);
    };

    // Derived State
    const currentEpTitle = episodes.find(e => e.episodeNumber == epNumParam)?.title;
    const cleanCurrentTitle = currentEpTitle && currentEpTitle.trim().toLowerCase() !== 'untitled' ? currentEpTitle : null;

    return {
        // Data
        anime: selectedAnime,
        episodes,
        currentEpisode,
        currentStream,
        streams,
        error,
        watchedEpisodes,
        epNum: epNumParam,
        cleanCurrentTitle,

        // Loading States
        epLoading,
        streamLoading,

        // UI State
        isExpanded,
        isAutoQuality,
        showQualityMenu,
        selectedStreamIndex,

        // Actions
        toggleExpand,
        reloadPlayer,
        handlePrevEp,
        handleNextEp,
        handleEpisodeClick,
        setShowQualityMenu,
        handleQualityChange,
        setAutoQuality,
        navigate // Expose navigate for back button
    };
}
