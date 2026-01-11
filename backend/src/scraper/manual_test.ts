
import { AnimePaheScraper } from './animepahe';

async function test() {
    const scraper = new AnimePaheScraper();
    try {
        console.log("Searching for 'Frieren'...");
        const searchResults = await scraper.search("Frieren");
        console.log("Search Results:", JSON.stringify(searchResults, null, 2));

        if (searchResults.length > 0) {
            const anime = searchResults[0];
            console.log(`Getting episodes for: ${anime.title} (Session: ${anime.session})`);

            const { episodes } = await scraper.getEpisodes(anime.session);
            console.log(`Found ${episodes.length} episodes.`);
            console.log("First 5 Episodes:", JSON.stringify(episodes.slice(0, 5), null, 2));

            if (episodes.length > 0) {
                const ep = episodes[0];
                console.log(`Getting streams for Episode ${ep.episodeNumber} (Session: ${ep.session})`);
                const streams = await scraper.getLinks(anime.session, ep.session);
                console.log("Streams:", JSON.stringify(streams, null, 2));
            }
        } else {
            console.log("No anime found.");
        }
    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await scraper.close();
    }
}

test();
