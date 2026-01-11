import type { Manga, MangaChapter, MangaPage } from '../../types/manga';

interface MangaReaderModalProps {
    isOpen: boolean;
    manga: Manga;
    chapters: MangaChapter[];
    currentChapter: MangaChapter | null;
    pages: MangaPage[];
    chapterSearchQuery: string;
    chaptersLoading: boolean;
    pagesLoading: boolean;
    zoomLevel: number;
    onClose: () => void;
    onChapterSearchChange: (query: string) => void;
    onLoadChapter: (chapter: MangaChapter) => void;
    onPrefetchChapter: (chapter: MangaChapter) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

export default function MangaReaderModal({
    isOpen,
    manga,
    chapters,
    currentChapter,
    pages,
    chapterSearchQuery,
    chaptersLoading,
    pagesLoading,
    zoomLevel,
    onClose,
    onChapterSearchChange,
    onLoadChapter,
    onPrefetchChapter,
    onZoomIn,
    onZoomOut,
}: MangaReaderModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300">
            <div className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-[#1a1a1a]/80 border-b border-white/5">
                    <div className="flex items-center">
                        <button onClick={onClose} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <h2 className="ml-4 text-lg font-bold truncate">
                            {manga.title}
                            {currentChapter && <span className="text-gray-400 font-normal"> | {currentChapter.title}</span>}
                        </h2>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-2">
                        <button onClick={onZoomOut} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
                            </svg>
                        </button>
                        <span className="text-sm font-bold text-white/80 w-12 text-center">{zoomLevel}%</span>
                        <button onClick={onZoomIn} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Chapter Sidebar */}
                    <div className="w-64 bg-[#111] border-r border-white/5 flex flex-col">
                        <div className="p-4 border-b border-white/5 bg-[#161616] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                                <h3 className="font-semibold text-white text-xs whitespace-nowrap">Chapters</h3>
                            </div>
                            <div className="relative flex-1 max-w-[120px]">
                                <input
                                    type="text"
                                    placeholder="Chapter..."
                                    value={chapterSearchQuery}
                                    onChange={(e) => onChapterSearchChange(e.target.value)}
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
                            {chaptersLoading ? (
                                <div className="flex justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#facc15]"></div>
                                </div>
                            ) : chapters.length > 0 ? (
                                <div className="space-y-0.5">
                                    {chapters
                                        .filter(chapter => {
                                            if (!chapterSearchQuery) return true;
                                            const query = chapterSearchQuery.toLowerCase();
                                            return chapter.title.toLowerCase().includes(query);
                                        })
                                        .map((chapter) => (
                                            <div
                                                key={chapter.id}
                                                onClick={() => onLoadChapter(chapter)}
                                                onMouseEnter={() => onPrefetchChapter(chapter)}
                                                className={`px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors border-l-2 ${currentChapter?.id === chapter.id
                                                        ? 'bg-white/10 border-[#facc15]'
                                                        : 'border-transparent'
                                                    }`}
                                            >
                                                <div className="text-sm font-medium truncate">{chapter.title}</div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500">No chapters found on MangaKatana.</div>
                            )}
                        </div>
                    </div>

                    {/* Reading Area */}
                    <div className="flex-1 bg-[#0a0a0a] overflow-y-auto">
                        {pagesLoading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#facc15]"></div>
                                <p className="text-gray-400 animate-pulse">Loading pages...</p>
                            </div>
                        ) : pages.length > 0 ? (
                            <div className="flex flex-col items-center gap-0">
                                {pages.map((page) => (
                                    <img
                                        key={page.pageNumber}
                                        src={page.imageUrl}
                                        alt={`Page ${page.pageNumber}`}
                                        className="transition-all duration-200 block"
                                        style={{ width: `${zoomLevel}%` }}
                                        loading="lazy"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                    </svg>
                                </div>
                                <p>Select a chapter to start reading</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
