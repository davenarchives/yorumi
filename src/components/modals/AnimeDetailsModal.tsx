import type { Anime, Episode } from '../../types/anime';

interface AnimeDetailsModalProps {
    isOpen: boolean;
    anime: Anime;
    episodes: Episode[];
    epLoading: boolean;
    onClose: () => void;
    onWatchNow: () => void;
}

export default function AnimeDetailsModal({ isOpen, anime, episodes, epLoading, onClose, onWatchNow }: AnimeDetailsModalProps) {
    if (!isOpen) return null;

    // Use banner if available, otherwise fallback or use a placeholder
    const bannerImage = anime.anilist_banner_image || anime.images.jpg.large_image_url;

    return (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a] overflow-y-auto animate-in fade-in duration-300 scrollbar-thin scrollbar-thumb-yorumi-primary scrollbar-track-transparent">
            {/* Standard "Page" feel - Navbar is z-50, so we add top padding to clear it if it's fixed, 
                but since we want the banner to go behind the navbar (potentially) or start at top:
                If navbar is solid, we start below. If navbar is transparent, we go full.
                Our navbar handles scroll transparency. Let's start content at top so banner is behind transparent navbar.
            */}

            <div className="relative min-h-screen pb-20">
                {/* Close Button - Fixed position for easy exit */}
                <button
                    onClick={onClose}
                    className="fixed top-20 right-6 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Banner Section */}
                <div className="relative h-[50vh] w-full">
                    <div className="absolute inset-0">
                        {/* If it's a poster used as banner, blur it. If real banner, cover. */}
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
                    <div className="flex flex-col md:flex-row gap-10">
                        {/* Portrait Image */}
                        <div className="flex-shrink-0 mx-auto md:mx-0 w-64 md:w-72 lg:w-80">
                            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 group relative">
                                <img
                                    src={anime.images.jpg.large_image_url}
                                    alt={anime.title}
                                    className="w-full h-auto object-cover aspect-[2/3]"
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 pt-4 md:pt-12 text-center md:text-left space-y-6">
                            {/* Title & Stats */}
                            <div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-2">
                                    {anime.title}
                                </h1>
                                {anime.title_japanese && (
                                    <p className="text-xl text-gray-400 font-medium mb-4">{anime.title_japanese}</p>
                                )}

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold tracking-wider">
                                    {anime.type && (
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded border border-white/10 uppercase">
                                            {anime.type}
                                        </span>
                                    )}
                                    {anime.episodes && (
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded border border-white/10">
                                            {anime.episodes} EPISODES
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1 bg-[#facc15] text-black px-3 py-1 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                        {anime.score}
                                    </div>
                                    <span className={`px-3 py-1 rounded border overflow-hidden relative ${anime.status === 'Currently Airing' || anime.status === 'Releasing'
                                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                        : 'bg-white/5 border-white/10 text-gray-400'
                                        }`}>
                                        {anime.status && anime.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 py-2">
                                <button
                                    onClick={onWatchNow}
                                    className="h-14 px-8 bg-[#facc15] hover:bg-[#ffe066] text-black text-lg font-bold rounded-full transition-transform active:scale-95 flex items-center gap-3 shadow-lg shadow-yellow-500/20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M4.5 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" clipRule="evenodd" />
                                    </svg>
                                    Watch Now
                                </button>

                                <button
                                    className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white text-lg font-bold rounded-full transition-colors flex items-center gap-3 border border-white/10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Add to List
                                </button>
                            </div>

                            {/* Synopsis */}
                            <div className="max-w-4xl">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Synopsis</h3>
                                <p className="text-gray-200 text-lg leading-relaxed font-light">
                                    {anime.synopsis || 'No synopsis available.'}
                                </p>
                            </div>

                            {/* Genres */}
                            {anime.genres && anime.genres.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Genres</h3>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                        {anime.genres.map(genre => (
                                            <span
                                                key={genre.mal_id}
                                                className="px-4 py-2 rounded-full bg-[#1a1a1a] border border-white/10 text-gray-300 hover:text-white hover:border-yorumi-primary/50 transition-colors text-sm"
                                            >
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Episodes Preview Section */}
                            <div className="py-8 border-t border-white/10 mt-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white">
                                        Episodes {!epLoading && episodes.length > 0 && `(${episodes.length})`}
                                    </h3>
                                    {episodes.length > 0 && (
                                        <button
                                            onClick={onWatchNow}
                                            className="text-sm text-yorumi-accent hover:text-yorumi-primary transition-colors flex items-center gap-1"
                                        >
                                            View All & Watch
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                            </svg>
                                        </button>
                                    )}
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
                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                                        {episodes.slice(0, 20).map((ep) => (
                                            <button
                                                key={ep.session}
                                                onClick={onWatchNow}
                                                className="p-3 bg-[#1a1a1a] rounded-lg border border-white/5 hover:border-yorumi-accent/50 hover:bg-white/5 transition-all text-center group"
                                            >
                                                <span className="text-sm font-bold text-gray-300 group-hover:text-white">
                                                    {ep.episodeNumber}
                                                </span>
                                            </button>
                                        ))}
                                        {episodes.length > 20 && (
                                            <button
                                                onClick={onWatchNow}
                                                className="p-3 bg-[#1a1a1a] rounded-lg border border-white/5 hover:border-yorumi-accent/50 hover:bg-white/5 transition-all text-center"
                                            >
                                                <span className="text-xs font-medium text-gray-400">
                                                    +{episodes.length - 20} more
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        No episodes found. Click "Watch Now" to search.
                                    </div>
                                )}
                            </div>

                            {/* Characters Section */}
                            {anime.characters && anime.characters.edges.length > 0 && (
                                <div className="py-8 border-t border-white/10 mt-8">
                                    <h3 className="text-xl font-bold text-white mb-6">Characters & Voice Actors</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {anime.characters.edges.slice(0, 6).map((edge) => {
                                            // Helper to split name into two lines for multi-word names
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
                                                    {/* Left Side - Character */}
                                                    <div className="flex-1 flex items-center gap-3 p-3">
                                                        <img
                                                            src={edge.node.image.large}
                                                            alt={edge.node.name.full}
                                                            className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
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

                                                    {/* Center Divider */}
                                                    <div className="w-px bg-white/10 my-3" />

                                                    {/* Right Side - Voice Actor */}
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
                                                                    className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
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
                                <div className="py-8 border-t border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-6">Trailers & PVs</h3>
                                    <div className="w-full sm:w-80 md:w-96">
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

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-t border-white/10 mt-8">
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Aired</span>
                                    <p className="text-white font-medium">{anime.aired?.string || 'Unknown'}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Season</span>
                                    <p className="text-white font-medium capitalize">{anime.season || 'Unknown'} {anime.year}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Duration</span>
                                    <p className="text-white font-medium">{anime.duration || 'Unknown'}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Studios</span>
                                    <p className="text-white font-medium truncate">{anime.studios?.[0]?.name || 'Unknown'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
