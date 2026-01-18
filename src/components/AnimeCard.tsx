import React from 'react';
import type { Anime } from '../types/anime';

interface AnimeCardProps {
    anime: Anime;
    onClick: (anime: Anime) => void;
    onWatchClick?: (anime: Anime) => void;
    onMouseEnter?: (anime: Anime) => void;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick, onWatchClick, onMouseEnter }) => {
    // Get episode count - prefer latestEpisode for ongoing anime
    // Hide episode count for unreleased anime
    const isUnreleased = anime.status === 'NOT_YET_RELEASED';
    const episodeCount = isUnreleased ? null : (anime.latestEpisode || anime.episodes);

    return (
        <div
            className="select-none cursor-pointer group relative"
            onClick={() => onClick(anime)}
            onMouseEnter={() => onMouseEnter?.(anime)}
        >
            {/* Image Container */}
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 shadow-none ring-0 outline-none">
                <img
                    src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Default Badges - Always Visible */}
                {/* Top Right: Star Rating */}
                {anime.score > 0 && (
                    <div className="absolute top-2 right-2 group-hover:opacity-0 transition-opacity duration-300">
                        <span className="bg-[#facc15] text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                            {anime.score.toFixed(1)}
                        </span>
                    </div>
                )}

                {/* Bottom Left: TV + EP - Always Visible */}
                <div className="absolute bottom-2 left-2 flex gap-1.5 group-hover:opacity-0 transition-opacity duration-300">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold">
                        {anime.type || 'TV'}
                    </span>
                    {episodeCount && (
                        <span className="bg-[#22c55e] text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v2H6V9h5v2zm7 0h-1.5v-.5h-2v3h2V13H18v2h-5V9h5v2z" /></svg>
                            {episodeCount}
                        </span>
                    )}
                </div>

                {/* Hover Overlay - Full Info Card */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    {/* HD Badge - Top Right on Hover */}
                    <div className="absolute top-2 right-2">
                        <span className="bg-[#d886ff] text-black px-2 py-1 rounded text-xs font-bold">HD</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 leading-tight">
                        {anime.title}
                    </h3>

                    {/* Rating + Info Row */}
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        {anime.score > 0 && (
                            <span className="text-[#facc15] text-xs font-bold flex items-center gap-0.5">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                {anime.score.toFixed(1)}
                            </span>
                        )}
                        <span className="bg-[#d886ff] text-black px-1.5 py-0.5 rounded text-[10px] font-bold">HD</span>
                        {episodeCount && (
                            <span className="text-gray-300 text-[10px] font-medium">{episodeCount} eps</span>
                        )}
                        <span className="text-gray-400 text-[10px]">{anime.type || 'TV'}</span>
                    </div>

                    {/* Synopsis */}
                    <p className="text-gray-400 text-[10px] line-clamp-2 mb-2 leading-relaxed">
                        {anime.synopsis || 'No description available.'}
                    </p>

                    {/* Status */}
                    <div className="flex items-center gap-1 mb-2">
                        <span className="text-gray-500 text-[10px]">Status:</span>
                        <span className="text-white text-[10px] font-medium">
                            {anime.status === 'RELEASING' ? 'Ongoing' : anime.status === 'FINISHED' ? 'Complete' : anime.status || 'Unknown'}
                        </span>
                    </div>

                    {/* Genres */}
                    {anime.genres && anime.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {anime.genres.slice(0, 3).map((genre, idx) => (
                                <span key={idx} className="border border-gray-600 text-gray-300 px-1.5 py-0.5 rounded text-[9px]">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Buttons - Watch first, Detail second */}
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onWatchClick ? onWatchClick(anime) : onClick(anime); }}
                            className="flex-1 flex items-center justify-center gap-1 bg-[#d886ff] hover:bg-[#c06ae0] text-black py-1.5 rounded text-[9px] font-bold transition-colors"
                        >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            WATCH
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onClick(anime); }}
                            className="flex-1 flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white py-1.5 rounded text-[9px] font-medium transition-colors"
                        >
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            DETAIL
                        </button>
                        <button className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white p-1.5 rounded transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Title Below Card */}
            <h3 className="text-sm font-semibold text-gray-100 line-clamp-2 leading-tight group-hover:text-yorumi-accent transition-colors">
                {anime.title}
            </h3>
        </div>
    );
};

export default AnimeCard;
