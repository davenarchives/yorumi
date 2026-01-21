import { Shuffle } from 'lucide-react';

interface RandomButtonProps {
    isLoading: boolean;
    onClick: () => void;
    variant?: 'desktop' | 'mobile';
}

export default function RandomButton({
    isLoading,
    onClick,
    variant = 'desktop',
}: RandomButtonProps) {
    if (variant === 'mobile') {
        return (
            <button
                onClick={onClick}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white bg-[#1c1c1c] rounded border border-transparent hover:border-white/10 transition-all"
            >
                <Shuffle className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Random
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className="group flex items-center justify-center p-2 text-gray-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Random Anime"
        >
            <Shuffle className={`w-5 h-5 group-hover:text-yorumi-accent transition-all duration-300 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
        </button>
    );
}
