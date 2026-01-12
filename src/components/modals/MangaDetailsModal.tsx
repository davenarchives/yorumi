import type { Manga } from '../../types/manga';

interface MangaDetailsModalProps {
    isOpen: boolean;
    manga: Manga;
    onClose: () => void;
    onReadNow: () => void;
}

export default function MangaDetailsModal({ isOpen, manga, onClose, onReadNow }: MangaDetailsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300">
            <div className="w-full max-w-6xl h-[90vh] bg-[#1a1a1a] rounded-lg overflow-hidden flex flex-col m-4 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h1 className="text-3xl font-bold">{manga.title}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            {manga.rank && <span className="text-sm font-bold text-[#facc15]">RANK #{manga.rank}</span>}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column - Image & Actions */}
                        <div className="w-full md:w-72 flex-shrink-0 flex flex-col gap-4">
                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl group">
                                <img
                                    src={manga.images.jpg.large_image_url || manga.images.jpg.image_url}
                                    alt={manga.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 ring-1 ring-white/10 rounded-lg pointer-events-none" />
                            </div>

                            <button
                                onClick={onReadNow}
                                className="w-full py-4 bg-[#facc15] hover:bg-[#fbbf24] active:scale-[0.98] text-black font-bold text-lg rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 group-hover:translate-x-1 transition-transform">
                                    <path d="M11.25 4.533A9.707 9.707 0 006 3.75a9.709 9.709 0 00-3.75.75v10.5c0 .394.305.717.69.74A12.79 12.79 0 006 14.25c2.316 0 4.526.84 6.25 2.25 2.502-2.049 5.86-3.21 9.423-3.003a.75.75 0 00.771-.62l.625-5c.038-.306-.118-.6-.395-.733a12.708 12.708 0 00-6.673-1.89A12.748 12.748 0 0011.25 4.534z" />
                                </svg>
                                Read Now
                            </button>
                        </div>

                        {/* Right Column - Details */}
                        <div className="flex-1 space-y-6">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white/10 rounded text-sm">{manga.type}</span>

                                {manga.chapters && (
                                    <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded text-sm">{manga.chapters} Chapters</span>
                                )}
                                {manga.volumes && (
                                    <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 rounded text-sm">{manga.volumes} Volumes</span>
                                )}

                                <div className="px-3 py-1 bg-[#facc15] text-black font-bold rounded text-sm flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                    </svg>
                                    {manga.score?.toFixed(2)}
                                </div>
                            </div>

                            {/* Genres */}
                            {manga.genres && manga.genres.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-xs text-gray-500 uppercase mb-2">Genres</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {manga.genres.map(genre => (
                                            <span key={genre.mal_id} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-sm transition-colors cursor-pointer text-gray-300">
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {/* Add Published/Authors if available later. For now, Status. */}
                                <div>
                                    <h4 className="text-xs text-gray-500 uppercase mb-1">Status</h4>
                                    <p className={`text-sm ${manga.status === 'Publishing' ? 'text-green-400' : ''}`}>{manga.status}</p>
                                </div>
                                {manga.published?.string && (
                                    <div>
                                        <h4 className="text-xs text-gray-500 uppercase mb-1">Published</h4>
                                        <p className="text-sm">{manga.published.string}</p>
                                    </div>
                                )}
                            </div>

                            {/* Synopsis */}
                            <div>
                                <h4 className="text-xs text-gray-500 uppercase mb-2">Synopsis</h4>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {manga.synopsis || 'No synopsis available.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
