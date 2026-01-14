import { useState } from 'react';
import type { Anime, Episode } from '../../types/anime';
import AnimeCard from '../AnimeCard';

// Episode Grid Component with Pagination (30 per page)
// Episode List Component with Pagination (20 per page)
const EpisodeList = ({ episodes, onEpisodeClick }: { episodes: Episode[], onEpisodeClick: (ep: Episode) => void }) => {
    // 30 eps per page as requested
    const ITEMS_PER_PAGE = 30;
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(episodes.length / ITEMS_PER_PAGE);

    const currentEpisodes = episodes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="mt-6">
            {/* Grid Layout - Dense "Boxes" */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-2">
                {currentEpisodes.map((ep) => {
                    return (
                        <button
                            key={ep.session || ep.episodeNumber}
                            onClick={() => onEpisodeClick(ep)}
                            className="aspect-square flex items-center justify-center rounded transition-all duration-200 relative group bg-white/10 hover:bg-yorumi-accent hover:text-black hover:scale-105 hover:shadow-lg hover:shadow-yorumi-accent/20 text-gray-300 cursor-pointer border border-white/5 hover:border-yorumi-accent"
                            title={ep.title || `Episode ${ep.episodeNumber}`}
                        >
                            <span className="text-sm font-bold">{ep.episodeNumber}</span>
                        </button>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 mt-6">
                    <div className="flex flex-wrap justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors flex-shrink-0
                                    ${page === p ? 'bg-yorumi-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}
                                `}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

interface AnimeDetailsModalProps {
    isOpen: boolean;
    anime: Anime;
    episodes: Episode[];
    epLoading: boolean;
    onClose: () => void;
    onWatchNow: () => void;
    onEpisodeClick: (ep: Episode) => void;
    onAnimeClick: (anime: Anime) => void;
}

export default function AnimeDetailsModal({ isOpen, anime, episodes, epLoading, onClose, onWatchNow, onEpisodeClick, onAnimeClick }: AnimeDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<'summary' | 'relations'>('summary');
    if (!isOpen) return null;

    // Use banner if available, otherwise fallback or use a placeholder
    const bannerImage = anime.anilist_banner_image || anime.images.jpg.large_image_url;

    // Get latest episode display
    const getLatestEpisode = () => {
        if (anime.latestEpisode) return anime.latestEpisode;
        if (episodes.length > 0) return episodes.length;
        if (anime.episodes) return anime.episodes;
        return null;
    };

    return (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a] overflow-y-auto animate-in fade-in duration-300 scrollbar-thin scrollbar-thumb-yorumi-primary scrollbar-track-transparent">
            <div className="relative min-h-screen pb-20">
                {/* Back Button - Fixed position top-left */}
                <button
                    onClick={onClose}
                    className="fixed top-20 left-6 z-50 p-3 bg-black/50 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors text-white flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* Banner Section */}
                <div className="relative h-[50vh] w-full">
                    <div className="absolute inset-0">
                        <img
                            src={bannerImage}
                            alt={anime.title}
                            className={`w-full h-full object-cover ${!anime.anilist_banner_image ? 'blur-xl opacity-50 scale-110' : ''}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-6 -mt-32 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Portrait Image - Bigger */}
                        <div className="flex-shrink-0 mx-auto md:mx-0 w-64 md:w-72">
                            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
                                <img
                                    src={anime.images.jpg.large_image_url}
                                    alt={anime.title}
                                    className="w-full h-auto object-cover aspect-[2/3]"
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 pt-4 md:pt-8 text-center md:text-left space-y-4">
                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                                {anime.title}
                            </h1>

                            {/* Info Row: ★ 7.9 | HD | 1 eps | TV - matching card styling */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm">
                                {/* Rating Badge */}
                                <span className="bg-[#facc15] text-black px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                    </svg>
                                    {anime.score}
                                </span>
                                {/* CC + Episode Count Badge (Green) */}
                                {getLatestEpisode() && (
                                    <span className="bg-[#22c55e] text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                            <path d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v2H6V9h5v2zm7 0h-1.5v-.5h-2v3h2V13H18v2h-5V9h5v2z" />
                                        </svg>
                                        {getLatestEpisode()}
                                    </span>
                                )}
                                {/* Type */}
                                {anime.type && (
                                    <span className="px-2.5 py-1 bg-white/10 rounded text-gray-300 text-xs">
                                        {anime.type}
                                    </span>
                                )}
                            </div>

                            {/* Actions - Above Synopsis */}
                            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 py-2">
                                <button
                                    onClick={onWatchNow}
                                    className="h-12 px-8 bg-[#facc15] hover:bg-[#ffe066] text-black text-lg font-bold rounded-full transition-transform active:scale-95 flex items-center gap-3 shadow-lg shadow-yellow-500/20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M4.5 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" clipRule="evenodd" />
                                    </svg>
                                    Watch Now
                                </button>

                                <button
                                    className="h-12 px-8 bg-white/10 hover:bg-white/20 text-white text-lg font-bold rounded-full transition-colors flex items-center gap-3 border border-white/10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Add to List
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-8 border-b border-white/10 mb-6">
                                <button
                                    onClick={() => setActiveTab('summary')}
                                    className={`pb-3 text-lg font-bold transition-colors relative ${activeTab === 'summary' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Summary
                                    {activeTab === 'summary' && (
                                        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('relations')}
                                    className={`pb-3 text-lg font-bold transition-colors relative ${activeTab === 'relations' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Relations
                                    {activeTab === 'relations' && (
                                        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                                    )}
                                </button>
                            </div>

                            {activeTab === 'summary' && (
                                <>
                                    {/* Synopsis */}
                                    <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
                                        {anime.synopsis || 'No synopsis available.'}
                                    </p>

                                    {/* Status Line */}
                                    {anime.status && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-500">Status:</span>
                                            <span className={`font-bold uppercase ${anime.status === 'Currently Airing' || anime.status === 'Releasing'
                                                ? 'text-purple-400'
                                                : 'text-gray-400'
                                                }`}>
                                                {anime.status === 'Currently Airing' ? 'RELEASING' : anime.status.toUpperCase()}
                                            </span>
                                        </div>
                                    )}

                                    {/* Genres - as bordered pills matching card */}
                                    {anime.genres && anime.genres.length > 0 && (
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            {anime.genres.map(genre => (
                                                <span
                                                    key={genre.mal_id}
                                                    className="px-3 py-1 rounded-full border border-white/20 text-gray-300 text-sm hover:border-white/40 transition-colors"
                                                >
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Episodes Section - Square Cards Grid with Pagination */}
                                    <div className="py-6 border-t border-white/10 mt-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-white">
                                                Episodes {!epLoading && episodes.length > 0 && `(${episodes.length})`}
                                            </h3>
                                        </div>

                                        {epLoading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="flex items-center gap-3 text-gray-400">
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Loading episodes...</span>
                                                </div>
                                            </div>
                                        ) : episodes.length > 0 ? (
                                            <EpisodeList episodes={episodes} onEpisodeClick={onEpisodeClick} />
                                        ) : (
                                            <div className="text-center text-gray-500 py-4">
                                                No episodes found. Click "Watch Now" to search.
                                            </div>
                                        )}
                                    </div>

                                    {/* Characters Section */}
                                    {anime.characters && anime.characters.edges.length > 0 && (
                                        <div className="py-6 border-t border-white/10">
                                            <h3 className="text-xl font-bold text-white mb-4">Characters & Voice Actors</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {anime.characters.edges.slice(0, 6).map((edge) => {
                                                    const formatName = (name: string) => {
                                                        const words = name.split(' ');
                                                        if (words.length >= 2) {
                                                            const mid = Math.ceil(words.length / 2);
                                                            return (
                                                                <>
                                                                    <span className="block">{words.slice(0, mid).join(' ')}</span>
                                                                    <span className="block">{words.slice(mid).join(' ')}</span>
                                                                </>
                                                            );
                                                        }
                                                        return <span>{name}</span>;
                                                    };

                                                    return (
                                                        <div key={`${edge.node.id}-${edge.voiceActors[0]?.id}`} className="flex bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-colors">
                                                            <div className="flex-1 flex items-center gap-3 p-3">
                                                                <img
                                                                    src={edge.node.image.large}
                                                                    alt={edge.node.name.full}
                                                                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                                                                />
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-bold text-gray-200 leading-tight" title={edge.node.name.full}>
                                                                        {formatName(edge.node.name.full)}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 uppercase font-medium mt-1">
                                                                        {edge.role}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="w-px bg-white/10 my-3" />
                                                            <div className="flex-1 flex items-center justify-end gap-3 p-3">
                                                                {edge.voiceActors[0] ? (
                                                                    <>
                                                                        <div className="min-w-0 text-right">
                                                                            <p className="text-sm font-bold text-gray-200 leading-tight" title={edge.voiceActors[0].name.full}>
                                                                                {formatName(edge.voiceActors[0].name.full)}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500 uppercase font-medium mt-1">
                                                                                {edge.voiceActors[0].languageV2 || 'Japanese'}
                                                                            </p>
                                                                        </div>
                                                                        <img
                                                                            src={edge.voiceActors[0].image.large}
                                                                            alt={edge.voiceActors[0].name.full}
                                                                            className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <div className="text-gray-500 text-sm">No VA data</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Trailer Section */}
                                    {anime.trailer && (anime.trailer.site === 'youtube' && anime.trailer.id) && (
                                        <div className="py-6 border-t border-white/10">
                                            <h3 className="text-xl font-bold text-white mb-4">Trailers & PVs</h3>
                                            <div className="w-full sm:w-72 md:w-80">
                                                <a
                                                    href={`https://www.youtube.com/watch?v=${anime.trailer.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block group relative aspect-video rounded-lg overflow-hidden shadow-lg border border-white/10"
                                                >
                                                    <img
                                                        src={anime.trailer.thumbnail || `https://img.youtube.com/vi/${anime.trailer.id}/maxresdefault.jpg`}
                                                        alt="Trailer"
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white ml-1">
                                                                <path fillRule="evenodd" d="M4.5 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                        <p className="text-sm font-medium text-white">Official Trailer</p>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'relations' && (
                                <div className="py-2">
                                    {anime.relations && anime.relations.edges.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                            {anime.relations.edges
                                                .filter(edge => !['MANGA', 'NOVEL', 'ONE_SHOT'].includes(edge.node.format))
                                                .map((edge) => {
                                                    const partialAnime = {
                                                        mal_id: edge.node.id,
                                                        title: edge.node.title.english || edge.node.title.romaji || 'Unknown',
                                                        type: edge.node.format,
                                                        status: edge.relationType.replace(/_/g, ' '), // Use relation type as status for display
                                                        images: {
                                                            jpg: {
                                                                image_url: edge.node.coverImage.large,
                                                                large_image_url: edge.node.coverImage.large
                                                            }
                                                        },
                                                        score: 0,
                                                        episodes: null,
                                                        genres: []
                                                    } as Anime;

                                                    return (
                                                        <div key={`${edge.node.id}-${edge.relationType}`} onClick={() => onAnimeClick(partialAnime)}>
                                                            <AnimeCard
                                                                anime={partialAnime}
                                                                onClick={onAnimeClick}
                                                                onWatchClick={onAnimeClick}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400 py-12 bg-[#1a1a1a] rounded-lg border border-white/5">
                                            No relations found.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
