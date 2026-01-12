import React from 'react';

interface Manga {
    mal_id: number;
    title: string;
    images: {
        jpg: {
            image_url: string;
            large_image_url: string;
        };
    };
    score: number;
    rank?: number;
    status: string;
    type: string;
    chapters: number | null;
    volumes: number | null;
}

interface MangaCardProps {
    manga: Manga;
    onClick: (manga: Manga) => void;
}

const MangaCard: React.FC<MangaCardProps> = ({ manga, onClick }) => {
    return (
        <div onClick={() => onClick(manga)} className="group relative bg-[#1c1333] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yorumi-main/40 cursor-pointer border border-white/5 hover:border-yorumi-accent/50">
            {/* Image Container */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={manga.images.jpg.large_image_url || manga.images.jpg.image_url}
                    alt={manga.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-yorumi-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover Overlay Content */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-yorumi-accent flex items-center justify-center text-yorumi-bg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75 shadow-lg shadow-yorumi-accent/50">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c1.995 0 3.823.707 5.25 1.886a.75.75 0 001-.707V5.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Info Container */}
            <div className="p-4 bg-[#1c1333]">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-yorumi-accent/80 uppercase tracking-wider bg-yorumi-accent/10 px-2 py-0.5 rounded">{manga.type || 'Manga'}</span>
                    {!!manga.rank && <span className="text-[10px] font-bold text-gray-400 tracking-wider">#{manga.rank}</span>}
                </div>

                <h3 className="text-white font-bold text-sm line-clamp-2 mb-3 h-10 leading-snug group-hover:text-yorumi-accent transition-colors" title={manga.title}>
                    {manga.title}
                </h3>

                <div className="flex justify-between items-center text-xs text-gray-400 pt-3 border-t border-white/5">
                    <span className={`px-2 py-1 rounded-sm ${manga.status === 'Publishing' ? 'text-green-400' : 'text-gray-500'} font-medium uppercase tracking-wide text-[10px]`}>
                        {manga.volumes ? `${manga.volumes} VOLS` : '? VOLS'}
                    </span>
                    <div className="flex items-center gap-1 text-white font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-yorumi-accent">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        {manga.score}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MangaCard;
