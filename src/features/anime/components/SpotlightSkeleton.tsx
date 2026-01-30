import React from 'react';

const SpotlightSkeleton: React.FC = () => {
    return (
        <div className="relative w-full h-[55vh] md:h-[75vh] min-h-[500px] md:min-h-[600px] bg-yorumi-bg overflow-hidden">
            {/* Background Shimmer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute right-0 top-0 w-full md:w-[70%] h-full bg-gradient-to-r from-gray-800/50 to-gray-700/50 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>

            {/* Content Skeleton */}
            <div className="absolute inset-0 flex items-center px-4 md:px-14 z-10">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center w-full max-w-7xl mx-auto pt-16 md:pt-0">
                    {/* Left Column: Text Info Skeleton */}
                    <div className="flex-1 max-w-2xl w-full min-w-0">
                        {/* Spotlight Badge Skeleton */}
                        <div className="flex items-center gap-3 mb-2 md:mb-3">
                            <div className="md:hidden h-16 w-12 rounded bg-gray-700/50 animate-pulse" />
                            <div className="h-4 w-32 bg-gray-700/50 rounded animate-pulse" />
                        </div>

                        {/* Logo/Title Skeleton */}
                        <div className="mb-8 md:mb-12">
                            <div className="h-16 md:h-20 w-3/4 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded animate-pulse" />
                        </div>

                        {/* Metadata Pills Skeleton */}
                        <div className="flex gap-4 mb-4 md:mb-6">
                            <div className="h-10 w-64 bg-gray-700/30 rounded-full animate-pulse" />
                            <div className="h-8 w-16 bg-gray-700/30 rounded animate-pulse" />
                            <div className="h-8 w-20 bg-gray-700/30 rounded animate-pulse" />
                        </div>

                        {/* Synopsis Skeleton */}
                        <div className="space-y-2 mb-6 md:mb-10">
                            <div className="h-4 w-full bg-gray-700/40 rounded animate-pulse" />
                            <div className="h-4 w-full bg-gray-700/40 rounded animate-pulse" />
                            <div className="h-4 w-3/4 bg-gray-700/40 rounded animate-pulse" />
                        </div>

                        {/* Buttons Skeleton */}
                        <div className="flex gap-4">
                            <div className="h-12 md:h-14 w-40 bg-yorumi-accent/20 rounded-full animate-pulse" />
                            <div className="h-12 md:h-14 w-32 bg-white/10 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Dots Skeleton */}
            <div className="absolute z-20 flex gap-2 right-4 top-1/2 -translate-y-1/2 flex-col md:flex-row md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:top-auto md:right-auto md:translate-y-0">
                {[...Array(5)].map((_, idx) => (
                    <div
                        key={idx}
                        className="w-2 h-2 rounded-full bg-white/20 animate-pulse"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    />
                ))}
            </div>

            {/* Shimmer Effect Overlay */}
            <div className="absolute inset-0 z-[5] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>
        </div>
    );
};

export default SpotlightSkeleton;
