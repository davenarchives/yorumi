import MangaCard from '../components/MangaCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import MangaSpotlight from '../components/MangaSpotlight';
import { useManga } from '../hooks/useManga';

export default function MangaPage() {
    const manga = useManga();

    if (manga.mangaLoading && manga.mangaPage === 1) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" text="Loading Manga..." />
            </div>
        );
    }

    // TODO: Create ReaderPage and MangaDetailsPage
    const handleMangaClick = (item: any) => {
        // navigate(`/manga/${item.mal_id}`);
        // For now, since we haven't refactored MangaDetails fully, we might leave this as a TODO
        // or just let the old modal logic stay if we imported the modal?
        // But the goal is "No Modals".
        console.log('Manga clicked', item);
        alert('Manga details page coming soon!');
    };

    const handleSpotlightClick = (mangaId: string) => {
        // Handle click from spotlight (which provides MK ID)
        // Since we don't have full manga object, we might redirect to a generic reader or details 
        // using the ID. For now, matching the behavior of grid items is tricky because they use MAL ID.
        // But our Hot Updates give us MK ID directly.

        console.log('Spotlight clicked', mangaId);
        alert(`Manga details page coming soon! (ID: ${mangaId})`);
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Spotlight Hero Section */}
            <MangaSpotlight onMangaClick={handleSpotlightClick} />

            <div className="container mx-auto px-4 z-10 relative pt-8">
                <h2 className="text-xl font-bold mb-6 text-white border-l-4 border-yorumi-main pl-3">Top Manga</h2>
                {manga.topManga.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {manga.topManga.map((item) => (
                                <MangaCard
                                    key={item.mal_id}
                                    manga={item}
                                    onClick={() => handleMangaClick(item)}
                                />
                            ))}
                        </div>

                        <Pagination
                            currentPage={manga.mangaPage}
                            lastPage={manga.mangaLastPage}
                            onPageChange={manga.changeMangaPage}
                            isLoading={manga.mangaLoading}
                        />
                    </>
                ) : (
                    <div className="text-center text-gray-400 py-12">
                        No manga found.
                    </div>
                )}
            </div>
        </div>
    );
}
