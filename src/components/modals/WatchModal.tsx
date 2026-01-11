import type { Anime, Episode } from '../../types/anime';
import type { StreamLink } from '../../types/stream';

interface WatchModalProps {
    isOpen: boolean;
    anime: Anime;
    episodes: Episode[];
    currentEpisode: Episode | null;
    episodeSearchQuery: string;
    epLoading: boolean;
    streams: StreamLink[];
    selectedStreamIndex: number;
    isAutoQuality: boolean;
    showQualityMenu: boolean;
    currentStream: StreamLink | null;
    streamLoading: boolean;
    playerMode: 'hls' | 'embed';
    videoRef: React.RefObject<HTMLVideoElement | null>;
    onClose: () => void;
    onEpisodeSearchChange: (query: string) => void;
    onLoadStream: (episode: Episode) => void;
    onPrefetchStream: (episode: Episode) => void;
    onQualityMenuToggle: () => void;
    onQualityChange: (index: number) => void;
    onSetAutoQuality: () => void;
    onPlayerModeChange: (mode: 'hls' | 'embed') => void;
    getMappedQuality: (quality: string) => string;
}

export default function WatchModal({
    isOpen,
    anime,
    episodes,
    currentEpisode,
    episodeSearchQuery,
    epLoading,
    streams,
    selectedStreamIndex,
    isAutoQuality,
    showQualityMenu,
    currentStream,
    streamLoading,
    playerMode,
    videoRef,
    onClose,
    onEpisodeSearchChange,
    onLoadStream,
    onPrefetchStream,
    onQualityMenuToggle,
    onQualityChange,
    onSetAutoQuality,
    onPlayerModeChange,
    getMappedQuality,
}: WatchModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300">
            <div className="w-full h-full flex flex-col">
                <div className="flex items-center p-4 bg-[#1a1a1a]/80 border-b border-white/5">
                    <button onClick={onClose} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h2 className="ml-4 text-lg font-bold truncate">{anime.title}</h2>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Episode List */}
                    <div className="w-80 bg-[#111] border-r border-white/5 flex flex-col">
                        <div className="p-4 border-b border-white/5 bg-[#161616] flex items-center justify-between gap-4">
                            <h3 className="font-semibold text-gray-400 text-xs uppercase tracking-wide whitespace-nowrap">Episodes ({episodes.length})</h3>
                            <div className="relative flex-1 max-w-[140px]">
                                <input
                                    type="text"
                                    placeholder="Number of Ep"
                                    value={episodeSearchQuery}
                                    onChange={(e) => onEpisodeSearchChange(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-[11px] text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 transition-colors"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-2.5 h-2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            {epLoading ? (
                                <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#facc15]"></div></div>
                            ) : episodes.length > 0 ? (
                                <div className="space-y-1">
                                    {episodes
                                        .filter(ep => {
                                            if (!episodeSearchQuery) return true;
                                            const query = episodeSearchQuery.toLowerCase();
                                            const numMatch = ep.episodeNumber.toString().includes(query);
                                            const titleMatch = ep.title?.toLowerCase().includes(query);
                                            return numMatch || titleMatch;
                                        })
                                        .map((ep: Episode) => (
                                            <div
                                                key={ep.session}
                                                onClick={() => onLoadStream(ep)}
                                                onMouseEnter={() => onPrefetchStream(ep)}
                                                className={`p-4 cursor-pointer hover:bg-white/5 transition-colors border-l-2 ${currentEpisode?.session === ep.session ? 'bg-white/10 border-[#facc15]' : 'border-transparent'}`}
                                            >
                                                <div className="flex items-center justify-between font-mono text-sm text-gray-400">
                                                    <span>EP {ep.episodeNumber}</span>
                                                    <span className="text-xs text-gray-600">{ep.duration}</span>
                                                </div>
                                                <div className="text-sm font-medium mt-1 truncate">{ep.title || `Episode ${ep.episodeNumber}`}</div>
                                            </div>
                                        ))}
                                </div>
                            ) : <div className="p-8 text-center text-gray-500">No episodes found.</div>}
                        </div>
                    </div>

                    {/* Video Player */}
                    <div className="flex-1 bg-black flex flex-col relative">
                        {currentStream && (
                            <div className="absolute top-4 right-4 z-10 flex gap-2">
                                <div className="relative">
                                    <button
                                        onClick={onQualityMenuToggle}
                                        className="px-3 py-1 flex items-center gap-1.5 rounded-full text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-9.75 0h9.75" />
                                        </svg>
                                        {isAutoQuality ? 'AUTO' : getMappedQuality(currentStream.quality)}
                                    </button>

                                    {showQualityMenu && (
                                        <div className="absolute right-0 mt-2 p-2 w-28 bg-[#1a1a1a] rounded-lg shadow-2xl border border-white/10 flex flex-col gap-1 z-20">
                                            <h4 className="px-2 py-1 text-[10px] font-bold text-gray-500 uppercase">Quality</h4>
                                            {streams.map((s, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => onQualityChange(idx)}
                                                    className={`px-3 py-1.5 text-xs text-left rounded transition-colors ${!isAutoQuality && selectedStreamIndex === idx ? 'bg-white text-black font-bold' : 'hover:bg-white/5 text-gray-300'}`}
                                                >
                                                    {getMappedQuality(s.quality)}
                                                </button>
                                            ))}
                                            <button
                                                onClick={onSetAutoQuality}
                                                className={`px-3 py-1.5 text-xs text-left rounded transition-colors ${isAutoQuality ? 'bg-white text-black font-bold' : 'hover:bg-white/5 text-gray-300'}`}
                                            >
                                                AUTO
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {currentStream.directUrl && (
                                    <button
                                        onClick={() => onPlayerModeChange('hls')}
                                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${playerMode === 'hls' ? 'bg-[#facc15] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                    >
                                        Clean Player
                                    </button>
                                )}
                                <button
                                    onClick={() => onPlayerModeChange('embed')}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${playerMode === 'embed' ? 'bg-[#facc15] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                    Embed Mode
                                </button>
                            </div>
                        )}

                        <div className="flex-1 flex items-center justify-center">
                            {streamLoading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#facc15]"></div>
                                    <p className="text-gray-400 animate-pulse">Loading stream...</p>
                                </div>
                            ) : currentStream ? (
                                playerMode === 'hls' && currentStream.directUrl ? (
                                    <video ref={videoRef} controls className="w-full h-full" autoPlay />
                                ) : (
                                    <iframe
                                        src={currentStream.url}
                                        className="w-full h-full"
                                        allowFullScreen
                                        allow="autoplay; encrypted-media"
                                        frameBorder="0"
                                    ></iframe>
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-500 gap-4">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                        </svg>
                                    </div>
                                    <p>Select an episode to start watching</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Anime Info Sidebar */}
                    <div className="w-80 bg-[#111] border-l border-white/5 overflow-y-auto hidden xl:block p-6 space-y-4">
                        <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                            <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold leading-tight mb-1">{anime.title}</h1>
                            {anime.title_japanese && (
                                <p className="text-sm text-gray-400 mb-3">{anime.title_japanese}</p>
                            )}

                            <div className="flex flex-wrap gap-2 text-xs mb-4">
                                <span className="px-2 py-1 bg-white/10 rounded">{anime.type}</span>
                                {anime.rating && (
                                    <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded font-medium">{anime.rating}</span>
                                )}
                                <span className="px-2 py-1 bg-[#facc15] text-black font-bold rounded flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                                    {anime.score}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm border-t border-white/5 pt-4">
                            {anime.aired?.string && (
                                <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Aired</span>
                                    <p className="text-gray-300 mt-0.5">{anime.aired.string}</p>
                                </div>
                            )}

                            {anime.season && (
                                <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Premiered</span>
                                    <p className="text-gray-300 mt-0.5 capitalize">{anime.season} {anime.year}</p>
                                </div>
                            )}

                            {anime.duration && (
                                <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Duration</span>
                                    <p className="text-gray-300 mt-0.5">{anime.duration}</p>
                                </div>
                            )}

                            <div>
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Status</span>
                                <p className={`mt-0.5 ${anime.status === 'Currently Airing' ? 'text-green-400' : 'text-gray-300'}`}>
                                    {anime.status}
                                </p>
                            </div>

                            {anime.genres && anime.genres.length > 0 && (
                                <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide block mb-2">Genres</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {anime.genres.map(genre => (
                                            <span key={genre.mal_id} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-gray-300 transition-colors">
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {anime.studios && anime.studios.length > 0 && (
                                <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Studios</span>
                                    <p className="text-gray-300 mt-0.5">
                                        {anime.studios.map(s => s.name).join(', ')}
                                    </p>
                                </div>
                            )}

                            {anime.producers && anime.producers.length > 0 && (
                                <div>
                                    <span className="text-gray-500 text-xs uppercase tracking-wide">Producers</span>
                                    <p className="text-gray-300 mt-0.5 text-xs">
                                        {anime.producers.map(p => p.name).join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-white/5 pt-4">
                            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Synopsis</h4>
                            <p className="text-sm text-gray-300 leading-relaxed max-h-60 overflow-y-auto no-scrollbar">
                                {anime.synopsis || 'No synopsis available.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
