import { useEffect, useRef, useState } from 'react';

interface NavbarProps {
    activeTab: 'anime' | 'manga';
    searchQuery: string;
    onTabChange: (tab: 'anime' | 'manga') => void;
    onSearchChange: (query: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    onClearSearch: () => void;
    onLogoClick?: () => void;
}

export default function Navbar({
    activeTab,
    searchQuery,
    onTabChange,
    onSearchChange,
    onSearchSubmit,
    onClearSearch,
    onLogoClick,
}: NavbarProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);

    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll for transparent navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Keyboard shortcut to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInputRef.current) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 transition-colors duration-500 ${isScrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 py-3' : 'bg-gradient-to-b from-black via-black/60 to-transparent border-transparent py-4'
            }`}>
            {/* LEFT: Logo & Search */}
            <div className="flex items-center gap-6 md:gap-8 flex-1">
                {/* Logo */}
                <div
                    onClick={onLogoClick || onClearSearch}
                    className="flex items-center cursor-pointer hover:opacity-90 transition-opacity select-none"
                    role="button"
                    tabIndex={0}
                >
                    <span className="text-2xl font-black text-white tracking-tighter">YORU</span>
                    <span className="text-2xl font-black text-yorumi-accent tracking-tighter">MI</span>
                </div>

                {/* Search Bar */}
                <form onSubmit={onSearchSubmit} className="relative group w-full max-w-xs hidden md:block">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-transparent focus:border-white/10 rounded-md py-2 pl-10 pr-10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:bg-[#252525] transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                        <span className="bg-white/10 text-gray-400 text-xs px-1.5 py-0.5 rounded border border-white/10 font-mono leading-none flex items-center justify-center">
                            /
                        </span>
                    </div>
                </form>
            </div>

            {/* CENTER: Anime/Manga Toggle */}
            <div className="flex items-center justify-center flex-1">
                <div className="flex items-center bg-[#1c1c1c] rounded-lg p-1">
                    <button
                        onClick={() => { onClearSearch(); onTabChange('anime'); }}
                        className={`px-6 py-1.5 rounded-md text-sm font-bold uppercase transition-all duration-300 ${activeTab === 'anime'
                            ? 'bg-yorumi-accent text-yorumi-bg shadow-lg shadow-yorumi-accent/20'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Anime
                    </button>
                    <button
                        onClick={() => onTabChange('manga')}
                        className={`px-6 py-1.5 rounded-md text-sm font-bold uppercase transition-all duration-300 ${activeTab === 'manga'
                            ? 'bg-yorumi-main text-white shadow-lg shadow-yorumi-main/30'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Manga
                    </button>
                </div>
            </div>

            {/* RIGHT: Login */}
            <div className="flex items-center justify-end gap-4 flex-1">
                {/* Mobile Search Icon (only visible on small screens) */}
                <button className="md:hidden text-white p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>

                <button className="bg-white/10 hover:bg-white/20 text-white border border-white/5 font-bold uppercase text-xs tracking-wider px-6 py-2.5 rounded transition-colors">
                    Login
                </button>
            </div>
        </nav>
    );
}
