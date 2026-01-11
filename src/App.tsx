import { useState, useEffect } from 'react';
import AnimeCard from './components/AnimeCard';
import './App.css';

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  score: number;
  rank: number;
  status: string;
  type: string;
  episodes: number | null;
}

function App() {
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true); // Initial loading for first batch
  const [loadingMore, setLoadingMore] = useState(false); // For subsequent batches
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        setLoading(true);

        // 1. Fetch first page immediately
        const res = await fetch(`http://localhost:3000/api/jikan/top?page=1`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        // Initial filter and sort
        let initialData = data.data.filter((item: Anime) => item.rank);
        initialData.sort((a: Anime, b: Anime) => a.rank - b.rank);

        setTopAnime(initialData);
        setLoading(false); // Show first batch

        // 2. Fetch subsequent pages progressively
        setLoadingMore(true);
        let currentPage = 2;
        let currentCount = initialData.length; // Start with filtered count

        while (currentCount < 100 && currentPage <= 7) { // Safer limit
          // Reduced delay to 600ms (Jikan allows ~3 req/s, so 600ms is safe and faster)
          await new Promise(resolve => setTimeout(resolve, 600));

          const res = await fetch(`http://localhost:3000/api/jikan/top?page=${currentPage}`);
          if (!res.ok) {
            currentPage++;
            continue;
          }
          const nextData = await res.json();

          setTopAnime(prev => {
            const combined = [...prev, ...nextData.data];
            // Filter duplicates
            let unique = Array.from(new Map(combined.map(item => [item.mal_id, item])).values());

            // Filter out unranked items (keep rank > 100 to fill gaps)
            unique = unique.filter(item => item.rank);

            // Sort by rank explicit asc
            unique.sort((a, b) => a.rank - b.rank);

            // Strictly limit to 100 items (though filter should handle it, this is safety)
            if (unique.length > 100) {
              unique = unique.slice(0, 100);
            }

            currentCount = unique.length; // Update count based on unique items
            return unique;
          });

          currentPage++;
        }
      } catch (err) {
        console.error(err);
        // Only show error if we have 0 items. If we have partial items, it's better to show them.
        if (topAnime.length === 0) {
          setError('Failed to load anime. Please try again later.');
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchTopAnime();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Navbar Placeholder */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#0a0a0a] sticky top-0 z-50 shadow-md shadow-black/20">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold tracking-tighter text-white">YORUMI</h1>
          <div className="flex gap-4 text-sm font-medium text-gray-400">
            <button className="text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors">Anime</button>
            <button className="hover:text-white transition-colors px-4 py-2">Manga</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Search Icon Placeholder */}
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Top Anime</h2>
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <span>Sort by:</span>
            <span className="text-white font-medium cursor-pointer">Ranking</span>
          </div>
        </div>

        {loading && topAnime.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {topAnime.map((anime, index) => (
                <AnimeCard key={anime.mal_id} anime={{ ...anime, rank: index + 1 }} />
              ))}
            </div>

            {loadingMore && (
              <div className="flex justify-center items-center py-8 gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
