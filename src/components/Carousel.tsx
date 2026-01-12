import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface CarouselProps {
    title?: string;
    viewAllLink?: string; // Optional: Link to view all items (e.g., full list page)
    children: React.ReactNode;
}

const Carousel: React.FC<CarouselProps> = ({ title, viewAllLink, children }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        slidesToScroll: 'auto',
        containScroll: 'trimSnaps'
    });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <div className="mb-12 group/carousel relative">
            {/* Header */}
            {title && (
                <div className="flex justify-between items-end mb-4 px-2">
                    <h2 className="text-xl font-bold text-white tracking-wide border-l-4 border-yorumi-accent pl-3">
                        {title}
                    </h2>
                    {viewAllLink && (
                        <span className="text-xs font-semibold text-gray-400 hover:text-yorumi-accent cursor-pointer transition-colors uppercase tracking-wider">
                            View All
                        </span>
                    )}
                </div>
            )}

            {/* Navigation Buttons (Visible on Hover) */}
            <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-yorumi-bg/90 border border-yorumi-accent/20 p-3 rounded-full shadow-xl shadow-black/50 opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:translate-x-0 transition-all duration-300 hover:bg-yorumi-accent hover:text-yorumi-bg text-white"
                aria-label="Previous Slide"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-yorumi-bg/90 border border-yorumi-accent/20 p-3 rounded-full shadow-xl shadow-black/50 opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:translate-x-0 transition-all duration-300 hover:bg-yorumi-accent hover:text-yorumi-bg text-white"
                aria-label="Next Slide"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Carousel Viewport */}
            <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
                <div className="flex gap-4 touch-pan-y">
                    {/* Slides need to be wrapped to maintain gap */}
                    {React.Children.map(children, (child) => (
                        <div className="flex-[0_0_45%] sm:flex-[0_0_30%] md:flex-[0_0_24%] lg:flex-[0_0_18%] xl:flex-[0_0_16%] min-w-0">
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {/* Gradient Edges for overflow cue */}
            <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-yorumi-bg to-transparent pointer-events-none z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
            <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-yorumi-bg to-transparent pointer-events-none z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
        </div>
    );
};

export default Carousel;
