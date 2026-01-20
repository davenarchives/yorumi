
import { anilistService } from '../src/api/anilist/anilist.service';

async function testSearch() {
    try {
        console.log('Searching for "Solo Leveling"...');
        const results = await anilistService.searchManga('Solo Leveling', 1, 5);
        if (results && results.media && results.media.length > 0) {
            console.log('Top Result:', {
                id: results.media[0].id,
                title: results.media[0].title,
                format: results.media[0].format
            });
            results.media.forEach((m: any) => {
                console.log(`- [${m.id}] ${m.title.english || m.title.romaji}`);
            });
        } else {
            console.log('No results found.');
        }
    } catch (error) {
        console.error('Search failed:', error);
    }
}

testSearch();
