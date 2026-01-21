import LoadingSpinner from '../../../components/ui/LoadingSpinner';

interface VideoPlayerProps {
    streamUrl?: string;
    isLoading: boolean;
    isExpanded: boolean;
}

export default function VideoPlayer({
    streamUrl,
    isLoading,
    isExpanded
}: VideoPlayerProps) {
    return (
        <div className={`relative w-full ${isExpanded ? 'flex-1 min-h-[300px]' : 'aspect-video shrink-0'} bg-black group transition-all duration-300`}>
            {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-400 animate-pulse">Loading Stream...</p>
                </div>
            ) : streamUrl ? (
                <iframe
                    key={streamUrl}
                    src={streamUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    allow="autoplay"
                    title="Video Player"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <span className="mb-2 text-6xl opacity-20">▶</span>
                    <p>Select an episode</p>
                </div>
            )}
        </div>
    );
}
