import { useState, useEffect, useRef } from 'react';
import type { Manga, MangaChapter, MangaPage } from '../types/manga';
import { mangaService } from '../services/mangaService';

export function useManga() {
    const [topManga, setTopManga] = useState<Manga[]>([]);
    const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
    const [mangaPage, setMangaPage] = useState(1);
    const [mangaLastPage, setMangaLastPage] = useState(1);
    const [mangaLoading, setMangaLoading] = useState(false);

    const [mangaChapters, setMangaChapters] = useState<MangaChapter[]>([]);
    const [currentMangaChapter, setCurrentMangaChapter] = useState<MangaChapter | null>(null);
    const [chapterPages, setChapterPages] = useState<MangaPage[]>([]);
    const [mangaChaptersLoading, setMangaChaptersLoading] = useState(false);
    const [mangaPagesLoading, setMangaPagesLoading] = useState(false);
    const [chapterSearchQuery, setChapterSearchQuery] = useState('');
    const [zoomLevel, setZoomLevel] = useState(60);

    const mangaIdCache = useRef(new Map<number, string>());
    const mangaChaptersCache = useRef(new Map<string, MangaChapter[]>());
    const chapterPagesCache = useRef(new Map<string, Promise<MangaPage[]>>());

    // Fetch top manga
    useEffect(() => {
        const fetchTopManga = async () => {
            setMangaLoading(true);
            try {
                const data = await mangaService.getTopManga(mangaPage);
                if (data?.data) {
                    setTopManga(data.data);
                    setMangaLastPage(data.pagination?.last_visible_page || 1);
                }
            } catch (err) {
                console.error('Error fetching manga:', err);
            } finally {
                setMangaLoading(false);
            }
        };
        fetchTopManga();
    }, [mangaPage]);

    const handleMangaClick = async (manga: Manga) => {
        setSelectedManga(manga);
        setMangaChaptersLoading(true);
        setMangaChapters([]);
        setChapterPages([]);
        setCurrentMangaChapter(null);

        try {
            let mangakatanaId: string | null = null;
            if (mangaIdCache.current.has(manga.mal_id)) {
                mangakatanaId = mangaIdCache.current.get(manga.mal_id)!;
            } else {
                const searchData = await mangaService.searchMangaScraper(manga.title);
                if (searchData?.length > 0) {
                    const id = searchData[0].id;
                    if (id) {
                        mangakatanaId = id;
                        mangaIdCache.current.set(manga.mal_id, id);
                    }
                }
            }

            if (mangakatanaId) {
                if (mangaChaptersCache.current.has(mangakatanaId)) {
                    setMangaChapters(mangaChaptersCache.current.get(mangakatanaId)!);
                } else {
                    const chaptersData = await mangaService.getChapters(mangakatanaId);
                    if (chaptersData?.chapters) {
                        mangaChaptersCache.current.set(mangakatanaId, chaptersData.chapters);
                        setMangaChapters(chaptersData.chapters);
                    }
                }
            }
        } catch (err) {
            console.error('Failed to load manga chapters', err);
        } finally {
            setMangaChaptersLoading(false);
        }
    };

    const loadMangaChapter = async (chapter: MangaChapter) => {
        setCurrentMangaChapter(chapter);
        setMangaPagesLoading(true);

        try {
            if (chapterPagesCache.current.has(chapter.url)) {
                const pages = await chapterPagesCache.current.get(chapter.url)!;
                setChapterPages(pages);
            } else {
                const promise = mangaService.getChapterPages(chapter.url);
                chapterPagesCache.current.set(chapter.url, promise);
                const data = await promise;
                if (data?.pages) {
                    setChapterPages(data.pages);
                }
            }
        } catch (err) {
            console.error('Failed to load chapter pages', err);
            setChapterPages([]);
        } finally {
            setMangaPagesLoading(false);
        }
    };

    const prefetchChapter = (chapter: MangaChapter) => {
        if (!chapterPagesCache.current.has(chapter.url)) {
            const promise = mangaService.getChapterPages(chapter.url);
            chapterPagesCache.current.set(chapter.url, promise);
        }
    };

    const closeMangaReader = () => {
        setSelectedManga(null);
        setMangaChapters([]);
        setCurrentMangaChapter(null);
        setChapterPages([]);
        setChapterSearchQuery('');
    };

    const zoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 100));
    const zoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 30));

    const changeMangaPage = (page: number) => {
        setMangaPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
        // State
        topManga,
        selectedManga,
        mangaChapters,
        currentMangaChapter,
        chapterPages,
        mangaChaptersLoading,
        mangaPagesLoading,
        chapterSearchQuery,
        zoomLevel,
        mangaLoading,
        mangaPage,
        mangaLastPage,

        // Actions
        setChapterSearchQuery,
        handleMangaClick,
        loadMangaChapter,
        prefetchChapter,
        closeMangaReader,
        zoomIn,
        zoomOut,
        changeMangaPage,
    };
}
