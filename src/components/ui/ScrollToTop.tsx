import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopProps {
    /** Scroll threshold in pixels before showing the button */
    threshold?: number;
    /** Custom className for additional styling */
    className?: string;
    /** Active tab to determine theme color */
    activeTab?: 'anime' | 'manga';
}

export default function ScrollToTop({ threshold = 400, className = '', activeTab = 'anime' }: ScrollToTopProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > threshold) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });

        // Check initial scroll position
        toggleVisibility();

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const bgColor = activeTab === 'manga' ? 'bg-yorumi-manga' : 'bg-yorumi-accent';
    const hoverColor = activeTab === 'manga' ? 'hover:bg-yorumi-manga/90' : 'hover:bg-yorumi-accent/90';

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`
                fixed bottom-6 right-6 z-50
                w-12 h-12 rounded-full
                ${bgColor}
                text-white shadow-lg
                flex items-center justify-center
                transition-all duration-300 ease-out
                hover:scale-110 ${hoverColor}
                active:scale-95
                ${isVisible
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }
                ${className}
            `}
        >
            <ChevronUp className="w-6 h-6" strokeWidth={2.5} />
        </button>
    );
}
