import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AnimeDetailsPage from './pages/AnimeDetailsPage';
import WatchPage from './pages/WatchPage';
import SearchPage from './pages/SearchPage';
import MangaPage from './pages/MangaPage';
import GenrePage from './pages/GenrePage';
import { useAnime } from './hooks/useAnime';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { closeViewAll } = useAnime();

  // Derive active tab from URL
  const activeTab = location.pathname.startsWith('/manga') ? 'manga' : 'anime';

  // Sync Search Query if we are on search page
  useEffect(() => {
    if (!location.pathname.startsWith('/search')) {
      setSearchQuery('');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: 'anime' | 'manga') => {
    if (tab === 'anime') {
      closeViewAll();
      navigate('/');
    }
    else navigate('/manga');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${activeTab}`);
  };

  const handleLogoClick = () => {
    closeViewAll();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-yorumi-accent selection:text-white overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yorumi-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <Navbar
        activeTab={activeTab}
        searchQuery={searchQuery}
        onTabChange={handleTabChange}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={() => setSearchQuery('')}
        onLogoClick={handleLogoClick}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/anime/:id" element={<AnimeDetailsPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/manga" element={<MangaPage />} />
        <Route path="/genre/:name" element={<GenrePage />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
