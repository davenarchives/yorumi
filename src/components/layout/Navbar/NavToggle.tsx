interface NavToggleProps {
    activeTab: 'anime' | 'manga';
    onTabChange: (tab: 'anime' | 'manga') => void;
    onClearSearch: () => void;
    variant?: 'desktop' | 'mobile';
    onClose?: () => void;
}

export default function NavToggle({
    activeTab,
    onTabChange,
    onClearSearch,
    variant = 'desktop',
    onClose,
}: NavToggleProps) {
    const handleAnimeClick = () => {
        onClearSearch();
        onTabChange('anime');
        onClose?.();
    };

    const handleMangaClick = () => {
        onTabChange('manga');
        onClose?.();
    };

    if (variant === 'mobile') {
        return (
            <div className="flex items-center rounded bg-[#1c1c1c] overflow-hidden border border-transparent">
                <button
                    onClick={handleAnimeClick}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'anime'
                        ? 'bg-yorumi-accent text-[#0a0a0a]'
                        : 'text-gray-500'
                        }`}
                >
                    Anime
                </button>
                <button
                    onClick={handleMangaClick}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'manga'
                        ? 'bg-yorumi-manga text-white'
                        : 'text-gray-500'
                        }`}
                >
                    Manga
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center rounded bg-[#1c1c1c] overflow-hidden border border-transparent hover:border-white/10 transition-colors">
            <button
                onClick={handleAnimeClick}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === 'anime'
                    ? 'bg-yorumi-accent text-[#0a0a0a]'
                    : 'text-gray-500 hover:text-white'
                    }`}
            >
                ANI
            </button>
            <button
                onClick={handleMangaClick}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === 'manga'
                    ? 'bg-yorumi-manga text-white'
                    : 'text-gray-500 hover:text-white'
                    }`}
            >
                MAN
            </button>
        </div>
    );
}
