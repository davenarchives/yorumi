import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { mangaService } from '../services/mangaService';

interface HotUpdate {
    id: string;
    title: string;
    chapter: string;
    url: string;
    thumbnail: string;
    source: 'mangakatana';
}

interface MangaSpotlightProps {
    onMangaClick: (mangaId: string) => void;
}

const MangaSpotlight: React.FC<MangaSpotlightProps> = ({ onMangaClick }) => {
    const [updates, setUpdates] = useState<HotUpdate[]>([]);
    const [loading, setLoading] = useState(true);

    // Embla Carousel hook with Autoplay
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        duration: 20
    }, [
        Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const data = await mangaService.getHotUpdates();
                if (data?.data) {
                    setUpdates(data.data);
                }
            } catch (err) {
                console.error('Failed to fetch hot updates', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUpdates();
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    const handleNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const handlePrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    if (loading) {
        return <div className="w-full h-[75vh] bg-[#0a0a0a] animate-pulse" />;
    }

    if (updates.length === 0) return null;

    return (
        <div className="relative w-full h-[75vh] min-h-[600px] group bg-[#0a0a0a] overflow-hidden mb-8">
            {/* Embla Viewport */}
            <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
                <div className="flex h-full touch-pan-y">
                    {updates.map((manga, index) => (
                        <div key={index} className="relative min-w-full h-full flex-[0_0_100%]">
                            {/* Background Image (Blurred) */}
                            <div className="absolute inset-0 z-0 select-none overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-no-repeat bg-cover bg-center blur-2xl scale-110 opacity-100"
                                    style={{
                                        backgroundImage: `url(${manga.thumbnail})`,
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/20" />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center px-8 md:px-14 z-10 pointer-events-none">
                                <div className="flex flex-col md:flex-row gap-12 items-center w-full max-w-7xl mx-auto mt-12">

                                    {/* Text Info (Left) */}
                                    <div className="flex-1 pointer-events-auto max-w-2xl">
                                        <div className="text-[#d886ff] font-bold tracking-wider text-base mb-3 uppercase select-none">
                                            Hot Update
                                        </div>
                                        <h1 className={`${manga.title.length > 50 ? 'text-xl md:text-2xl lg:text-3xl' :
                                            manga.title.length > 30 ? 'text-2xl md:text-3xl lg:text-4xl' :
                                                'text-2xl md:text-4xl lg:text-5xl'
                                            } font-black text-white mb-6 leading-[1.1] drop-shadow-lg select-none`}>
                                            {manga.title}
                                        </h1>

                                        <div className="flex items-center flex-wrap gap-5 text-sm text-white mb-10 font-medium select-none">
                                            <span className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                Manga
                                            </span>

                                            <span className="bg-[#22c55e] text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                {manga.chapter}
                                            </span>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => onMangaClick(manga.id)}
                                                className="bg-yorumi-accent text-yorumi-bg px-8 py-3.5 rounded-full font-bold hover:bg-white transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-[0_0_20px_rgba(253,200,73,0.3)] hover:shadow-[0_0_30px_rgba(253,200,73,0.6)]"
                                            >
                                                <div className="bg-yorumi-bg text-white rounded-full p-1.5 -ml-2">
                                                    <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                </div>
                                                Read Chapter
                                            </button>
                                            <button
                                                onClick={() => onMangaClick(manga.id)}
                                                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                                            >
                                                Detail <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Cover Image (Right - Portrait) */}
                                    <div className="hidden md:block w-56 lg:w-64 shrink-0 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] transform rotate-3 hover:rotate-0 transition-all duration-500 border border-white/10">
                                        <img
                                            src={manga.thumbnail}
                                            alt={manga.title}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons (Bottom Right) */}
            <div className="absolute bottom-8 right-8 z-20 flex gap-2">
                <button
                    onClick={handlePrev}
                    className="p-3 bg-black/60 hover:bg-yorumi-accent hover:text-yorumi-bg text-white rounded-lg border border-white/10 transition-all backdrop-blur-md"
                    aria-label="Previous Slide"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                    onClick={handleNext}
                    className="p-3 bg-black/60 hover:bg-yorumi-accent hover:text-yorumi-bg text-white rounded-lg border border-white/10 transition-all backdrop-blur-md"
                    aria-label="Next Slide"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {updates.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => scrollTo(idx)}
                        className={`transition-all duration-300 rounded-full ${idx === selectedIndex ? 'bg-yorumi-accent w-6' : 'bg-white/30 hover:bg-white/50'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MangaSpotlight;
