

// Mock fetch for node environment since animeService uses fetch
// Actually, simple fetch works in Node 18+.

// We need to bypass the React/Vite dependent animeService and just call the backend scraper URL directly if possible.
// Or just replicate the fetch logic.
const API_BASE = 'http://localhost:3001/api';

async function checkScraper(query) {
    try {
        console.log(`Searching scraper for: ${query}`);
        const searchRes = await fetch(`${API_BASE}/scraper/search?q=${encodeURIComponent(query)}`);
        const searchData = await searchRes.json();

        if (searchData && searchData.length > 0) {
            const bestMatch = searchData[0]; // Assume first one for now
            console.log(`Found session: ${bestMatch.session} (${bestMatch.title})`);

            const epRes = await fetch(`${API_BASE}/scraper/episodes?session=${bestMatch.session}`);
            const epData = await epRes.json();
            const episodes = epData?.episodes || epData?.ep_details || [];

            console.log(`Scraper Episodes Count: ${episodes.length}`);
            if (episodes.length > 0) {
                console.log('First 3 Episodes from Scraper:', JSON.stringify(episodes.slice(0, 3), null, 2));
            }
        } else {
            console.log("No results from scraper.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

checkScraper("Seven Mortal Sins");
