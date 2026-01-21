import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AnimeCard from '../features/anime/components/AnimeCard';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { Anime } from '../types/anime';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper to map AniList response to our Anime interface format
const mapAnilistToAnime = (item: any): Anime => ({
    mal_id: item.idMal || item.id,
    id: item.id,
    title: item.title?.english || item.title?.romaji || 'Unknown',
    images: {
        jpg: {
            image_url: item.coverImage?.large || '',
            large_image_url: item.coverImage?.extraLarge || item.coverImage?.large || ''
        }
    },
    synopsis: item.description?.replace(/<[^>]*>/g, '') || '',
    score: item.averageScore ? item.averageScore / 10 : 0,
    episodes: item.episodes,
    latestEpisode: item.nextAiringEpisode?.episode ? item.nextAiringEpisode.episode - 1 : undefined,
    status: item.status,
    type: item.format,
    genres: item.genres || [],
    year: item.seasonYear || item.startDate?.year,
    anilist_banner_image: item.bannerImage,
    anilist_cover_image: item.coverImage?.extraLarge || item.coverImage?.large,
    duration: item.duration ? `${item.duration} min` : undefined,
    studios: item.studios?.nodes?.map((s: any) => s.name) || [],
    trailer: item.trailer,
});

export default function GenrePage() {
    const { name } = useParams<{ name: string }>();
    const navigate = useNavigate();
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const genreName = decodeURIComponent(name || '');

    useEffect(() => {
        const fetchAnimeByGenre = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/anilist/genre/${encodeURIComponent(genreName)}?page=${currentPage}&limit=24`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();

                const mapped = data.media?.map(mapAnilistToAnime) || [];
                setAnimeList(mapped);
                setLastPage(data.pageInfo?.lastPage || 1);
            } catch (error) {
                console.error('Failed to fetch genre anime:', error);
            } finally {
                setLoading(false);
            }
        };

        if (genreName) {
            fetchAnimeByGenre();
        }
    }, [genreName, currentPage]);

    const handleAnimeClick = (item: Anime) => {
        navigate(`/anime/${item.mal_id}`, { state: { anime: item } });
    };

    const handleWatchClick = (item: Anime) => {
        navigate(`/watch/${item.mal_id}`, { state: { anime: item } });
    };

    return (
        <div className="min-h-screen pb-20 pt-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-2xl font-black text-white tracking-wide">
                        <span className="text-yorumi-accent">{genreName}</span> Anime
                    </h1>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner size="lg" text={`Loading ${genreName} anime...`} />
                    </div>
                ) : animeList.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                        No anime found for this genre
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
                            {animeList.map((item) => (
                                <AnimeCard
                                    key={item.mal_id}
                                    anime={item}
                                    onClick={() => handleAnimeClick(item)}
                                    onWatchClick={() => handleWatchClick(item)}
                                />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            lastPage={lastPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
