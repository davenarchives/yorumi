import { useState, useRef, useEffect } from 'react';
import { LayoutList, LayoutGrid, Search, ChevronDown } from 'lucide-react';
import type { Episode } from '../../../types/anime';

interface EpisodeListProps {
    episodes: Episode[];
    currentEpNumber: string;
    watchedEpisodes: Set<number>;
    isLoading: boolean;
    onEpisodeClick: (ep: Episode) => void;
}

export default function EpisodeList({
    episodes,
    currentEpNumber,
    watchedEpisodes,
    isLoading,
    onEpisodeClick
}: EpisodeListProps) {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [searchEp, setSearchEp] = useState('');
    const [selectedRange, setSelectedRange] = useState<string>('1-100');
    const [showRangeMenu, setShowRangeMenu] = useState(false);

    // Auto-scroll to active episode
    const activeEpRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (activeEpRef.current) {
            activeEpRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [currentEpNumber, viewMode]);

    // Generate Ranges
    const ranges: string[] = [];
    if (episodes.length > 100) {
        for (let i = 0; i < episodes.length; i += 100) {
            const start = i + 1;
            const end = Math.min(i + 100, episodes.length);
            ranges.push(`${start}-${end}`);
        }
    }

    // Filter Episodes
    const filteredEpisodes = episodes.filter(ep =>
        (ep.title?.toLowerCase() || '').includes(searchEp.toLowerCase()) ||
        ep.episodeNumber.toString().includes(searchEp)
    ).filter(ep => {
        if (searchEp) return true; // Ignore range if searching
        if (ranges.length === 0) return true; // No ranges

        const [start, end] = selectedRange.split('-').map(Number);
        const epNumVal = parseInt(ep.episodeNumber.toString());
        if (isNaN(epNumVal)) return true;
        return epNumVal >= start && epNumVal <= end;
    });

    return (
        <aside className="w-full md:w-[350px] shrink-0 flex flex-col h-[500px] md:h-full border-r border-white/10 bg-black/20 overflow-hidden order-2 md:order-1">
            <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        Episodes ({episodes.length})
                        {ranges.length > 1 && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowRangeMenu(!showRangeMenu)}
                                    className="ml-2 flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-white transition-colors"
                                >
                                    {selectedRange}
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                {showRangeMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowRangeMenu(false)} />
                                        <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg p-1 min-w-[100px] shadow-xl z-50 max-h-[200px] overflow-y-auto">
                                            {ranges.map((range) => (
                                                <button
                                                    key={range}
                                                    onClick={() => { setSelectedRange(range); setShowRangeMenu(false); }}
                                                    className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors ${selectedRange === range ? 'bg-yorumi-accent/20 text-yorumi-accent' : 'text-gray-300 hover:bg-white/10'}`}
                                                >
                                                    {range}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </h3>
                    <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/10">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <LayoutList className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Number of Ep"
                        value={searchEp}
                        onChange={(e) => setSearchEp(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-white/20"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yorumi-accent"></div>
                    </div>
                ) : filteredEpisodes.length > 0 ? (
                    <div className={viewMode === 'grid' ? "grid grid-cols-5 gap-2 p-3" : "flex flex-col"}>
                        {filteredEpisodes.map((ep) => {
                            const isCurrent = ep.episodeNumber == currentEpNumber;
                            const isWatched = watchedEpisodes.has(parseFloat(ep.episodeNumber));
                            const cleanTitle = ep.title && ep.title.trim().toLowerCase() !== 'untitled' ? ep.title : null;
                            const displayTitle = cleanTitle || `Episode ${ep.episodeNumber}`;

                            return (
                                <button
                                    key={ep.episodeNumber}
                                    ref={isCurrent ? activeEpRef : null}
                                    onClick={() => onEpisodeClick(ep)}
                                    className={`
                                        group relative transition-all duration-200
                                        ${viewMode === 'grid'
                                            ? `aspect-square rounded-md flex items-center justify-center border ${isCurrent ? 'bg-yorumi-accent text-white border-yorumi-accent font-bold' : isWatched ? 'bg-white/5 text-gray-600 border-white/10 opacity-50' : 'bg-white/10 border-white/5 hover:bg-white/20 text-gray-400 hover:text-white'}`
                                            : `w-full px-5 py-3 text-left flex flex-col justify-center ${isCurrent ? 'bg-white/10' : isWatched ? 'opacity-50' : 'hover:bg-white/5'}`
                                        }
                                    `}
                                >
                                    {viewMode === 'grid' ? (
                                        <span className="text-sm">{ep.episodeNumber}</span>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between w-full mb-0.5">
                                                <span className={`text-sm font-bold ${isCurrent ? 'text-yorumi-accent' : isWatched ? 'text-gray-600' : 'text-gray-400 group-hover:text-white'}`}>
                                                    EP {ep.episodeNumber}
                                                </span>
                                                {isCurrent && (
                                                    <span className="w-8 h-8 rounded-full bg-yorumi-accent flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`text-sm truncate w-full ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                                                {displayTitle}
                                            </span>
                                        </>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        {episodes.length === 0 ? "No episodes found." : "No matching episodes."}
                    </div>
                )}
            </div>
        </aside>
    );
}
