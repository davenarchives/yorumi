import { useState, useEffect, useRef } from 'react';
import { useContinueReading } from '../../../../hooks/useContinueReading';
import type { Manga, MangaChapter, MangaPage } from '../../../../types/manga';
import ReaderHeader from './ReaderHeader';
import ChapterList from './ChapterList';
import PageViewer from './PageViewer';
import MangaInfoSidebar from './MangaInfoSidebar';

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
    readChapters?: Set<string>;
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
    readChapters = new Set()
}: MangaReaderModalProps) {
    // UI State
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [showDetails, setShowDetails] = useState(false);
    const [showChapters, setShowChapters] = useState(false);
    const [readingMode, setReadingMode] = useState<'longstrip' | 'page'>('longstrip');
    const [pageIndex, setPageIndex] = useState(0);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

    const lastScrollY = useRef(0);
    const { saveProgress } = useContinueReading();

    // Save progress on chapter change
    useEffect(() => {
        if (currentChapter && manga) {
            const match = currentChapter.title.match(/Chapter\s+(\d+[\.]?\d*)/i);
            const chapterNum = match ? match[1] : '1';
            saveProgress(manga, {
                id: currentChapter.id,
                chapter: chapterNum,
                title: currentChapter.title
            });
        }
    }, [currentChapter, manga, saveProgress]);

    // Reset page index on chapter change
    useEffect(() => {
        setPageIndex(0);
    }, [currentChapter?.id]);

    // Preload adjacent pages
    useEffect(() => {
        if (readingMode !== 'page' || pages.length === 0) return;
        [1, 2, 3].forEach(offset => {
            const idx = pageIndex + offset;
            if (idx < pages.length && pages[idx]?.imageUrl) {
                const img = new Image();
                img.src = pages[idx].imageUrl;
            }
        });
        if (pageIndex > 0 && pages[pageIndex - 1]?.imageUrl) {
            const img = new Image();
            img.src = pages[pageIndex - 1].imageUrl;
        }
    }, [pageIndex, pages, readingMode]);

    // Handle responsive state
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setShowDetails(false);
                setShowChapters(false);
            }
        };
        if (isOpen && window.innerWidth < 768) {
            setShowDetails(false);
            setShowChapters(false);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    if (!isOpen) return null;

    // Determine prev/next chapters
    const currentChapterIndex = chapters.findIndex(c => c.id === currentChapter?.id);
    const prevChapter = currentChapterIndex !== -1 && currentChapterIndex < chapters.length - 1
        ? chapters[currentChapterIndex + 1] : null;
    const nextChapter = currentChapterIndex !== -1 && currentChapterIndex > 0
        ? chapters[currentChapterIndex - 1] : null;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const currentScrollY = e.currentTarget.scrollTop;
        const diff = currentScrollY - lastScrollY.current;
        if (Math.abs(diff) < 10) return;
        if (diff > 0 && currentScrollY > 60 && isHeaderVisible) {
            setIsHeaderVisible(false);
        } else if (diff < 0 && !isHeaderVisible) {
            setIsHeaderVisible(true);
        }
        lastScrollY.current = currentScrollY;
    };

    const handleContentClick = () => {
        if (!isHeaderVisible) setIsHeaderVisible(true);
    };

    const closeSidebars = () => {
        setShowChapters(false);
        setShowDetails(false);
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300 pt-[60px]">
            <div className="w-full h-full flex flex-col bg-[#0a0a0a] relative">
                {/* Header */}
                <ReaderHeader
                    mangaTitle={manga.title}
                    currentChapter={currentChapter}
                    prevChapter={prevChapter}
                    nextChapter={nextChapter}
                    readingMode={readingMode}
                    zoomLevel={zoomLevel}
                    showDetails={showDetails}
                    isVisible={isHeaderVisible}
                    onClose={onClose}
                    onLoadChapter={onLoadChapter}
                    onToggleReadingMode={() => setReadingMode(m => m === 'longstrip' ? 'page' : 'longstrip')}
                    onZoomIn={onZoomIn}
                    onZoomOut={onZoomOut}
                    onToggleDetails={() => setShowDetails(!showDetails)}
                    onToggleChapters={() => setShowChapters(!showChapters)}
                />

                {/* Main Layout */}
                <div className="flex-1 flex min-h-0 relative overflow-hidden">
                    {/* Mobile Backdrop */}
                    {(showChapters || showDetails) && (
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
                            onClick={closeSidebars}
                        />
                    )}

                    {/* Chapter List */}
                    <ChapterList
                        chapters={chapters}
                        currentChapter={currentChapter}
                        searchQuery={chapterSearchQuery}
                        isLoading={chaptersLoading}
                        viewMode={viewMode}
                        readChapters={readChapters}
                        isHeaderVisible={isHeaderVisible}
                        showChapters={showChapters}
                        onSearchChange={onChapterSearchChange}
                        onLoadChapter={onLoadChapter}
                        onPrefetchChapter={onPrefetchChapter}
                        onViewModeChange={setViewMode}
                        onClose={() => setShowChapters(false)}
                    />

                    {/* Page Viewer */}
                    <PageViewer
                        pages={pages}
                        currentChapter={currentChapter}
                        prevChapter={prevChapter}
                        nextChapter={nextChapter}
                        readingMode={readingMode}
                        zoomLevel={zoomLevel}
                        pageIndex={pageIndex}
                        isLoading={pagesLoading}
                        isHeaderVisible={isHeaderVisible}
                        onScroll={handleScroll}
                        onContentClick={handleContentClick}
                        onLoadChapter={onLoadChapter}
                        onPageChange={setPageIndex}
                    />

                    {/* Manga Info Sidebar */}
                    <MangaInfoSidebar
                        manga={manga}
                        showDetails={showDetails}
                        isHeaderVisible={isHeaderVisible}
                        onClose={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
