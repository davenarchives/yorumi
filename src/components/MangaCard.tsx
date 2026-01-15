import React from 'react';
import type { Manga } from '../types/manga';

interface MangaCardProps {
    manga: Manga;
    onClick: (manga: Manga) => void;
    onReadClick?: (manga: Manga) => void;
    onMouseEnter?: (manga: Manga) => void;
}

const MangaCard: React.FC<MangaCardProps> = ({ manga, onClick, onReadClick, onMouseEnter }) => {
    // Determine count display (Chapters -> Volumes)
    const countDisplay = manga.chapters
        ? `${manga.chapters} ch`
        : manga.volumes
            ? `${manga.volumes} vol`
            : null;

    return (
        <div
            className="select-none cursor-pointer group relative"
            onClick={() => onClick(manga)}
            onMouseEnter={() => onMouseEnter?.(manga)}
        >
            {/* Image Container */}
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 shadow-none ring-0 outline-none">
                <img
                    src={manga.images.jpg.large_image_url || manga.images.jpg.image_url}
                    alt={manga.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Default Badges - Always Visible */}
                {/* Top Right: Star Rating */}
                {manga.score > 0 && (
                    <div className="absolute top-2 right-2 group-hover:opacity-0 transition-opacity duration-300">
                        <span className="bg-[#facc15] text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                            {manga.score.toFixed(1)}
                        </span>
                    </div>
                )}

                {/* Bottom Left: Type + Count - Always Visible */}
                <div className="absolute bottom-2 left-2 flex gap-1.5 group-hover:opacity-0 transition-opacity duration-300">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold">
                        {manga.type || 'Manga'}
                    </span>
                    {countDisplay && (
                        <span className="bg-[#22c55e] text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {countDisplay}
                        </span>
                    )}
                </div>

                {/* Hover Overlay - Full Info Card */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    {/* HD/Status Badge - Top Right on Hover */}
                    <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${manga.status === 'Publishing' ? 'bg-green-500 text-black' : 'bg-gray-600 text-white'}`}>
                            {manga.status === 'Publishing' ? 'ONGOING' : 'FINISHED'}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 leading-tight">
                        {manga.title}
                    </h3>

                    {/* Rating + Info Row */}
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        {manga.score > 0 && (
                            <span className="text-[#facc15] text-xs font-bold flex items-center gap-0.5">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                {manga.score.toFixed(1)}
                            </span>
                        )}
                        {countDisplay && (
                            <span className="text-gray-300 text-[10px] font-medium">{countDisplay}</span>
                        )}
                        <span className="text-gray-400 text-[10px]">{manga.type || 'Manga'}</span>
                    </div>

                    {/* Synopsis */}
                    <p className="text-gray-400 text-[10px] line-clamp-2 mb-2 leading-relaxed">
                        {manga.synopsis || 'No description available.'}
                    </p>

                    {/* Genres */}
                    {manga.genres && manga.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {manga.genres.slice(0, 3).map((genre, idx) => (
                                <span key={idx} className="border border-gray-600 text-gray-300 px-1.5 py-0.5 rounded text-[9px]">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Buttons - Read, Detail */}
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onReadClick ? onReadClick(manga) : onClick(manga); }}
                            className="flex-1 flex items-center justify-center gap-1 bg-[#d886ff] hover:bg-[#c06ae0] text-black py-1.5 rounded text-[9px] font-bold transition-colors"
                        >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            READ
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onClick(manga); }}
                            className="flex-1 flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white py-1.5 rounded text-[9px] font-medium transition-colors"
                        >
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            DETAIL
                        </button>
                    </div>
                </div>
            </div>

            {/* Title Below Card */}
            <h3 className="text-sm font-semibold text-gray-100 line-clamp-2 leading-tight group-hover:text-yorumi-accent transition-colors">
                {manga.title}
            </h3>
        </div>
    );
};

export default MangaCard;
